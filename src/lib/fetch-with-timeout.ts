/**
 * Fetch with timeout using AbortController.
 * Prevents indefinite hangs on external API calls.
 *
 * Usage:
 * ```ts
 * import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
 * const response = await fetchWithTimeout(url, options, 10000);
 * ```
 *
 * When the timeout fires, the request is aborted and a DOMException
 * with name 'AbortError' is thrown. Catch this in your error handler:
 * ```ts
 * catch (error: unknown) {
 *   if (error instanceof DOMException && error.name === 'AbortError') {
 *     // Handle timeout
 *   }
 * }
 * ```
 */

export async function fetchWithTimeout(
  url: string | URL,
  options: RequestInit & { timeout?: number } = {},
  timeoutMs: number = 10000
): Promise<Response> {
  const { timeout: _, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
