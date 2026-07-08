/**
 * In-memory sliding window rate limiter for API routes.
 *
 * Features:
 * - Sliding window algorithm (tracks requests within the last `windowMs` milliseconds)
 * - Per-IP rate limiting (extracted from request headers)
 * - Configurable limits per route (e.g., stricter for auth routes)
 * - Returns rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining)
 * - Returns 429 with Persian error message when limit exceeded
 *
 * Architecture note (Rule #9): This is a Strategy-based design — rate limit
 * configurations are defined per-route and the core algorithm is reusable.
 */

/** Configuration for a single rate-limited endpoint */
export interface RateLimitConfig {
    /** Maximum number of requests allowed within the window */
    limit: number;
    /** Time window in milliseconds */
    windowMs: number;
}

/** Pre-defined rate limit configurations for route categories */
export const RATE_LIMIT_PRESETS = {
    /** Default: 60 requests per minute per IP */
    default: { limit: 60, windowMs: 60_000 },
    /** Auth routes (login, register): 10 requests per minute per IP */
    auth: { limit: 10, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitConfig>;

/** A single request record in the sliding window */
interface RequestRecord {
    timestamp: number;
}

/** Per-IP sliding window state */
interface IPRateState {
    requests: RequestRecord[];
}

/**
 * In-memory store for rate limit state.
 *
 * Key format: `${routePrefix}:${ip}`
 * Value: the sliding window state for that IP on that route.
 *
 * For production at scale, replace with Redis. This in-memory store
 * is process-local and resets on server restart — acceptable for
 * single-instance deployments and development.
 */
const store = new Map<string, IPRateState>();

/** Cleanup interval — removes expired entries every 2 minutes */
const CLEANUP_INTERVAL_MS = 120_000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

/** Start the periodic cleanup of stale entries */
function startCleanup(): void {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, state] of store.entries()) {
            // Remove requests older than the largest possible window (5 minutes)
            const cutoff = now - 300_000;
            state.requests = state.requests.filter((r) => r.timestamp > cutoff);
            // Remove empty entries
            if (state.requests.length === 0) {
                store.delete(key);
            }
        }
    }, CLEANUP_INTERVAL_MS);

    // Don't prevent Node.js process from exiting
    if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
        cleanupTimer.unref();
    }
}

// Auto-start cleanup on module load
startCleanup();

/**
 * Extract the client IP from a request.
 * Checks common proxy headers first (x-forwarded-for, x-real-ip),
 * falls back to connection remote address.
 */
function extractIP(request: Request): string {
    // x-forwarded-for may contain a comma-separated list; the first is the client
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        const firstIP = forwarded.split(',')[0]?.trim();
        if (firstIP) return firstIP;
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP.trim();

    // Fallback — may be undefined in some edge runtimes
    return 'unknown';
}

/** Result of a rate limit check */
export interface RateLimitResult {
    /** Whether the request is allowed */
    allowed: boolean;
    /** Maximum requests allowed in the window */
    limit: number;
    /** Remaining requests in the current window */
    remaining: number;
    /** Seconds until the rate limit window resets (for Retry-After header) */
    retryAfter?: number;
}

/**
 * Check rate limit for a given key and configuration.
 *
 * Uses a sliding window algorithm: counts requests within the last `windowMs`
 * milliseconds and compares against `limit`.
 */
export function checkRateLimit(
    routePrefix: string,
    ip: string,
    config: RateLimitConfig
): RateLimitResult {
    const key = `${routePrefix}:${ip}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create state
    let state = store.get(key);
    if (!state) {
        state = { requests: [] };
        store.set(key, state);
    }

    // Remove expired requests (sliding window)
    state.requests = state.requests.filter((r) => r.timestamp > windowStart);

    const currentCount = state.requests.length;
    const remaining = Math.max(0, config.limit - currentCount);

    if (currentCount >= config.limit) {
        // Rate limit exceeded — find the oldest request in the window to calculate retry-after
        const oldestInWindow = state.requests[0];
        const retryAfter = oldestInWindow
            ? Math.ceil((oldestInWindow.timestamp + config.windowMs - now) / 1000)
            : Math.ceil(config.windowMs / 1000);

        return {
            allowed: false,
            limit: config.limit,
            remaining: 0,
            retryAfter: Math.max(1, retryAfter),
        };
    }

    // Record this request
    state.requests.push({ timestamp: now });

    return {
        allowed: true,
        limit: config.limit,
        remaining: remaining - 1, // Subtract 1 for this request
    };
}

/**
 * Apply rate limiting to an API route handler.
 *
 * Usage:
 * ```ts
 * import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
 *
 * export const POST = withRateLimit(async (request) => {
 *     // Your handler logic
 * }, RATE_LIMIT_PRESETS.auth, 'auth-login');
 * ```
 *
 * @param handler - The actual route handler function
 * @param config - Rate limit configuration (use RATE_LIMIT_PRESETS or custom)
 * @param routePrefix - Unique identifier for this route (used as store key prefix)
 * @returns A wrapped handler that enforces rate limiting
 */
export function withRateLimit<T extends Request>(
    handler: (request: T) => Promise<Response>,
    config: RateLimitConfig = RATE_LIMIT_PRESETS.default,
    routePrefix: string = 'api'
): (request: T) => Promise<Response> {
    return async (request: T): Promise<Response> => {
        const ip = extractIP(request);
        const result = checkRateLimit(routePrefix, ip, config);

        if (!result.allowed) {
            const response = Response.json(
                {
                    success: false,
                    error: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید و دوباره تلاش کنید.',
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': String(result.limit),
                        'X-RateLimit-Remaining': String(result.remaining),
                        'Retry-After': String(result.retryAfter),
                    },
                }
            );
            return response as unknown as import('next/server').NextResponse;
        }

        // Call the actual handler
        const response = await handler(request);

        // Add rate limit headers to successful responses
        const newHeaders = new Headers(response.headers);
        newHeaders.set('X-RateLimit-Limit', String(result.limit));
        newHeaders.set('X-RateLimit-Remaining', String(result.remaining));

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    };
}
