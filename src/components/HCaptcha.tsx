"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * hCaptcha widget for bot protection.
 *
 * Site key: NEXT_PUBLIC_HCAPTCHA_SITE_KEY (must be set in .env)
 *
 * Implementation notes (ref-based pattern to prevent re-render flicker):
 * - The useEffect dependency array is INTENTIONALLY empty `[]`. The widget
 *   is rendered ONCE on mount and never re-rendered. All callbacks are
 *   stored in refs so the widget always calls the latest version without
 *   triggering a re-render cycle.
 *
 * @see https://docs.hcaptcha.com/
 */
declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: (err: unknown) => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact' | 'invisible';
        language?: string;
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const HCAPTCHA_SCRIPT_SRC = 'https://js.hcaptcha.com/1/api.js';

let scriptLoadingPromise: Promise<void> | null = null;

function loadHcaptchaScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.hcaptcha) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${HCAPTCHA_SCRIPT_SRC}"]`);
    if (existing) {
      if (window.hcaptcha) { resolve(); return; }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load hCaptcha script')));
      return;
    }
    const script = document.createElement('script');
    script.src = HCAPTCHA_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load hCaptcha script'));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

interface HCaptchaProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

export default function HCaptcha({ onToken, onExpire, onError, className }: HCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);
  onTokenRef.current = onToken;
  onExpireRef.current = onExpire;
  onErrorRef.current = onError;

  // Site key: from env var, with hardcoded fallback.
  // NOTE: The UUID-format key (51fc458a-...) is the SITE key.
  // The ES_... key is the SECRET (server-side only).
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '51fc458a-7656-4458-ae6e-306a9a9a86d4';

  useEffect(() => {
    if (!siteKey) {
      setError('کپچا پیکربندی نشده است. با پشتیبانی تماس بگیرید.');
      return;
    }
    if (!containerRef.current) return;

    let cancelled = false;

    loadHcaptchaScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.hcaptcha) return;
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => { setError(null); onTokenRef.current?.(token); },
          'expired-callback': () => { onExpireRef.current?.(); },
          'error-callback': (err: unknown) => {
            console.error('hCaptcha error:', err);
            setError('خطا در بارگذاری کپچا. لطفاً صفحه را رفرش کنید.');
            onErrorRef.current?.();
          },
          theme: 'dark',
          size: 'normal',
          language: 'fa',
        });
      })
      .catch(() => {
        if (!cancelled) { setError('خطا در بارگذاری کپچا. لطفاً صفحه را رفرش کنید.'); onErrorRef.current?.(); }
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.hcaptcha) {
        try { window.hcaptcha.remove(widgetIdRef.current); } catch { /* ignore */ }
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <div ref={containerRef} />
      {error && <p className="mt-2 text-sm text-red-400" role="alert">{error}</p>}
    </div>
  );
}
