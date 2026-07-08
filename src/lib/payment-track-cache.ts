/**
 * In-Memory Payment Track Cache
 *
 * Maps Zibal `trackId` to order information so that when the payment
 * gateway calls back with a trackId we can look up the corresponding
 * WooCommerce order without hitting the database.
 *
 * Entries auto-expire after 30 minutes (checked on every access and
 * via a periodic cleanup timer). Data loss on process restart is
 * acceptable — the verify endpoint can always fall back to the
 * WooCommerce API + Zibal verify call.
 *
 * For multi-instance deployments, replace with Redis-backed implementation.
 */

const TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Cleanup every 5 minutes

export interface TrackInfo {
  orderId: number;       // WooCommerce order ID
  amount: number;        // Expected payment amount in WooCommerce's currency unit (e.g. Rials when ZIBAL_AMOUNT_UNIT=rial)
  secureToken: string;   // Security token stored in order meta_data
  createdAt: number;     // Unix timestamp when created
}

interface CacheEntry {
  info: TrackInfo;
  expiresAt: number;
}

const cache = new Map<number, CacheEntry>();

/** Remove all entries that have exceeded their TTL. */
function cleanExpired(): void {
  const now = Date.now();
  for (const [trackId, entry] of cache) {
    if (now >= entry.expiresAt) {
      cache.delete(trackId);
    }
  }
}

// Periodic background cleanup of expired entries
const cleanupTimer = setInterval(cleanExpired, CLEANUP_INTERVAL_MS);

// Don't prevent process exit
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

/**
 * Store a trackId → TrackInfo mapping with a 30-minute TTL.
 *
 * @param trackId - Zibal track ID returned from the payment request
 * @param info    - Order details to associate with this trackId
 */
export function saveTrack(trackId: number, info: TrackInfo): void {
  cleanExpired();
  cache.set(trackId, {
    info,
    expiresAt: Date.now() + TTL_MS,
  });
}

/**
 * Retrieve the TrackInfo for a given trackId.
 *
 * Returns `null` if the trackId is not found or the entry has expired
 * (expired entries are automatically removed).
 *
 * @param trackId - Zibal track ID to look up
 */
export function getTrack(trackId: number): TrackInfo | null {
  cleanExpired();
  const entry = cache.get(trackId);
  if (!entry) return null;

  if (Date.now() >= entry.expiresAt) {
    cache.delete(trackId);
    return null;
  }

  return entry.info;
}

/**
 * Remove a trackId entry from the cache.
 *
 * Should be called after a successful payment verification to free
 * memory immediately rather than waiting for TTL expiry.
 *
 * @param trackId - Zibal track ID to remove
 */
export function deleteTrack(trackId: number): void {
  cache.delete(trackId);
}
