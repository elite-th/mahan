"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@/components/ui/icons';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Redirect authenticated users away from the login page
  useEffect(() => {
    if (isLoggedIn) {
      const redirectUrl = searchParams.get('redirect') || '/account';
      router.replace(redirectUrl);
    }
  }, [isLoggedIn, searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const redirectUrl = searchParams.get('redirect') || undefined;
      await login(username, password, redirectUrl);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center py-12 sm:py-16 bg-[var(--bg)] text-[var(--text)] min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--surface-1)] rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[var(--accent)]">
            ورود به حساب کاربری
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">برای دسترسی به پنل خود وارد شوید.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--text-muted)] mb-1">نام کاربری یا ایمیل</label>
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors" autoComplete="username" />
          </div>
          <div className="relative">
            <label htmlFor="password"className="block text-sm font-medium text-[var(--text-muted)] mb-1">رمز عبور</label>
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors" autoComplete="current-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 bottom-3.5 text-[var(--text-muted)] hover:text-[var(--text)]" aria-label={showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'}>
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
              <Link
                  href="/forgot-password"
                  className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                  رمز عبور خود را فراموش کرده‌اید؟
              </Link>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:bg-[var(--accent-press)] disabled:cursor-not-allowed">
              {isLoading ? (<div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>) : ('ورود')}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-[var(--text-muted)]">
          حساب کاربری ندارید؟{' '}
          <Link href="/register" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              ثبت نام کنید
          </Link>
        </p>
      </div>
    </section>
  );
};
