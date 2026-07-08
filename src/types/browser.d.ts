/**
 * Browser API type augmentations.
 *
 * Extends the Navigator interface with non-standard properties
 * that are available in Chromium-based browsers but not in
 * TypeScript's default lib.dom.d.ts.
 *
 * This allows us to avoid `navigator as any` casts.
 */

interface Navigator {
    /** Number of logical processors available (Chromium-only) */
    hardwareConcurrency?: number;
    /** Device memory in GB (Chromium-only, approximate) */
    deviceMemory?: number;
}
