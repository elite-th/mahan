import { NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * JWT Authentication plugin v1.5 returns a FLAT response on success:
 *   { "token": "...", "user_email": "...", "user_nicename": "...", "user_display_name": "..." }
 *
 * On failure it returns:
 *   { "code": "[jwt_auth] incorrect_password", "message": "...", "data": { "status": 403 } }
 *
 * NOTE: There is NO "success" field and NO "data.token" wrapper!
 */
interface JWTSuccessResponse {
    token: string;
    user_email: string;
    user_nicename: string;
    user_display_name: string;
}

interface JWTErrorResponse {
    code: string;
    message: string;
    data?: { status: number };
}

function isJWTSuccess(data: unknown): data is JWTSuccessResponse {
    return typeof data === 'object' && data !== null && 'token' in data && typeof (data as JWTSuccessResponse).token === 'string';
}

function isJWTError(data: unknown): data is JWTErrorResponse {
    return typeof data === 'object' && data !== null && 'code' in data && typeof (data as JWTErrorResponse).code === 'string';
}

/**
 * Extract user ID from JWT token payload.
 * JWT structure: header.payload.signature — payload is base64-encoded JSON.
 */
function extractUserIdFromToken(token: string): string {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return '';
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
        return String(payload?.data?.user?.id ?? '');
    } catch {
        return '';
    }
}

export const POST = withRateLimit(
    async (request: Request) => {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'نام کاربری و رمز عبور الزامی است.' },
                { status: 400 }
            );
        }

        // Proxy to WordPress JWT auth endpoint
        const wpResponse = await fetchWithTimeout(`${API_BASE_URL}/jwt-auth/v1/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        }, 10000);

        // Handle non-JSON responses (e.g. HTML 404 pages)
        const contentType = wpResponse.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            logger.error('Login API: Non-JSON response from WordPress', { status: wpResponse.status, contentType });
            return NextResponse.json(
                { success: false, error: 'سرویس ورود در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.' },
                { status: 502 }
            );
        }

        const wpData = await wpResponse.json();

        // --- JWT success: flat response with "token" at root level ---
        if (isJWTSuccess(wpData)) {
            const userId = extractUserIdFromToken(wpData.token);
            const user = {
                id: userId,
                email: wpData.user_email || '',
                nicename: wpData.user_nicename || '',
                displayName: wpData.user_display_name || '',
            };

            const response = NextResponse.json({
                success: true,
                user,
            });

            // Set httpOnly cookie with JWT — NOT accessible from JavaScript
            response.cookies.set('vira_auth_token', wpData.token, {
                httpOnly: true,
                secure: IS_PRODUCTION,
                sameSite: 'lax',
                path: '/',
                maxAge: COOKIE_MAX_AGE,
            });

            // Non-httpOnly cookie so client knows someone is logged in
            response.cookies.set('vira_auth_status', 'true', {
                httpOnly: false,
                secure: IS_PRODUCTION,
                sameSite: 'lax',
                path: '/',
                maxAge: COOKIE_MAX_AGE,
            });

            // Store user info in a non-httpOnly cookie (base64-encoded JSON)
            const userB64 = Buffer.from(JSON.stringify(user)).toString('base64');
            response.cookies.set('vira_auth_user', userB64, {
                httpOnly: false,
                secure: IS_PRODUCTION,
                sameSite: 'lax',
                path: '/',
                maxAge: COOKIE_MAX_AGE,
            });

            return response;
        }

        // --- JWT failure: translate error codes to Persian ---
        let persianError = 'نام کاربری یا رمز عبور اشتباه است.';

        if (isJWTError(wpData)) {
            const errorCode = wpData.code;
            if (errorCode === '[jwt_auth] invalid_username') {
                persianError = 'نام کاربری وجود ندارد. لطفاً ابتدا ثبت‌نام کنید.';
            } else if (errorCode === '[jwt_auth] incorrect_password') {
                persianError = 'رمز عبور اشتباه است. لطفاً دوباره تلاش کنید.';
            } else if (errorCode === '[jwt_auth] invalid_email') {
                persianError = 'ایمیل وارد شده معتبر نیست.';
            }
        }

        logger.error('Login API: WordPress JWT auth failed', {
            wpStatus: wpResponse.status,
            wpCode: isJWTError(wpData) ? wpData.code : 'unknown',
        });

        return NextResponse.json(
            { success: false, error: persianError },
            { status: 401 }
        );

    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return NextResponse.json(
                { success: false, error: 'زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.' },
                { status: 504 }
            );
        }
        logger.error('Auth login error', undefined, error instanceof Error ? error : undefined);
        return NextResponse.json(
            { success: false, error: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.' },
            { status: 500 }
        );
    }
},
RATE_LIMIT_PRESETS.auth,
'auth-login'
);
