import {
    buildCustomerInputRest,
    buildLineItems,
    buildShippingLines,
    createIdempotencyKey,
    getShippingMethodTitle,
    validateCheckoutPayload,
} from '@/lib/order-utils';
import { idempotencyCacheHas, idempotencyCacheAdd, idempotencyCacheDelete } from '@/lib/idempotency-cache';
import { checkWooCommerceConfig, createOrder } from '@/lib/woocommerce-rest';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { requireAuth, setRefreshedCookie } from '@/lib/auth-headers';
import { logger } from '@/lib/logger';
import { apiSuccess, apiError } from '@/lib/api-response';
import { extractUserIdFromToken } from '@/lib/jwt-utils';
import crypto from 'crypto';

// extractUserIdFromToken moved to @/lib/jwt-utils

export const POST = withRateLimit(
    async (request: Request) => {
    try {
        // SECURITY: Require authenticated user — prevents anonymous order creation
        const authResult = await requireAuth();
        if (!authResult.ok) return authResult.response;

        // Check WooCommerce API credentials
        const configError = checkWooCommerceConfig();
        if (configError) {
            logger.error('Missing WooCommerce API credentials for order creation');
            return apiError('سرویس ثبت سفارش در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 503);
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

        const successToken = crypto.randomBytes(16).toString('hex');
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 72);

        // Extract WordPress user ID from JWT token for customer_id linking
        const wpUserId = extractUserIdFromToken(authResult.token);
        if (!wpUserId) {
            logger.warn('Could not extract WordPress user ID from JWT token — order will be created as guest');
        }

        const billing = buildCustomerInputRest(formData);

        try {
            const order = await createOrder({
                payment_method: 'bacs',
                payment_method_title: 'کارت به کارت',
                status: 'on-hold',
                ...(wpUserId ? { customer_id: wpUserId } : {}),
                billing,
                shipping: billing,
                customer_note: `Tax ID (کد/شناسه ملی): ${formData.taxId || ''}`,
                line_items: lineItems,
                shipping_lines: buildShippingLines(shippingMethod || 'snapp_express'),
                meta_data: [
                    { key: 'secure_token', value: successToken },
                    { key: 'reservation_expiry', value: expiryDate.toISOString() },
                    { key: 'national_code', value: formData.taxId || '' },
                    { key: 'shipping_courier', value: getShippingMethodTitle(shippingMethod || 'snapp_express') },
                    { key: 'shipping_method_id', value: shippingMethod || 'snapp_express' },
                ],
            });

            const response = apiSuccess({
                orderId: order.id,
                token: successToken,
                message: 'سفارش با موفقیت ایجاد شد.',
            });
            await setRefreshedCookie(response, authResult);
            return response;
        } catch (error: unknown) {
            idempotencyCacheDelete(idempotencyKey);
            logger.error('WooCommerce REST createOrder failed', undefined, error instanceof Error ? error : new Error('خطای ناشناخته'));
            return apiError('خطا در ثبت سفارش. لطفاً بعداً تلاش کنید.', 502);
        }
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return apiError('زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.', 504);
        }
        logger.error('Critical API Error in /api/order/create', undefined, error instanceof Error ? error : new Error('خطای ناشناخته'));
        return apiError('خطای سیستمی در پردازش سفارش. لطفاً بعداً تلاش کنید.', 500);
    }
},
RATE_LIMIT_PRESETS.default,
'order-create'
);
