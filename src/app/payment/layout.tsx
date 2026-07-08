import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پرداخت',
  description: 'نتیجه پرداخت سفارش',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
