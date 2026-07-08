import { NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';

export const POST = withRateLimit(
    async () => {
    const response = NextResponse.json({ success: true });

    // Clear all auth cookies
    response.cookies.set('vira_auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    response.cookies.set('vira_auth_status', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    response.cookies.set('vira_auth_user', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    return response;
},
RATE_LIMIT_PRESETS.default,
'auth-logout'
);
