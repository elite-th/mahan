import { checkWooCommerceConfig, getOrder } from '@/lib/woocommerce-rest';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { requireAuth, setRefreshedCookie } from '@/lib/auth-headers';
import { logger } from '@/lib/logger';
import { apiSuccess, apiError } from '@/lib/api-response';
import crypto from 'crypto';

export const POST = withRateLimit(
    async (request: Request) => {
    try {
        const { orderId, token } = await request.json();

        if (!orderId || !token) {
            return apiError('پارامترهای درخواست ناقص است.', 400);
        }

        // Require auth for order verification
        const authResult = await requireAuth();
        if (!authResult.ok) return authResult.response;

        // Check WooCommerce credentials
        const configError = checkWooCommerceConfig();
        if (configError) {
            return apiError('سرویس تأیید سفارش در حال حاضر در دسترس نیست.', 503);
        }

        // Fetch order via WooCommerce REST API
        let order;
        try {
            order = await getOrder(Number(orderId));
        } catch (error: unknown) {
            logger.error('Failed to fetch order for verification', { orderId }, error instanceof Error ? error : new Error('خطای ناشناخته'));
            return apiError('سفارش یافت نشد یا دسترسی ممکن نیست.', 404);
        }

        const metaData = order.meta_data || [];
        const storedToken = metaData.find((item: { key: string; value: string }) => item.key === 'secure_token')?.value;

        // Use constant-time comparison to prevent timing attacks
        if (!storedToken || typeof storedToken !== 'string' || typeof token !== 'string') {
            return apiError('توکن امنیتی نامعتبر است.', 403);
        }

        const tokenBuf = Buffer.from(String(storedToken));
        const providedBuf = Buffer.from(token);
        if (tokenBuf.length !== providedBuf.length || !crypto.timingSafeEqual(tokenBuf, providedBuf)) {
            return apiError('توکن امنیتی نامعتبر است.', 403);
        }

        // Check if reservation has expired
        const expiry = metaData.find((item: { key: string; value: string }) => item.key === 'reservation_expiry')?.value;
        if (expiry && new Date(expiry).getTime() < Date.now()) {
            return apiError('مهلت رزرو سفارش منقضی شده است. لطفاً با پشتیبانی تماس بگیرید.', 410);
        }

        const response = apiSuccess({
            order: {
                id: order.id,
                total: order.total,
                status: order.status,
                expiry,
            },
        });
        await setRefreshedCookie(response, authResult);
        return response;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return apiError('زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.', 504);
        }
        logger.error('Verify order error', undefined, error instanceof Error ? error : undefined);
        return apiError('خطای داخلی سرور. لطفاً بعداً تلاش کنید.', 500);
    }
},
RATE_LIMIT_PRESETS.default,
'order-verify'
);
