"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (value: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('لطفاً آدرس ایمیل خود را وارد کنید.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('لطفاً یک آدرس ایمیل معتبر وارد کنید.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data.error || 'خطایی در ارسال لینک بازیابی رخ داد. لطفاً دوباره تلاش کنید.');
      }
    } catch {
      setErrorMessage('خطای سیستمی رخ داد. لطفاً اتصال اینترنت خود را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center py-12 sm:py-16 bg-[var(--bg)] text-[var(--text)] min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--surface-1)] rounded-xl shadow-lg">
        {isSuccess ? (
          /* Success state */
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-emerald-900/30 rounded-full">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-emerald-300">
              لینک بازیابی ارسال شد
            </h1>
            <p className="text-[var(--text-muted)] leading-relaxed">
              لینک بازیابی رمز عبور به ایمیل شما ارسال شد.
              <br />
              لطفاً صندوق ورودی و پوشه اسپم ایمیل خود را بررسی کنید.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به صفحه ورود
            </Link>
          </div>
        ) : (
          /* Form state */
          <>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[var(--accent)]">
                بازیابی رمز عبور
              </h1>
              <p className="mt-2 text-[var(--text-muted)]">
                آدرس ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                  آدرس ایمیل
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                    className="w-full px-4 py-3 pr-11 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
                    placeholder="example@domain.com"
                    autoComplete="email"
                    dir="ltr"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
                  {errorMessage}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:bg-[var(--accent-press)] disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white" />
                  ) : (
                    'ارسال لینک بازیابی'
                  )}
                </button>
              </div>
            </form>
            <p className="text-sm text-center text-[var(--text-muted)]">
              رمز عبور خود را به یاد آوردید؟{' '}
              <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
                وارد شوید
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
