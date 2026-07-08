import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسویه حساب',
  description: 'تسویه حساب و پرداخت سفارش',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
