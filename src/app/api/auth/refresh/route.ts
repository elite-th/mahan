import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { withRateLimit, type RateLimitConfig } from '@/lib/rate-limiter';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';

/**
 * Token Refresh Endpoint
 *
 * JWT Authentication plugin v1.5 does NOT have a /token/refresh endpoint.
 * Instead, we validate the current token. If it's still valid, we return success.
 * The JWT token itself has a ~7 day expiry, so "refresh" simply means confirming
 * the token is still good and extending the cookie lifetime.
 *
 * If the token is expired, the user must re-login.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://wordpress.vna-co.ir/wp-json';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Custom rate-limit preset for refresh: 20 requests per minute */
const REFRESH_RATE_LIMIT: RateLimitConfig = { limit: 20, windowMs: 60_000 };

/**
 * JWT validate endpoint returns:
 *   Success: { "code": "jwt_auth_valid_token", "data": { "status": 200 } }
 */
interface JWTValidateResponse {
    code?: string;
    data?: {
        status?: number;
    };
    message?: string;
}

export const POST = withRateLimit(
    async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('vira_auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'No active session' }, { status: 401 });
        }

        // Validate the current token with WordPress
        const validateResponse = await fetchWithTimeout(`${API_BASE_URL}/jwt-auth/v1/token/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }, 8000);

        const validateData: JWTValidateResponse = await validateResponse.json();

        // Check if token is valid
        const isValid = validateData.code === 'jwt_auth_valid_token' ||
            validateData.data?.status === 200;

        if (!isValid) {
            logger.warn('Token refresh failed — token is invalid', {
                wpCode: validateData.code,
                wpMessage: validateData.message,
            });
            return NextResponse.json({ success: false }, { status: 401 });
        }

        // Token is still valid — extend cookie lifetimes
        const userCookie = cookieStore.get('vira_auth_user')?.value;

        const response = NextResponse.json({ success: true });

        // Re-set the token cookie to extend its maxAge
        response.cookies.set('vira_auth_token', token, {
            httpOnly: true,
            secure: IS_PRODUCTION,
            sameSite: 'lax',
            path: '/',
            maxAge: COOKIE_MAX_AGE,
        });

        // Extend non-httpOnly cookies expiry
        response.cookies.set('vira_auth_status', 'true', {
            httpOnly: false,
            secure: IS_PRODUCTION,
            sameSite: 'lax',
            path: '/',
            maxAge: COOKIE_MAX_AGE,
        });

        if (userCookie) {
            response.cookies.set('vira_auth_user', userCookie, {
                httpOnly: false,
                secure: IS_PRODUCTION,
                sameSite: 'lax',
                path: '/',
                maxAge: COOKIE_MAX_AGE,
            });
        }

        logger.debug('Token refresh (validate) successful');
        return response;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return NextResponse.json(
                { success: false, error: 'زمان پاسخگویی سرور به پایان رسید.' },
                { status: 504 }
            );
        }
        logger.error('Token refresh error', undefined, error instanceof Error ? error : undefined);
        return NextResponse.json({ success: false }, { status: 500 });
    }
},
REFRESH_RATE_LIMIT,
'auth-refresh'
);
