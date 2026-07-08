import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from './LoginForm';
import { COMPANY_SLOGAN } from '@/constants';

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  description: `ورود به حساب کاربری ${COMPANY_SLOGAN}`,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <section className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-slate-900">
        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
      </section>
    }>
      <LoginForm />
    </Suspense>
  );
}
