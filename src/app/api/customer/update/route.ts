import { NextResponse } from 'next/server';
import { requireAuth, setRefreshedCookie } from '@/lib/auth-headers';
import { extractUserIdFromToken } from '@/lib/jwt-utils';
import { updateCustomer, WCCustomerError } from '@/lib/woocommerce-rest';
import { logger } from '@/lib/logger';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
}

export async function POST(request: Request) {
    // 1. Validate authentication
    const authResult = await requireAuth();
    if (!authResult.ok) {
        return authResult.response;
    }

    // 2. Extract user ID from JWT
    const userId = extractUserIdFromToken(authResult.token);
    if (!userId) {
        return NextResponse.json(
            { success: false, error: 'خطا در شناسایی کاربر. لطفاً دوباره وارد شوید.' },
            { status: 401 }
        );
    }

    // 3. Parse and validate input
    let body: UpdateProfileInput;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, error: 'درخواست نامعتبر است.' },
            { status: 400 }
        );
    }

    const { firstName, lastName, displayName, email } = body;

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
            { success: false, error: 'فرمت ایمیل وارد شده معتبر نیست.' },
            { status: 400 }
        );
    }

    // Build update input — only include fields that were provided
    const input: Record<string, string> = {};
    if (firstName !== undefined) input.first_name = firstName;
    if (lastName !== undefined) input.last_name = lastName;
    if (displayName !== undefined) input.display_name = displayName;
    if (email !== undefined) input.email = email;

    if (Object.keys(input).length === 0) {
        return NextResponse.json(
            { success: false, error: 'هیچ فیلدی برای بروزرسانی ارسال نشده است.' },
            { status: 400 }
        );
    }

    // 4. Call WooCommerce REST API to update customer
    try {
        const updatedCustomer = await updateCustomer(userId, input);

        // 5. Build updated user data for the cookie
        const updatedUser = {
            id: String(updatedCustomer.id),
            email: updatedCustomer.email || email || '',
            nicename: updatedCustomer.username || '',
            displayName: updatedCustomer.first_name && updatedCustomer.last_name
                ? `${updatedCustomer.first_name} ${updatedCustomer.last_name}`
                : (displayName || ''),
            firstName: updatedCustomer.first_name || firstName || '',
            lastName: updatedCustomer.last_name || lastName || '',
        };

        // 6. Update the vira_auth_user cookie
        const response = NextResponse.json({
            success: true,
            user: updatedUser,
        });

        const userB64 = Buffer.from(JSON.stringify(updatedUser)).toString('base64');
        response.cookies.set('vira_auth_user', userB64, {
            httpOnly: false,
            secure: IS_PRODUCTION,
            sameSite: 'lax',
            path: '/',
            maxAge: COOKIE_MAX_AGE,
        });

        // Also refresh auth cookies if needed
        await setRefreshedCookie(response, authResult);

        return response;
    } catch (error) {
        if (error instanceof WCCustomerError) {
            logger.error('Customer update failed', { status: error.statusCode, message: error.message });

            // Translate common WooCommerce errors
            let persianError = error.message;
            if (error.message.toLowerCase().includes('email')) {
                persianError = 'این ایمیل قبلاً ثبت شده است یا معتبر نیست.';
            } else if (error.statusCode === 404) {
                persianError = 'کاربر یافت نشد.';
            }

            return NextResponse.json(
                { success: false, error: persianError },
                { status: error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 500 }
            );
        }

        logger.error('Customer update error', undefined, error instanceof Error ? error : undefined);
        return NextResponse.json(
            { success: false, error: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.' },
            { status: 500 }
        );
    }
}
