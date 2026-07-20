/**
 * Authentication helper for API routes that require a logged-in user.
 *
 * Reads the `vira_auth_token` httpOnly cookie and validates it with
 * WordPress JWT. Returns the validated token string, or a 401 error response.
 *
 * NOTE: JWT plugin v1.5 does NOT have a /token/refresh endpoint.
 * When a token expires, the user must log in again.
 *
 * Usage in API routes:
 * ```ts
 * import { requireAuth, setRefreshedCookie } from '@/lib/auth-headers';
 *
 * export async function POST(request: Request) {
 *     const authResult = await requireAuth();
 *     if (!authResult.ok) return authResult.response;
 *     const token = authResult.token;
 *     // token is now a validated JWT string — use it for WordPress API calls
 *
 *     const response = NextResponse.json({ success: true, ... });
 *     await setRefreshedCookie(response, authResult);
 *     return response;
 * }
 * ```
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * JWT validate endpoint returns:
 *   Success: { "code": "jwt_auth_valid_token", "data": { "status": 200 } }
 *   Failure: { "code": "jwt_auth_invalid_token", "message": "...", "data": { "status": 403 } }
 *
 * NOTE: No "success" field! Must check code or data.status.
 */
interface JWTValidateResponse {
    code?: string;
    message?: string;
    data?: {
        status?: number;
    };
}

/** Successful auth result — token is validated */
export interface AuthSuccess {
    ok: true;
    token: string;
    refreshed?: boolean;
}

/** Failed auth result — contains a 401 response to return */
export interface AuthFailure {
    ok: false;
    response: NextResponse;
}

/** Result of requireAuth() — discriminated union */
export type AuthResult = AuthSuccess | AuthFailure;

/**
 * NOTE: JWT plugin v1.5 does NOT have a /token/refresh endpoint.
 * The previous tryRefreshToken() was a no-op that re-validated the same token
 * that requireAuth() already validated (and failed), adding ~300ms latency
 * for every expired token. It has been removed.
 *
 * When token validation fails, the user must log in again.
 * This is the correct behavior since there is no way to refresh a JWT
 * without the user's credentials.
 */

/**
 * Update all 3 auth cookies on a response (after a successful token refresh).
 *
 * Call this on the final response in API routes that use requireAuth()
 * to extend cookie lifetime when a refresh occurred.
 */
export async function setRefreshedCookie(
    response: NextResponse,
    authResult: AuthResult
): Promise<void> {
    if (!authResult.ok || !authResult.refreshed) return;

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vira_auth_user')?.value;

    response.cookies.set('vira_auth_token', authResult.token, {
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

    if (userCookie) {
        response.cookies.set('vira_auth_user', userCookie, {
            httpOnly: false,
            secure: IS_PRODUCTION,
            sameSite: 'lax',
            path: '/',
            maxAge: COOKIE_MAX_AGE,
        });
    }
}

/**
 * Require authentication for an API route.
 *
 * 1. Reads `vira_auth_token` from httpOnly cookies (using next/headers cookies())
 * 2. Validates it with WordPress JWT: POST to /jwt-auth/v1/token/validate
 * 3. If validation fails, returns 401 (no refresh available in JWT v1.5)
 * 4. Returns { ok: true, token } on success
 * 5. Returns { ok: false, response } with 401 status on failure
 *
 * @returns AuthResult — check `ok` to determine success/failure
 */
export async function requireAuth(): Promise<AuthResult> {
    const cookieStore = await cookies();
    const token = cookieStore.get('vira_auth_token')?.value;

    if (!token) {
        return {
            ok: false,
            response: NextResponse.json(
                { success: false, error: 'برای انجام این عملیات باید وارد حساب کاربری خود شوید.' },
                { status: 401 }
            ),
        };
    }

    // Validate the token with WordPress JWT
    try {
        const validateResponse = await fetchWithTimeout(`${API_BASE_URL}/jwt-auth/v1/token/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }, 8000); // 8s timeout for auth validation

        const validateData: JWTValidateResponse = await validateResponse.json();

        const isValid = validateData.code === 'jwt_auth_valid_token' ||
            validateData.data?.status === 200;

        if (!isValid) {
            // Token validation failed — JWT v1.5 has no refresh endpoint,
            // so the user must log in again.
            return {
                ok: false,
                response: NextResponse.json(
                    { success: false, error: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.' },
                    { status: 401 }
                ),
            };
        }

        return { ok: true, token };
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return {
                ok: false,
                response: NextResponse.json(
                    { success: false, error: 'زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.' },
                    { status: 504 }
                ),
            };
        }
        logger.error('Token validation failed', undefined, error instanceof Error ? error : undefined);
        return {
            ok: false,
            response: NextResponse.json(
                { success: false, error: 'خطا در تأیید هویت. لطفاً بعداً تلاش کنید.' },
                { status: 401 }
            ),
        };
    }
}
