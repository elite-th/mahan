import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سبد خرید',
  description: 'سبد خرید شما',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
