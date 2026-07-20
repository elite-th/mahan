/**
 * WooCommerce REST API client for server-side operations.
 * 
 * IMPORTANT: WPGraphQL WooCommerce does NOT support Basic Auth (Consumer Key/Secret)
 * for mutations — it requires JWT or Cookie auth. Since our WooCommerce keys
 * authenticate as a "system user" (not a WordPress user with a session),
 * GraphQL mutations like createOrder fail with "User does not have the capabilities".
 * 
 * The WooCommerce REST API DOES support Consumer Key/Secret properly,
 * so we use it for all write operations (create/update orders).
 */

import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';
import type {
    WCCreateOrderInput,
    WCCreateCustomerInput,
    WCCustomer,
    WCOrder,
    WCRestResponse,
} from '@/types';

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';
const WC_API_BASE = `${WP_BASE_URL.replace(/\/wp-json$/, '')}/wp-json/wc/v3`;

const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

/** Check that WooCommerce API credentials are configured */
export const checkWooCommerceConfig = (): string | null => {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        return 'WOOCOMMERCE_CONSUMER_KEY و WOOCOMMERCE_CONSUMER_SECRET در تنظیمات سرور تنظیم نشده‌اند.';
    }
    return null;
};

/** Get the Basic Auth header for WooCommerce REST API */
const getAuthHeader = (): string => {
    const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    return `Basic ${credentials}`;
};

// WCRestResponse is imported from centralized types module

/** Make an authenticated request to the WooCommerce REST API */
const wcRequest = async <T>(method: string, endpoint: string, body?: unknown): Promise<WCRestResponse<T>> => {
    const url = `${WC_API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
    };

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    let response: Response;
    try {
        response = await fetchWithTimeout(url, options, 15000); // 15s timeout for WC REST API
    } catch (error) {
        // Re-throw AbortError so callers can handle timeouts specifically (504 vs 500)
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
        throw new Error(`WooCommerce API request failed: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return { ok: false, status: response.status, data: { message: 'Non-JSON response from WooCommerce API' } };
    }
    const data = await response.json();

    if (response.ok) {
        return { ok: true, status: response.status, data: data as T };
    }

    return {
        ok: false,
        status: response.status,
        data: data as { message?: string },
    };
};


/** Custom error for WooCommerce customer operations */
export class WCCustomerError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'WCCustomerError';
        this.statusCode = statusCode;
    }
}

/** Update a WooCommerce customer via REST API (used to force-set password after creation) */
export const updateCustomer = async (customerId: number, input: Partial<WCCreateCustomerInput>): Promise<WCCustomer> => {
    const result = await wcRequest<WCCustomer>('PUT', `/customers/${customerId}`, input);

    if (!result.ok) {
        const message = result.data.message || 'Unknown WooCommerce error';
        logger.error('WC REST update customer failed', { status: result.status, message });
        throw new WCCustomerError(message, result.status);
    }

    return result.data;
};

/** Create a WooCommerce order via REST API */
export const createOrder = async (input: WCCreateOrderInput): Promise<WCOrder> => {
    const result = await wcRequest<WCOrder>('POST', '/orders', input);

    if (!result.ok) {
        const message = result.data.message || 'Unknown WooCommerce error';
        logger.error('WC REST create order failed', { status: result.status, message });
        throw new Error(`WooCommerce createOrder failed: ${message}`);
    }

    return result.data;
};

/** Update a WooCommerce order via REST API */
export const updateOrder = async (orderId: number, input: Partial<WCCreateOrderInput>): Promise<WCOrder> => {
    const result = await wcRequest<WCOrder>('PUT', `/orders/${orderId}`, input);

    if (!result.ok) {
        const message = result.data.message || 'Unknown WooCommerce error';
        logger.error('WC REST update order failed', { status: result.status, message });
        throw new Error(`WooCommerce updateOrder failed: ${message}`);
    }

    return result.data;
};

/** Get a WooCommerce order by ID via REST API */
export const getOrder = async (orderId: number): Promise<WCOrder> => {
    const result = await wcRequest<WCOrder>('GET', `/orders/${orderId}`);

    if (!result.ok) {
        const message = result.data.message || 'Unknown WooCommerce error';
        logger.error('WC REST get order failed', { status: result.status, message });
        throw new Error(`WooCommerce getOrder failed: ${message}`);
    }

    return result.data;
};
