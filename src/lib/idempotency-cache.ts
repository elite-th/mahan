/**
 * In-Memory Idempotency Cache
 *
 * Replaces the previous filesystem-based implementation with a fast
 * in-memory Map. This avoids blocking the Node.js event loop with
 * synchronous file I/O and eliminates concurrency issues.
 *
 * The cache is ephemeral (60s TTL) — data loss on process restart
 * is acceptable since it only prevents duplicate requests within
 * a short window.
 *
 * For multi-instance deployments, replace with Redis-backed implementation.
 */

const TTL_MS = 60_000; // 60 seconds default TTL
const MAX_ENTRIES = 10_000; // Prevent memory bloat
const CLEANUP_INTERVAL_MS = 60_000; // Cleanup expired entries every 60s

interface CacheEntry {
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

// Periodic cleanup of expired entries
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now >= entry.expiresAt) {
      cache.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

// Don't prevent process exit
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

/** Check if a key exists in the cache and hasn't expired */
export function idempotencyCacheHas(key: string): boolean {
  const entry = cache.get(key);
  if (!entry) return false;
  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return false;
  }
  return true;
}

/** Add a key to the cache with an optional TTL */
export function idempotencyCacheAdd(key: string, ttlMs: number = TTL_MS): void {
  // Enforce max size — remove oldest entries if at capacity
  if (cache.size >= MAX_ENTRIES) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) {
      cache.delete(firstKey);
    }
  }
  cache.set(key, { expiresAt: Date.now() + ttlMs });
}

/** Delete a specific key from the cache */
export function idempotencyCacheDelete(key: string): void {
  cache.delete(key);
}
