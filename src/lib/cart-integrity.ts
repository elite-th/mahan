// Client-side price integrity check
// This uses a simple hash to detect accidental price tampering in localStorage
// Note: This is NOT a security measure against determined attackers -
// the server MUST always validate prices before payment processing

const INTEGRITY_KEY = 'vira-cart-integrity-v1';

export function signPrice(productId: string, price: number): string {
  // Simple HMAC for client-side integrity checking
  // On server, prices are always validated from WooCommerce data
  const data = `${productId}:${price}:${INTEGRITY_KEY}`;
  // Use a simple hash since this is just for detecting accidental corruption
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export function verifyPrice(productId: string, price: number, hash: string): boolean {
  return signPrice(productId, price) === hash;
}
