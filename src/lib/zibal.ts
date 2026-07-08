import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';

// ---------------------------------------------------------------------------
// Zibal Payment Gateway Client
// ---------------------------------------------------------------------------
// Replaces the ZarinPal client with Zibal's API.
//
// Key differences from ZarinPal:
//   - Flat JSON responses (no nested data/errors objects)
//   - Uses `trackId` instead of `authority`
//   - Always expects amounts in Rials (multiply WooCommerce Tomans × 10)
//   - Verify only requires `trackId` (no amount needed)
//   - Result codes: 100 = success, 101 = already verified
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Zibal API response types
// ---------------------------------------------------------------------------

/** Zibal Payment Request Response (flat, not nested) */
export interface ZibalRequestResponse {
    result: number;       // 100 = success
    message: string;
    trackId: number;
}

/** Zibal Payment Verify Response (flat, not nested) */
export interface ZibalVerifyResponse {
    result: number;       // 100 = success, 101 = already verified
    message: string;
    amount: number;
    refNumber: string;
    orderId: string;
    cardNumber: string;
    paidAt: string;
}

// ---------------------------------------------------------------------------
// Zibal result codes
// ---------------------------------------------------------------------------

export const ZIBAL_RESULT_CODES = {
    SUCCESS: 100,
    ALREADY_VERIFIED: 101,
    FAILED_PENDING: 102,    // Payment failed, will be verified later
    FAILED: 103,            // Payment failed
    INVALID: 104,
    EXPIRED: 105,
    NOT_FOUND: 106,
    AMOUNT_TOO_LOW: 113,    // Amount below 1,500 Rials OR above gateway limit
    INVALID_MERCHANT: 114,
    INVALID_IP: 115,        // Server IP not whitelisted in Zibal panel
    ALREADY_POSTED: 201,
    NOT_FOUND_TRACK: 202,
} as const;

// ---------------------------------------------------------------------------
// Custom error for non-OK HTTP responses from Zibal
// ---------------------------------------------------------------------------

export class ZibalHttpError extends Error {
    public readonly status: number;
    public readonly body: unknown;

    constructor(status: number, body: unknown) {
        const bodyMessage =
            typeof body === 'object' && body !== null && 'message' in body
                ? String((body as { message: unknown }).message)
                : '';
        super(
            `Zibal API returned HTTP ${status}${bodyMessage ? `: ${bodyMessage}` : ''}`
        );
        this.name = 'ZibalHttpError';
        this.status = status;
        this.body = body;
    }
}

// ---------------------------------------------------------------------------
// Currency unit alignment
// ---------------------------------------------------------------------------
// Zibal API always expects amounts in Rials (IRR).
//
// WooCommerce stores may use either:
//   - IRT (Toman): amounts need × 10 to become Rials
//   - IRR (Rial):  amounts are already in Rials, no conversion needed
//
// Many Iranian WooCommerce stores set currency=IRT but enter prices in Rials.
// Use the ZIBAL_AMOUNT_UNIT env var to control conversion:
//   - "toman" → multiply by 10 (prices are real Tomans)
//   - "rial"  → no conversion (prices are already in Rials) [default]
// ---------------------------------------------------------------------------

/**
 * Convert the WooCommerce order total to Rials for Zibal.
 * Controlled by ZIBAL_AMOUNT_UNIT env var:
 *   - "toman": WooCommerce total is in Tomans, multiply by 10
 *   - "rial" (default): WooCommerce total is already in Rials, no conversion
 */
function toZibalAmount(wooTotal: number): number {
    const unit = process.env.ZIBAL_AMOUNT_UNIT?.toLowerCase() || 'rial';
    if (unit === 'toman') {
        return Math.round(wooTotal) * 10;
    }
    // Default: amount is already in Rials
    return Math.round(wooTotal);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getMerchantId = (): string => {
    const merchantId = process.env.ZIBAL_MERCHANT;
    if (!merchantId) {
        throw new Error('ZIBAL_MERCHANT is not configured');
    }
    return merchantId;
};

const isSandbox = (): boolean => process.env.ZIBAL_SANDBOX === 'true';

const REQUEST_URL = 'https://gateway.zibal.ir/v1/request';
const VERIFY_URL = 'https://gateway.zibal.ir/v1/verify';
// Zibal sandbox uses the SAME production URL, just with merchant="zibal"
// There is NO separate sandbox subdomain.

/**
 * Parse the JSON body and check response.ok.
 * Throws ZibalHttpError if the HTTP status is not in the 2xx range.
 */
async function parseJsonOrThrow<T>(response: Response): Promise<T> {
    if (!response.ok) {
        // Attempt to read the body for a more descriptive error message.
        // If the body itself fails to parse, include the raw status.
        let body: unknown;
        try {
            body = await response.json();
        } catch {
            body = null;
        }
        throw new ZibalHttpError(response.status, body);
    }
    return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Zibal client
// ---------------------------------------------------------------------------

export const zibal = {
    get merchantId() {
        return getMerchantId();
    },

    get sandbox() {
        return isSandbox();
    },

    /**
     * Request a new payment from Zibal.
     *
     * @param amount       WooCommerce order total in Tomans (IRT).
     *                     Automatically converted to Rials (× 10) for Zibal.
     * @param callbackUrl  URL Zibal redirects to after payment.
     * @param description  Payment description shown to the customer.
     * @param orderId      WooCommerce order ID (optional, for correlation).
     */
    async request(
        amount: number,
        callbackUrl: string,
        description: string,
        orderId?: string
    ): Promise<ZibalRequestResponse> {
        const zibalAmount = toZibalAmount(amount);

        // Sandbox mode: use merchant="zibal" with the SAME production URL
        const merchant = this.sandbox ? 'zibal' : this.merchantId;

        logger.info('Zibal payment request', {
            amount: zibalAmount,
            orderId: orderId ?? 'N/A',
            sandbox: this.sandbox,
        });

        const response = await fetchWithTimeout(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                merchant,
                amount: zibalAmount,
                callbackUrl,
                description,
                ...(orderId ? { orderId } : {}),
            }),
        }, 15000); // 15s timeout for payment gateway

        const result = await parseJsonOrThrow<ZibalRequestResponse>(response);

        if (result.result !== ZIBAL_RESULT_CODES.SUCCESS) {
            logger.warn('Zibal request returned non-success result', {
                result: result.result,
                message: result.message,
                trackId: result.trackId,
            });
        }

        return result;
    },

    /**
     * Verify a payment with Zibal.
     *
     * @param trackId  The trackId returned by Zibal in the request response.
     */
    async verify(trackId: number): Promise<ZibalVerifyResponse> {
        // Sandbox mode: use merchant="zibal" with the SAME production URL
        const merchant = this.sandbox ? 'zibal' : this.merchantId;

        logger.info('Zibal payment verify', {
            trackId,
            sandbox: this.sandbox,
        });

        const response = await fetchWithTimeout(VERIFY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                merchant,
                trackId,
            }),
        }, 15000); // 15s timeout for payment verification

        const result = await parseJsonOrThrow<ZibalVerifyResponse>(response);

        if (
            result.result !== ZIBAL_RESULT_CODES.SUCCESS &&
            result.result !== ZIBAL_RESULT_CODES.ALREADY_VERIFIED
        ) {
            logger.warn('Zibal verify returned non-success result', {
                result: result.result,
                message: result.message,
                trackId,
            });
        }

        return result;
    },

    /**
     * Build the payment URL that redirects the customer to Zibal's gateway.
     *
     * @param trackId  The trackId from a successful Zibal request response.
     */
    getPaymentUrl(trackId: number): string {
        // Both sandbox and production use the same gateway URL for redirect
        return `https://gateway.zibal.ir/start/${trackId}`;
    },
};
