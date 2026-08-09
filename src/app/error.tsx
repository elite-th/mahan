"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

/**
 * Error boundary — professional, principled error message.
 *
 * Sober, user-respectful copy that explains what happened and what the user
 * can do next (retry or go home). Uses the site purple theme.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-16 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error icon — solid, no glow */}
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
          <AlertCircle className="h-8 w-8 text-[var(--accent)]" aria-hidden="true" />
        </div>

        {/* Heading — sober, factual */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">
          خطایی رخ داد
        </h1>

        {/* Explanation — clear, no blame, no jokes */}
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-8">
          در پردازش درخواست شما مشکلی پیش آمد. لطفاً دوباره تلاش کنید؛ اگر خطا
          تکرار شد، کمی بعد مجدداً مراجعه فرمایید.
        </p>

        {/* Actions — retry (primary) + home (secondary) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg)] text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            تلاش مجدد
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] text-sm font-semibold rounded-lg border border-[var(--border)] transition-colors duration-200"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            بازگشت به خانه
          </Link>
        </div>

        {/* Digest — small, technical, for support reference */}
        {error.digest && (
          <p className="mt-8 text-xs text-[var(--text-faint)] nums" dir="ltr">
            کد خطا: {error.digest}
          </p>
        )}
      </div>
    </section>
  )
}
