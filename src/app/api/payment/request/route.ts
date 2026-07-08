import {
    buildCustomerInputRest,
    buildLineItems,
    buildShippingLines,
    createIdempotencyKey,
    getClientCartTotal,
    getShippingMethodTitle,
    parseGatewayAmount,
    validateCheckoutPayload,
} from '@/lib/order-utils';
import { zibal, ZibalHttpError, ZIBAL_RESULT_CODES } from '@/lib/zibal';
import { saveTrack } from '@/lib/payment-track-cache';
import { idempotencyCacheHas, idempotencyCacheAdd, idempotencyCacheDelete } from '@/lib/idempotency-cache';
import { checkWooCommerceConfig, createOrder, updateOrder } from '@/lib/woocommerce-rest';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { requireAuth, setRefreshedCookie } from '@/lib/auth-headers';
import { logger } from '@/lib/logger';
import { apiSuccess, apiError } from '@/lib/api-response';
import { extractUserIdFromToken } from '@/lib/jwt-utils';
import crypto from 'crypto';

// Zibal maximum transaction amount in Rials (4 billion IRR)
// Transactions above this limit automatically fall back to card-to-card payment
const ZIBAL_MAX_AMOUNT = 4_000_000_000;

// extractUserIdFromToken moved to @/lib/jwt-utils

const getOrigin = (request: Request) => {
    // Always check the actual request host first.
    // If the API call comes from localhost (local dev), Zibal must redirect
    // back to localhost — not the production URL.
    // CRITICAL: x-forwarded-host may contain multiple comma-separated values
    // (e.g., "vna-co.ir, vna-co.ir") — take only the first.
    const rawHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    const host = rawHost.split(',')[0].trim();

    // In sandbox mode OR when accessed from localhost, use the request's actual host
    // so Zibal redirects back to the local dev server, not the production URL.
    const isSandbox = process.env.ZIBAL_SANDBOX === 'true';
    const isLocalhost = host && (host.startsWith('localhost') || host.startsWith('127.0.0.1'));

    if (isSandbox || isLocalhost) {
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        return `${protocol}://${host || 'localhost:3000'}`;
    }

    // Production: use the configured site URL
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
    }

    // Fallback: derive from request headers
    const fallbackHost = host || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    return `${protocol}://${fallbackHost}`;
};

export const POST = withRateLimit(
    async (request: Request) => {
    try {
        // SECURITY: Require authenticated user — prevents anonymous payment creation
        const authResult = await requireAuth();
        if (!authResult.ok) return authResult.response;

        // Check WooCommerce API credentials before doing anything
        const wooConfigError = checkWooCommerceConfig();
        if (wooConfigError) {
            logger.error('Missing WooCommerce API credentials', { error: wooConfigError });
            return apiError('سرویس پرداخت در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 503);
        }

        // Check Zibal merchant
        if (!process.env.ZIBAL_MERCHANT) {
            logger.error('ZIBAL_MERCHANT is not configured');
            return apiError('درگاه پرداخت تنظیم نشده است. لطفاً با مدیر سایت تماس بگیرید.', 503);
        }

        const { formData, cartItems, shippingMethod } = await request.json();
        const validationError = validateCheckoutPayload(formData, cartItems);

        if (validationError) {
            return apiError(validationError, 400);
        }

        const idempotencyKey = createIdempotencyKey(formData, cartItems);
        if (idempotencyCacheHas(idempotencyKey)) {
            return apiError('سفارش مشابهی به تازگی در حال پردازش است. لطفا چند دقیقه صبر کنید.', 429);
        }

        idempotencyCacheAdd(idempotencyKey);

        const lineItems = buildLineItems(cartItems);
        if (lineItems.length === 0) {
            idempotencyCacheDelete(idempotencyKey);
            return apiError('شناسه محصولات سبد خرید معتبر نیست.', 400);
        }

        const paymentToken = crypto.randomBytes(16).toString('hex');
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);

        // Extract WordPress user ID from JWT token for customer_id linking
        const wpUserId = extractUserIdFromToken(authResult.token);
        if (!wpUserId) {
            logger.warn('Could not extract WordPress user ID from JWT token — order will be created as guest');
        }

        // Build order input for WooCommerce REST API
        const billing = buildCustomerInputRest(formData);
        const wcOrderInput = {
            payment_method: 'zibal',
            payment_method_title: 'پرداخت آنلاین زیبال',
            status: 'pending',
            ...(wpUserId ? { customer_id: wpUserId } : {}),
            billing,
            shipping: billing,
            customer_note: `Tax ID (کد/شناسه ملی): ${formData.taxId || ''}`,
            line_items: lineItems,
            shipping_lines: buildShippingLines(shippingMethod || 'snapp_express'),
            meta_data: [
                { key: 'secure_token', value: paymentToken },
                { key: 'payment_expires_at', value: expiryDate.toISOString() },
                { key: 'national_code', value: formData.taxId || '' },
                { key: 'shipping_courier', value: getShippingMethodTitle(shippingMethod || 'snapp_express') },
                { key: 'shipping_method_id', value: shippingMethod || 'snapp_express' },
            ],
        };

        // Create order via WooCommerce REST API
        let order;
        try {
            order = await createOrder(wcOrderInput);
        } catch (error: unknown) {
            idempotencyCacheDelete(idempotencyKey);
            logger.error('WooCommerce REST createOrder failed', undefined, error instanceof Error ? error : new Error('خطای ناشناخته'));
            return apiError('خطا در ثبت سفارش. لطفاً بعداً تلاش کنید.', 502);
        }

        if (!order?.id) {
            idempotencyCacheDelete(idempotencyKey);
            return apiError('پاسخ نامعتبر از سرور فروشگاه دریافت شد.', 502);
        }

        // SECURITY: parseGatewayAmount no longer falls back to client prices.
        const amount = parseGatewayAmount(order.total);
        const clientTotal = getClientCartTotal(cartItems);

        // Log comparison for fraud detection
        if (amount !== null && Math.abs(amount - Math.round(clientTotal)) > 1000) {
            logger.warn('Price mismatch detected', { serverAmount: amount, clientAmount: Math.round(clientTotal), orderId: order.id });
        }

        if (amount === null || amount < 1000) {
            idempotencyCacheDelete(idempotencyKey);
            return apiError('مبلغ سفارش برای پرداخت معتبر نیست.', 400);
        }

        // ── Amount exceeds Zibal limit → auto-fallback to card-to-card ──
        // Zibal max is 4,000,000,000 IRR. For high-value B2B orders,
        // automatically switch to card-to-card payment instead of failing.
        if (amount > ZIBAL_MAX_AMOUNT) {
            logger.info('Amount exceeds Zibal limit, falling back to card-to-card', {
                amount,
                limit: ZIBAL_MAX_AMOUNT,
                orderId: order.id,
            });

            // Update the existing order to card-to-card payment method
            try {
                await updateOrder(order.id, {
                    payment_method: 'bacs',
                    payment_method_title: 'کارت به کارت (سقف درگاه)',
                    status: 'on-hold',
                    meta_data: [
                        { key: 'auto_fallback_reason', value: `مبلغ ${amount} ریال از سقف درگاه (${ZIBAL_MAX_AMOUNT} ریال) بیشتر است` },
                    ],
                });
            } catch (updateError) {
                logger.error('Failed to update order to card-to-card', { orderId: order.id }, updateError instanceof Error ? updateError : undefined);
                // Don't fail — the order was created, just log the issue
            }

            const response = apiSuccess({
                orderId: order.id,
                token: paymentToken,
                flow: 'card2card',
                message: 'مبلغ سفارش از سقف درگاه آنلاین بیشتر است. لطفاً از طریق کارت به کارت پرداخت کنید.',
            });
            await setRefreshedCookie(response, authResult);
            return response;
        }

        // Zibal callback URL — Zibal will append trackId and success params
        const callbackUrl = `${getOrigin(request)}/payment/callback`;

        const paymentResponse = await zibal.request(
            amount,
            callbackUrl,
            `پرداخت سفارش شماره ${order.id}`,
            String(order.id)
        );

        if (paymentResponse.result === ZIBAL_RESULT_CODES.SUCCESS && paymentResponse.trackId) {
            // Store trackId → order mapping in cache for verify route
            saveTrack(paymentResponse.trackId, {
                orderId: order.id,
                amount,
                secureToken: paymentToken,
                createdAt: Date.now(),
            });

            const response = apiSuccess({
                orderId: order.id,
                trackId: paymentResponse.trackId,
                url: zibal.getPaymentUrl(paymentResponse.trackId),
            });
            await setRefreshedCookie(response, authResult);
            return response;
        }

        idempotencyCacheDelete(idempotencyKey);

        // Provide specific Zibal error messages
        const zibalResultCode = paymentResponse.result;
        const zibalMessage = paymentResponse.message;
        logger.error('Zibal request failed', { result: zibalResultCode, message: zibalMessage });

        let userError = 'درخواست پرداخت توسط درگاه پذیرفته نشد.';
        if (zibalResultCode === ZIBAL_RESULT_CODES.AMOUNT_TOO_LOW) {
            userError = 'مبلغ سفارش خارج از محدوده مجاز درگاه پرداخت است. لطفاً با پشتیبانی تماس بگیرید.';
        } else if (zibalResultCode === ZIBAL_RESULT_CODES.INVALID_MERCHANT) {
            userError = 'تنظیمات درگاه پرداخت ناقص است. لطفاً با مدیر سایت تماس بگیرید.';
        } else if (zibalResultCode === ZIBAL_RESULT_CODES.INVALID_IP) {
            userError = 'درگاه پرداخت در حال تنظیم است. لطفاً بعداً تلاش کنید.';
        } else if (zibalResultCode === ZIBAL_RESULT_CODES.EXPIRED || zibalResultCode === ZIBAL_RESULT_CODES.NOT_FOUND) {
            userError = 'درخواست پرداخت یافت نشد. لطفاً دوباره تلاش کنید.';
        }

        return apiError(userError, 502);
    } catch (error: unknown) {
        if (error instanceof ZibalHttpError) {
            logger.error('Zibal HTTP error during payment request', { status: error.status, body: JSON.stringify(error.body) });
            return apiError('درگاه پرداخت در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 502);
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
            return apiError('زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.', 504);
        }
        logger.error('Payment request error', undefined, error instanceof Error ? error : new Error('خطای ناشناخته'));
        return apiError('خطای داخلی سرور. لطفاً بعداً تلاش کنید.', 500);
    }
},
RATE_LIMIT_PRESETS.default,
'payment-request'
);
