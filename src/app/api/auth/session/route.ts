import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://wordpress.vna-co.ir/wp-json';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * JWT validate endpoint returns:
 *   Success: { "code": "jwt_auth_valid_token", "data": { "status": 200 } }
 *   Failure: { "code": "jwt_auth_invalid_token", "message": "...", "data": { "status": 403 } }
 *
 * NOTE: There is NO "success" field! Must check code or data.status.
 */
interface JWTValidateResponse {
    code?: string;
    message?: string;
    data?: {
        status?: number;
    };
}

function clearAuthCookies(response: NextResponse) {
    response.cookies.set('vira_auth_token', '', {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    response.cookies.set('vira_auth_status', '', {
        httpOnly: false,
        secure: IS_PRODUCTION,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    response.cookies.set('vira_auth_user', '', {
        httpOnly: false,
        secure: IS_PRODUCTION,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
}

export const GET = withRateLimit(
    async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('vira_auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, isLoggedIn: false });
        }

        // Validate the token with WordPress
        const validateResponse = await fetchWithTimeout(`${API_BASE_URL}/jwt-auth/v1/token/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }, 8000);

        const validateData: JWTValidateResponse = await validateResponse.json();

        // Check validation success: code === "jwt_auth_valid_token" or data.status === 200
        const isValid = validateData.code === 'jwt_auth_valid_token' ||
            validateData.data?.status === 200;

        if (!isValid) {
            // Token is invalid — clear all auth cookies
            const response = NextResponse.json({ success: false, isLoggedIn: false });
            clearAuthCookies(response);
            return response;
        }

        // Token is valid — read user info from cookie
        const userCookie = cookieStore.get('vira_auth_user')?.value;
        let user = null;

        if (userCookie) {
            try {
                const decoded = Buffer.from(userCookie, 'base64').toString('utf8');
                user = JSON.parse(decoded);
            } catch {
                // If user cookie is corrupt, continue without user data
            }
        }

        return NextResponse.json({ success: true, isLoggedIn: true, user });
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return NextResponse.json(
                { success: false, isLoggedIn: false, error: 'زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.' },
                { status: 504 }
            );
        }
        logger.error('Auth session error', undefined, error instanceof Error ? error : undefined);
        return NextResponse.json(
            { success: false, isLoggedIn: false },
            { status: 500 }
        );
    }
},
RATE_LIMIT_PRESETS.default,
'auth-session'
);
