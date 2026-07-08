/**
 * POST /api/auth/forgot-password
 *
 * Triggers a WordPress password reset email for the given email address.
 * Proxies to WordPress's built-in lostpassword endpoint.
 *
 * Security:
 * - Always returns success even if the email doesn't exist (prevents enumeration)
 * - Rate limited with auth preset (10/min per IP) to prevent abuse
 * - Validates email format before processing
 *
 * Strategy (Rule #9): The WordPress integration approach is pluggable —
 * replace the `triggerWordPressReset` function to switch from form-post
 * to REST API or custom endpoint without changing the route handler.
 */

import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';
import { apiSuccess, apiError } from '@/lib/api-response';

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL
    ? process.env.NEXT_PUBLIC_WP_API_URL.replace(/\/wp-json$/, '')
    : 'https://wordpress.vna-co.ir';

const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Trigger WordPress password reset.
 *
 * Uses WordPress's built-in lostpassword action by submitting form data
 * to wp-login.php. This is the simplest reliable approach that works
 * with any WordPress configuration.
 *
 * Alternative strategies can be plugged in here:
 * - Custom REST API endpoint: POST /wp-json/custom/v1/reset-password
 * - WooCommerce customer lookup + wp/v2 users endpoint
 */
async function triggerWordPressReset(email: string): Promise<boolean> {
    try {
        const response = await fetchWithTimeout(
            `${WP_BASE_URL}/wp-login.php?action=lostpassword`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    user_login: email,
                    redirect_to: '',
                    'wp-submit': 'Get New Password',
                }).toString(),
            },
            10000 // 10s timeout
        );

        // WordPress lostpassword returns 200 regardless of whether
        // the email exists — which aligns with our security requirement
        return response.ok;
    } catch (error) {
        logger.error('WordPress lostpassword request failed', undefined, error instanceof Error ? error : undefined);
        return false;
    }
}

export const POST = withRateLimit(
    async (request: Request) => {
        try {
            const body = await request.json();
            const { email } = body as { email?: string };

            // Validate email format
            if (!email || typeof email !== 'string' || !email.trim()) {
                return apiError('لطفاً آدرس ایمیل خود را وارد کنید.', 400);
            }

            if (!validateEmail(email.trim())) {
                return apiError('لطفاً یک آدرس ایمیل معتبر وارد کنید.', 400);
            }

            // Trigger WordPress password reset
            // We don't await the result for the response — always return success
            // to prevent email enumeration attacks
            const resetResult = await triggerWordPressReset(email.trim());

            if (!resetResult) {
                // Log the failure but still return success to the client
                // (prevents email enumeration)
                logger.warn('WordPress password reset request may have failed', { email: email.trim() });
            }

            return apiSuccess({
                message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد.',
            });
        } catch (error: unknown) {
            logger.error('Forgot password error', undefined, error instanceof Error ? error : new Error('خطای ناشناخته'));
            return apiError('خطای سیستمی رخ داد. لطفاً بعداً تلاش کنید.', 500);
        }
    },
    RATE_LIMIT_PRESETS.auth,
    'auth-forgot-password'
);
