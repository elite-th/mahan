import crypto from 'crypto';
import { SHIPPING_METHODS } from '@/constants/shipping';

export interface CheckoutFormData {
    email: string;
    phone: string;
    fullName: string;
    companyName?: string;
    taxId?: string;
    fullAddress: string;
    postalCode: string;
    shippingMethod?: string;
}

export interface CheckoutCartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export const parseProductId = (id: string) => {
    const numericId = Number(id);
    if (Number.isInteger(numericId) && numericId > 0) {
        return numericId;
    }

    try {
        const decoded = Buffer.from(id, 'base64').toString('utf8');
        const [, rawId] = decoded.split(':');
        const decodedId = Number(rawId);
        return Number.isInteger(decodedId) && decodedId > 0 ? decodedId : null;
    } catch {
        return null;
    }
};

export const validateCheckoutPayload = (formData: CheckoutFormData, cartItems: CheckoutCartItem[]) => {
    if (!formData || !formData.email || !formData.phone || !formData.fullName || !formData.fullAddress || !formData.postalCode) {
        return 'اطلاعات مشتری ناقص است.';
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
        return 'شماره تلفن معتبر نیست.';
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return 'سبد خرید خالی است.';
    }

    return null;
};

export const buildLineItems = (cartItems: CheckoutCartItem[]) => {
    return cartItems
        .map((item) => {
            const productId = parseProductId(item.id);
            if (!productId) {
                return null;
            }

            return {
                product_id: productId,
                quantity: Math.max(1, Number(item.quantity) || 1),
            };
        })
        .filter((item): item is { product_id: number; quantity: number } => Boolean(item));
};

export const createIdempotencyKey = (formData: CheckoutFormData, cartItems: CheckoutCartItem[]) => {
    const cartHash = cartItems.map((item) => `${item.id}-${item.quantity}`).join('|');
    return crypto.createHash('md5').update(`${formData.phone}-${cartHash}`).digest('hex');
};

export const splitFullName = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/);
    return {
        firstName: nameParts[0] || '',
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'کاربر',
    };
};

/**
 * Build customer input for WooCommerce REST API (snake_case fields).
 * The REST API uses different field naming than the GraphQL API.
 */
export const buildCustomerInputRest = (formData: CheckoutFormData) => {
    const { firstName, lastName } = splitFullName(formData.fullName);

    return {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.phone,
        address_1: formData.fullAddress,
        postcode: formData.postalCode,
        company: formData.companyName || '',
        country: 'IR',
        state: '',
        city: '',
    };
};

/**
 * Parse the WooCommerce order total for payment gateway amount.
 * SECURITY: Does NOT fall back to client-side prices. If the server-side
 * order total is invalid, returns null so the caller can reject the payment.
 *
 * @param value - The order.total value from WooCommerce (server-authoritative)
 * @returns The amount in the store's currency (Tomans/IRT, rounded), or null if invalid.
 *          The zibal.ts toZibalAmount() function handles the IRT→IRR conversion
 *          (Tomans to Rials, × 10) before sending to the Zibal payment gateway.
 */
export const parseGatewayAmount = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return Math.round(value);
    }

    if (typeof value === 'string') {
        const normalized = value.replace(/[^\d.]/g, '');
        const parsed = Number(normalized);
        if (Number.isFinite(parsed) && parsed > 0) {
            return Math.round(parsed);
        }
    }

    // Do NOT fall back to client-calculated prices — that would allow
    // an attacker to modify cart item prices in the browser.
    return null;
};

export const getClientCartTotal = (cartItems: CheckoutCartItem[]) => {
    return cartItems.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
};

/**
 * Build WooCommerce shipping_lines array from a shipping method ID.
 * Used in createOrder calls to attach the selected shipping method.
 *
 * NOTE: WooCommerce requires method_id to match a registered shipping method
 * in the WooCommerce shipping zones (e.g., "flat_rate:1"). Custom IDs like
 * "snapp_express" are NOT recognized by WooCommerce and will be silently ignored.
 * We use "flat_rate" as a generic method_id so WooCommerce accepts the line,
 * and store the actual courier name in method_title + order meta_data.
 *
 * Shipping cost is NOT included in the order total. Customers
 * coordinate courier pricing with support separately.
 *
 * @param methodId - Shipping method ID from SHIPPING_METHODS config
 * @returns Array with a single shipping line, or empty if method not found
 */
export const buildShippingLines = (methodId: string): Array<{ method_id: string; method_title: string; total: string }> => {
    const method = SHIPPING_METHODS.find(m => m.id === methodId);
    if (!method) return [];
    return [{
        method_id: 'flat_rate',
        method_title: method.title,
        total: '0',
    }];
};

/**
 * Get the human-readable shipping method title for a given method ID.
 * Used to store the selected courier name in order meta_data.
 *
 * @param methodId - Shipping method ID from SHIPPING_METHODS config
 * @returns The Persian title, or the raw methodId if not found
 */
export const getShippingMethodTitle = (methodId: string): string => {
    const method = SHIPPING_METHODS.find(m => m.id === methodId);
    return method ? method.title : methodId;
};
