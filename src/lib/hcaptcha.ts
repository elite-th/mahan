import { logger } from '@/lib/logger';

/**
 * Verify an hCaptcha token server-side.
 *
 * @param token - The hCaptcha token from the client (h-captcha-response)
 * @param remoteIp - Optional: the visitor's IP
 * @returns true if the token is valid, false otherwise
 *
 * @see https://docs.hcaptcha.com/#server
 */
export async function verifyHcaptchaToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  // Secret key: from env var ONLY — NEVER hardcode the secret in source!
  // (Hardcoding it causes the secret to leak into client-side JS bundles.)
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  // Site key is also sent in the siteverify payload (per hCaptcha docs).
  // Site key is public, so hardcoded fallback is safe.
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '51fc458a-7656-4458-ae6e-306a9a9a86d4';

  // Fail CLOSED: if HCAPTCHA_SECRET_KEY is missing, reject all registrations.
  if (!secretKey) {
    logger.error('hCaptcha: HCAPTCHA_SECRET_KEY not configured — rejecting registration');
    return false;
  }

  if (!token || typeof token !== 'string') {
    return false;
  }

  try {
    const body = new URLSearchParams();
    body.append('secret', secretKey);
    body.append('response', token);
    body.append('sitekey', siteKey);
    if (remoteIp) {
      body.append('remoteip', remoteIp);
    }

    const response = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      logger.error('hCaptcha: siteverify HTTP error', { status: response.status });
      return false;
    }

    const data = (await response.json()) as {
      success: boolean;
      'error-codes'?: string[];
    };

    if (!data.success) {
      logger.warn('hCaptcha: verification failed', { errorCodes: data['error-codes'] });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('hCaptcha: siteverify fetch failed', undefined, error instanceof Error ? error : undefined);
    return false;
  }
}

/** Extract the visitor's IP from request headers (best-effort). */
export function getClientIp(request: Request): string | undefined {
  const headers = new Headers(request.headers);
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((s) => s.trim());
    return ips[0] || undefined;
  }
  return headers.get('x-real-ip') || undefined;
}
