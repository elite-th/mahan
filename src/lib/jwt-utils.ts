/**
 * JWT Utility Functions
 *
 * Shared helpers for parsing and extracting data from JWT tokens
 * issued by the WordPress JWT Authentication plugin (v1.5).
 *
 * Centralised here to avoid duplication across API routes.
 */

/**
 * Extract the WordPress user ID from a JWT token payload.
 *
 * JWT structure: `header.payload.signature`
 * The payload is base64url-encoded JSON.
 *
 * The WordPress JWT plugin stores the user ID at `payload.data.user.id`.
 *
 * @param token - Raw JWT token string
 * @returns Numeric user ID if found, otherwise `null`
 */
export function extractUserIdFromToken(token: string): number | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
        const id = Number(payload?.data?.user?.id);
        return Number.isInteger(id) && id > 0 ? id : null;
    } catch {
        return null;
    }
}

/**
 * Extract the WordPress user ID from a JWT token payload as a string.
 *
 * Same as `extractUserIdFromToken` but returns a string (empty string if not found).
 * Useful for contexts where a string ID is preferred (e.g., cookie storage).
 *
 * @param token - Raw JWT token string
 * @returns User ID as string, or empty string if not found
 */
export function extractUserIdFromTokenAsString(token: string): string {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return '';
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
        return String(payload?.data?.user?.id ?? '');
    } catch {
        return '';
    }
}
