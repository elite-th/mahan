"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { EyeIcon, EyeSlashIcon } from '@/components/ui/icons';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '', // Honeypot — must stay empty. Bots fill it.
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect authenticated users away from the register page
  useEffect(() => {
    if (isLoggedIn) {
      const redirectUrl = searchParams.get('redirect') || '/account';
      router.replace(redirectUrl);
    }
  }, [isLoggedIn, searchParams, router]);

  // Validation functions
  const validateUsername = (username: string): string => {
    if (!username.trim()) {
      return 'نام کاربری الزامی است.';
    }
    if (username.length < 3) {
      return 'نام کاربری باید حداقل ۳ کاراکتر باشد.';
    }
    if (username.length > 60) {
      return 'نام کاربری نباید بیشتر از ۶۰ کاراکتر باشد.';
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return 'ایمیل الزامی است.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'فرمت ایمیل صحیح نیست.';
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'رمز عبور الزامی است.';
    }
    if (password.length < 8) {
      return 'رمز عبور باید حداقل ۸ کاراکتر باشد.';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'رمز عبور باید حداقل یک حرف داشته باشد.';
    }
    if (!/[0-9]/.test(password)) {
      return 'رمز عبور باید حداقل یک عدد داشته باشد.';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) {
      return 'تکرار رمز عبور الزامی است.';
    }
    if (confirmPassword !== password) {
      return 'رمزهای عبور با یکدیگر مطابقت ندارند.';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    let error = '';
    switch (name) {
      case 'username':
        error = validateUsername(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        // Also revalidate confirm password if it has a value
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submission
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    // Check if there are any errors
    if (usernameError || emailError || passwordError || confirmPasswordError) {
      showToast('لطفاً خطاهای فرم را برطرف کنید.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          website: formData.website, // honeypot — should be empty
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطایی در ثبت نام رخ داد.');
      }

      showToast(data.message || 'ثبت‌نام با موفقیت انجام شد!', 'success');

      // If auto-login succeeded (backend returned user + set cookies),
      // refresh auth context and redirect directly
      if (data.user) {
        // The backend already set auth cookies, just refresh context
        setTimeout(() => window.location.reload(), 500);
        const redirectUrl = searchParams.get('redirect') || '/account';
        router.push(redirectUrl);
      } else {
        // No auto-login — redirect to login page
        const redirectUrl = searchParams.get('redirect');
        router.push(redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login');
      }

    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'ثبت نام موفقیت‌آمیز نبود. لطفاً بعداً تلاش کنید.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center py-12 sm:py-16 bg-[var(--bg)] text-[var(--text)] min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--surface-1)] rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[var(--accent)]">
            ایجاد حساب کاربری
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">برای عضویت در سایت فرم زیر را تکمیل کنید.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              نام کاربری <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-[var(--surface-2)] border rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[var(--border)]'
                }`}
              autoComplete="username"
              placeholder="حداقل ۳ کاراکتر"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {errors.username && (
              <p id="username-error" className="mt-1 text-sm text-red-400" role="alert">
                {errors.username}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              ایمیل <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-[var(--surface-2)] border rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[var(--border)]'
                }`}
              autoComplete="email"
              placeholder="example@domain.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              رمز عبور <span className="text-red-400">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-[var(--surface-2)] border rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[var(--border)]'
                }`}
              autoComplete="new-password"
              placeholder="حداقل ۸ کاراکتر، شامل حرف و عدد"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 bottom-3.5 text-[var(--text-muted)] hover:text-[var(--text)]"
              aria-label={showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-400" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              تکرار رمز عبور <span className="text-red-400">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-[var(--surface-2)] border rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[var(--border)]'
                }`}
              autoComplete="new-password"
              placeholder="رمز عبور را دوباره وارد کنید"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-400" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          {/* Honeypot field — hidden from real users, bots fill it. */}
          <div
            className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="website">وب‌سایت (تکمیل نشود)</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              placeholder="Leave this empty"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:bg-[var(--accent-press)] disabled:cursor-not-allowed"
            >
              {isLoading ? (<div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>) : ('ثبت نام')}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-[var(--text-muted)]">
          حساب کاربری دارید؟{' '}
          <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
            وارد شوید
          </Link>
        </p>
      </div>
    </section>
  );
}
