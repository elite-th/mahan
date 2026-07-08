/**
 * Performance detection utilities for adapting UI based on device capabilities.
 *
 * These utilities help degrade gracefully on low-end devices by detecting
 * hardware constraints and user preferences (e.g. reduced motion).
 */

/**
 * Detects whether the current device is considered low-performance.
 *
 * A device is classified as low-performance if any of the following are true:
 * - CPU cores ≤ 2
 * - Device memory ≤ 2 GB
 * - User prefers reduced motion (accessibility setting)
 *
 * This function is safe to call during SSR — it returns `false` when
 * `window` is not available.
 *
 * @returns `true` if the device is low-performance, `false` otherwise
 *
 * @example
 * ```ts
 * if (isLowPerformanceDevice()) {
 *   // Reduce particle count, disable animations, etc.
 *   config.particleCount = 60;
 * }
 * ```
 */
export function isLowPerformanceDevice(): boolean {
    if (typeof window === 'undefined') return false;
    const nav = navigator;
    const cores = nav.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 4; // GB
    // Low-end: 2 cores or less, or 2GB RAM or less
    if (cores <= 2 || memory <= 2) return true;
    // Also check for prefers-reduced-motion
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
    return false;
}
