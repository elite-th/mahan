import { NextResponse } from 'next/server';

/**
 * Standardized API response helpers for consistent response formatting
 * across all API routes.
 *
 * Convention:
 * - Success responses: `{ success: true, ...data }`
 * - Error responses: `{ success: false, error: '...' }`
 *
 * IMPORTANT: The error field is ALWAYS named `error`, never `message`.
 * This ensures frontend code can reliably read `data.error` for any
 * failed API call without checking multiple field names.
 */

/**
 * Creates a standardized API success response.
 *
 * @param data - Additional data to include in the response (merged with `{ success: true }`)
 * @param status - HTTP status code (default: 200)
 * @returns A NextResponse with `{ success: true, ...data }`
 *
 * @example
 * ```ts
 * return apiSuccess({ orderId: 123, token: 'abc' });
 * // => { success: true, orderId: 123, token: 'abc' } (status 200)
 * ```
 */
export function apiSuccess(data: Record<string, unknown>, status = 200): NextResponse {
    return NextResponse.json({ success: true, ...data }, { status });
}

/**
 * Creates a standardized API error response.
 *
 * IMPORTANT: Always uses the `error` field (never `message`) to ensure
 * consistent error handling on the frontend.
 *
 * @param error - Human-readable error message (typically in Farsi)
 * @param status - HTTP status code (e.g. 400, 401, 429, 500, 502, 503)
 * @returns A NextResponse with `{ success: false, error }`
 *
 * @example
 * ```ts
 * return apiError('خطا در ثبت سفارش.', 400);
 * // => { success: false, error: 'خطا در ثبت سفارش.' } (status 400)
 * ```
 */
export function apiError(error: string, status: number, extra?: Record<string, unknown>): NextResponse {
    return NextResponse.json({ success: false, error, ...extra }, { status });
}
