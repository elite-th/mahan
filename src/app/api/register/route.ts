import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';
import { extractUserIdFromTokenAsString } from '@/lib/jwt-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';
const WP_APP_USERNAME = process.env.WP_APP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const POST = withRateLimit(
    async (request: NextRequest) => {
    try {
        const { username, email, password, website } = await request.json();

        // --- Layer 1: Honeypot bot protection (cheap, first line) ---
        // The 'website' field is hidden from real users. Bots fill it →
        // we return a FAKE success so the bot thinks it worked.
        if (website) {
            logger.warn('Register: honeypot triggered — bot detected', { username, email });
            return NextResponse.json(
                { success: true, message: 'ثبت‌نام با موفقیت انجام شد!' },
                { status: 200 }
            );
        }

        // --- Server-side validation ---
        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'نام کاربری، ایمیل و رمز عبور الزامی است.' },
                { status: 400 }
            );
        }

        if (username.length < 3 || username.length > 60) {
            return NextResponse.json(
                { success: false, error: 'نام کاربری باید بین ۳ تا ۶۰ کاراکتر باشد.' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'فرمت ایمیل صحیح نیست.' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' },
                { status: 400 }
            );
        }

        if (!/[a-zA-Z]/.test(password)) {
            return NextResponse.json(
                { success: false, error: 'رمز عبور باید شامل حداقل یک حرف انگلیسی باشد.' },
                { status: 400 }
            );
        }

        if (!/[0-9]/.test(password)) {
            return NextResponse.json(
                { success: false, error: 'رمز عبور باید شامل حداقل یک عدد باشد.' },
                { status: 400 }
            );
        }

        // --- Check Application Password config ---
        if (!WP_APP_USERNAME || !WP_APP_PASSWORD) {
            logger.error('Register: WP_APP_USERNAME or WP_APP_PASSWORD not configured');
            return NextResponse.json(
                { success: false, error: 'سرویس ثبت‌نام پیکربندی نشده است.' },
                { status: 503 }
            );
        }

        // --- Call custom WordPress registration endpoint ---
        // This endpoint uses wp_insert_user() + wp_set_password() — guaranteed correct.
        const appAuth = Buffer.from(`${WP_APP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

        try {
            const wpResponse = await fetchWithTimeout(`${API_BASE_URL}/custom/v1/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${appAuth}`,
                },
                body: JSON.stringify({ username, email, password }),
            }, 15000);

            const contentType = wpResponse.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                logger.error('Register: Non-JSON from custom endpoint', { status: wpResponse.status, contentType });
                return NextResponse.json(
                    { success: false, error: 'سرویس ثبت‌نام در دسترس نیست. لطفاً بعداً تلاش کنید.' },
                    { status: 502 }
                );
            }

            const wpData = await wpResponse.json();

            if (!wpResponse.ok || !wpData.success) {
                // Return the Persian error message from our custom endpoint
                return NextResponse.json(
                    { success: false, error: wpData.error || 'خطا در ثبت‌نام.' },
                    { status: wpResponse.status || 400 }
                );
            }

            logger.info('User registered via custom WP endpoint', { userId: wpData.user_id, username: wpData.username });

        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return NextResponse.json(
                    { success: false, error: 'زمان پاسخگویی سرور به پایان رسید.' },
                    { status: 504 }
                );
            }
            throw error;
        }

        // --- Auto-login via JWT ---
        const loginResult = await attemptJwtLogin(username, password);

        if (loginResult.success && loginResult.token && loginResult.user) {
            const response = NextResponse.json({
                success: true,
                message: 'ثبت‌نام با موفقیت انجام شد! اکنون وارد حساب کاربری خود شده‌اید.',
                user: loginResult.user,
            }, { status: 201 });

            response.cookies.set('vira_auth_token', loginResult.token, {
                httpOnly: true,
                secure: IS_PRODUCTION,
                sameSite: 'lax',
                path: '/',
                maxAge: COOKIE_MAX_AGE,
            });
            response.cookies.set('vira_auth_status', 'true', {
                httpOnly: false,
                secure: IS_PRODUCTION,
                sameSite: 'lax',
                path: '/',
                maxAge: COOKIE_MAX_AGE,
            });
            const userB64 = Buffer.from(JSON.stringify(loginResult.user)).toString('base64');
            response.cookies.set('vira_auth_user', userB64, {
                httpOnly: false,
                secure: IS_PRODUCTION,
                sameSite: 'lax',
                path: '/',
                maxAge: COOKIE_MAX_AGE,
            });

            return response;
        }

        // Registration OK but auto-login failed
        logger.warn('Register: user created but auto-login failed', {
            loginError: loginResult.success ? undefined : loginResult.error,
        });

        return NextResponse.json({
            success: true,
            message: 'ثبت‌نام با موفقیت انجام شد! لطفاً وارد حساب کاربری خود شوید.',
        }, { status: 201 });

    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return NextResponse.json(
                { success: false, error: 'زمان پاسخگویی سرور به پایان رسید.' },
                { status: 504 }
            );
        }
        logger.error('Register API error', undefined, error instanceof Error ? error : undefined);
        return NextResponse.json(
            { success: false, error: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.' },
            { status: 500 }
        );
    }
},
RATE_LIMIT_PRESETS.auth,
'auth-register'
);

// extractUserIdFromToken moved to @/lib/jwt-utils (as extractUserIdFromTokenAsString)

/**
 * Attempt JWT login after registration.
 *
 * JWT plugin v1.5 returns FLAT response on success:
 *   { "token": "...", "user_email": "...", "user_nicename": "...", "user_display_name": "..." }
 * No "success" field, no "data" wrapper!
 */
async function attemptJwtLogin(
    username: string,
    password: string
): Promise<{ success: true; token: string; user: { id: string; email?: string; nicename?: string; displayName?: string } } | { success: false; error: string }> {
    try {
        const wpResponse = await fetchWithTimeout(`${API_BASE_URL}/jwt-auth/v1/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        }, 10000);

        const contentType = wpResponse.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return { success: false, error: `Non-JSON response (${wpResponse.status})` };
        }

        const wpData = await wpResponse.json();

        // JWT success: flat response with "token" at root level
        if (typeof wpData === 'object' && wpData !== null && typeof wpData.token === 'string') {
            const userId = extractUserIdFromTokenAsString(wpData.token);
            return {
                success: true,
                token: wpData.token,
                user: {
                    id: userId,
                    email: wpData.user_email || '',
                    nicename: wpData.user_nicename || '',
                    displayName: wpData.user_display_name || '',
                },
            };
        }

        return { success: false, error: wpData.message || 'JWT auth failed' };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
