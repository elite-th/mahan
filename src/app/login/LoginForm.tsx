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
    <section className="flex items-center justify-center py-12 sm:py-16 bg-slate-900 text-gray-100 min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-sky-400">
            ورود به حساب کاربری
          </h1>
          <p className="mt-2 text-gray-400">برای دسترسی به پنل خود وارد شوید.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">نام کاربری یا ایمیل</label>
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" autoComplete="username" />
          </div>
          <div className="relative">
            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-1">رمز عبور</label>
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" autoComplete="current-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 bottom-3.5 text-gray-400 hover:text-gray-200" aria-label={showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'}>
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
              <Link
                  href="/forgot-password"
                  className="font-medium text-sky-400 hover:text-sky-300"
              >
                  رمز عبور خود را فراموش کرده‌اید؟
              </Link>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:bg-sky-800 disabled:cursor-not-allowed">
              {isLoading ? (<div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>) : ('ورود')}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-400">
          حساب کاربری ندارید؟{' '}
          <Link href="/register" className="font-medium text-sky-400 hover:text-sky-300">
              ثبت نام کنید
          </Link>
        </p>
      </div>
    </section>
  );
};
