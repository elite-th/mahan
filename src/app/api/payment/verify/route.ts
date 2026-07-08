import { zibal, ZibalHttpError, ZIBAL_RESULT_CODES } from '@/lib/zibal';
import { getTrack, deleteTrack } from '@/lib/payment-track-cache';
import { getOrder, updateOrder } from '@/lib/woocommerce-rest';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { apiSuccess, apiError } from '@/lib/api-response';

// Per-order lock — prevents double-processing from Zibal network retries
const LOCK_TIMEOUT_MS = 30_000; // 30 seconds
const processingOrders = new Set<string>();

const lockOrder = (orderId: number): boolean => {
    const key = String(orderId);
    if (processingOrders.has(key)) return false; // already being processed
    processingOrders.add(key);
    setTimeout(() => processingOrders.delete(key), LOCK_TIMEOUT_MS);
    return true;
};

const unlockOrder = (orderId: number) => {
    processingOrders.delete(String(orderId));
};

/**
 * Mark order as processing after successful payment verification.
 * Re-throws on failure so caller knows the update failed.
 */
const markOrderProcessing = async (orderId: number, refNumber: string, trackId: number) => {
    try {
        await updateOrder(orderId, {
            status: 'processing',
            meta_data: [
                { key: 'payment_ref_id', value: String(refNumber) },
                { key: 'payment_track_id', value: String(trackId) },
                { key: 'payment_verified_at', value: new Date().toISOString() },
            ],
        });
    } catch (error) {
        logger.error('Order status update failed after successful payment', { orderId, refNumber, trackId }, error instanceof Error ? error : undefined);
        logger.error('Manual review needed: order paid but status not updated', { orderId, refNumber, trackId });
        throw error; // re-throw so caller knows the update failed
    }
};

/**
 * POST /api/payment/verify
 *
 * Called by the client-side VerifyPayment component after Zibal redirects
 * the user back to the callback page. Receives trackId in the request body,
 * looks up the associated order, and verifies the payment with Zibal.
 *
 * FALLBACK: If trackId is not found in our in-memory cache (e.g., server
 * restarted between payment request and callback), we verify directly with
 * Zibal. If Zibal confirms the payment was successful (code 100 or 101),
 * we extract the orderId from Zibal's response and update WooCommerce.
 */
export const POST = withRateLimit(
    async (request: Request) => {
    try {
        const { trackId } = await request.json();

        if (!trackId || typeof trackId !== 'number' || !Number.isFinite(trackId)) {
            return apiError('شناسه تراکنش نامعتبر است.', 400);
        }

        // Look up order info from our track cache
        const trackInfo = getTrack(trackId);

        // FALLBACK: If trackInfo not in cache (server restart, cache expired, etc.)
        // but Zibal confirms payment was successful, we can still process it.
        if (!trackInfo) {
            logger.info('Track ID not found in cache, attempting direct Zibal verify as fallback', { trackId });

            try {
                const verifyResponse = await zibal.verify(trackId);
                const code = verifyResponse.result;

                if (code === ZIBAL_RESULT_CODES.SUCCESS || code === ZIBAL_RESULT_CODES.ALREADY_VERIFIED) {
                    const refNumber = verifyResponse.refNumber;
                    // Extract orderId from Zibal response
                    const zibalOrderId = verifyResponse.orderId ? Number(verifyResponse.orderId) : null;

                    if (!zibalOrderId || !Number.isFinite(zibalOrderId)) {
                        logger.error('Zibal verify succeeded but no valid orderId returned', { trackId, zibalOrderId });
                        return apiError('اطلاعات تراکنش ناقص است. لطفاً با پشتیبانی تماس بگیرید.', 400);
                    }

                    // Check if order is already processed
                    try {
                        const existingOrder = await getOrder(zibalOrderId);
                        if (existingOrder.status === 'processing' || existingOrder.status === 'completed') {
                            const existingRefId = existingOrder.meta_data?.find(
                                (m: { key: string; value: string }) => m.key === 'payment_ref_id'
                            )?.value;

                            return apiSuccess({
                                status: 'success',
                                orderId: zibalOrderId,
                                refId: existingRefId || refNumber,
                                trackId,
                            });
                        }

                        // Order exists but not yet processed — update it
                        if (!lockOrder(zibalOrderId)) {
                            return apiSuccess({
                                status: 'already_processing',
                                orderId: zibalOrderId,
                                message: 'تراکنش در حال پردازش است.',
                            });
                        }

                        try {
                            await markOrderProcessing(zibalOrderId, refNumber, trackId);
                        } catch {
                            return apiSuccess({
                                status: 'order_update_failed',
                                orderId: zibalOrderId,
                                refId: refNumber,
                                trackId,
                                message: 'پرداخت تأیید شد اما ثبت وضعیت سفارش با مشکل مواجه شد. لطفاً با پشتیبانی تماس بگیرید.',
                            });
                        }

                        return apiSuccess({
                            status: 'success',
                            orderId: zibalOrderId,
                            refId: refNumber,
                            trackId,
                            cardNumber: verifyResponse.cardNumber,
                        });
                    } catch (orderError) {
                        logger.error('Failed to fetch/update order after Zibal fallback verify', { zibalOrderId, trackId }, orderError instanceof Error ? orderError : undefined);
                        return apiError('خطا در به‌روزرسانی وضعیت سفارش. لطفاً با پشتیبانی تماس بگیرید.', 502);
                    }
                }

                // Zibal verify also failed — payment was not completed
                logger.warn('Zibal verify returned non-success result (fallback path)', {
                    result: code,
                    message: verifyResponse.message,
                    trackId,
                });

                const reasonMap: Record<number, string> = {
                    [ZIBAL_RESULT_CODES.FAILED]: 'gateway_rejected',
                    [ZIBAL_RESULT_CODES.FAILED_PENDING]: 'gateway_rejected',
                    [ZIBAL_RESULT_CODES.INVALID]: 'gateway_rejected',
                    [ZIBAL_RESULT_CODES.EXPIRED]: 'session_expired',
                    [ZIBAL_RESULT_CODES.NOT_FOUND]: 'session_expired',
                    [ZIBAL_RESULT_CODES.NOT_FOUND_TRACK]: 'session_expired',
                };

                return apiSuccess({
                    status: 'failed',
                    reason: reasonMap[code] || 'gateway_rejected',
                    trackId,
                    message: verifyResponse.message,
                });
            } catch (zibalError) {
                if (zibalError instanceof ZibalHttpError) {
                    logger.error('Zibal HTTP error during fallback verify', { status: zibalError.status, trackId });
                    return apiError('درگاه پرداخت در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 502);
                }
                logger.error('Zibal fallback verify error', { trackId }, zibalError instanceof Error ? zibalError : undefined);
                return apiError('خطا در تأیید پرداخت. لطفاً با پشتیبانی تماس بگیرید.', 500);
            }
        }

        // ── Normal path: trackInfo found in cache ──
        const { orderId, amount, secureToken } = trackInfo;

        // Validate secureToken against WooCommerce order meta_data
        try {
            const existingOrder = await getOrder(orderId);
            const orderSecureToken = existingOrder.meta_data?.find(
                (m: { key: string; value: string }) => m.key === 'secure_token'
            )?.value;

            if (!orderSecureToken || orderSecureToken !== secureToken) {
                logger.error('Secure token mismatch — possible tampering', { orderId, trackId });
                return apiError('توکن امنیتی نامعتبر است.', 403);
            }
        } catch (error) {
            logger.warn('Could not verify secure token from WooCommerce', { orderId }, error instanceof Error ? error : undefined);
            // Proceed with caution — WooCommerce might be temporarily unavailable
        }

        // Per-order lock — prevent double-processing
        if (!lockOrder(orderId)) {
            // Already being processed by another concurrent request
            return apiSuccess({
                status: 'already_processing',
                orderId,
                message: 'تراکنش در حال پردازش است.',
            });
        }

        try {
            // Check if order is already processing (idempotency)
            try {
                const existingOrder = await getOrder(orderId);
                if (existingOrder.status === 'processing' || existingOrder.status === 'completed') {
                    const existingRefId = existingOrder.meta_data?.find(
                        (m: { key: string; value: string }) => m.key === 'payment_ref_id'
                    )?.value;

                    deleteTrack(trackId);

                    return apiSuccess({
                        status: 'success',
                        orderId,
                        refId: existingRefId || 'N/A',
                        trackId,
                    });
                }
            } catch {
                // If we can't fetch the order, proceed with verification
            }

            // Verify with Zibal
            const verifyResponse = await zibal.verify(trackId);
            const code = verifyResponse.result;

            if (code === ZIBAL_RESULT_CODES.SUCCESS || code === ZIBAL_RESULT_CODES.ALREADY_VERIFIED) {
                const refNumber = verifyResponse.refNumber;

                // Security: verify the amount matches what we expect
                // For ALREADY_VERIFIED (101), skip amount check since Zibal may return 0
                if (code === ZIBAL_RESULT_CODES.SUCCESS) {
                    const unit = process.env.ZIBAL_AMOUNT_UNIT?.toLowerCase() || 'rial';
                    const expectedInRials = unit === 'toman' ? Math.round(amount) * 10 : Math.round(amount);

                    if (verifyResponse.amount !== expectedInRials) {
                        logger.error('Amount mismatch in verify response', {
                            expectedRials: expectedInRials,
                            receivedRials: verifyResponse.amount,
                            unit,
                            orderId,
                            trackId,
                        });
                        return apiError('اختلاف مبلغ پرداخت. لطفاً با پشتیبانی تماس بگیرید.', 400);
                    }
                }

                try {
                    await markOrderProcessing(orderId, refNumber, trackId);
                } catch {
                    // Payment was verified but order status update failed.
                    deleteTrack(trackId);
                    return apiSuccess({
                        status: 'order_update_failed',
                        orderId,
                        refId: refNumber,
                        trackId,
                        message: 'پرداخت تأیید شد اما ثبت وضعیت سفارش با مشکل مواجه شد. لطفاً با پشتیبانی تماس بگیرید.',
                    });
                }

                deleteTrack(trackId);

                return apiSuccess({
                    status: 'success',
                    orderId,
                    refId: refNumber,
                    trackId,
                    cardNumber: verifyResponse.cardNumber,
                });
            }

            // Payment failed or rejected
            logger.warn('Zibal verify returned non-success result', {
                result: code,
                message: verifyResponse.message,
                orderId,
                trackId,
            });

            const reasonMap: Record<number, string> = {
                [ZIBAL_RESULT_CODES.FAILED]: 'gateway_rejected',
                [ZIBAL_RESULT_CODES.FAILED_PENDING]: 'gateway_rejected',
                [ZIBAL_RESULT_CODES.INVALID]: 'gateway_rejected',
                [ZIBAL_RESULT_CODES.EXPIRED]: 'session_expired',
                [ZIBAL_RESULT_CODES.NOT_FOUND]: 'session_expired',
                [ZIBAL_RESULT_CODES.NOT_FOUND_TRACK]: 'session_expired',
            };

            deleteTrack(trackId);

            return apiSuccess({
                status: 'failed',
                reason: reasonMap[code] || 'gateway_rejected',
                orderId,
                trackId,
                message: verifyResponse.message,
            });
        } finally {
            unlockOrder(orderId);
        }
    } catch (error) {
        if (error instanceof ZibalHttpError) {
            logger.error('Zibal HTTP error during payment verification', { status: error.status });
            return apiError('درگاه پرداخت در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 502);
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
            return apiError('زمان پاسخگویی درگاه پرداخت به پایان رسید. لطفاً دوباره تلاش کنید.', 504);
        }
        logger.error('Payment verification error', undefined, error instanceof Error ? error : undefined);
        return apiError('خطای سرور رخ داده است.', 500);
    }
},
RATE_LIMIT_PRESETS.default,
'payment-verify'
);
