import type { Metadata } from 'next';
import OrdersContent from './OrdersContent';
import { COMPANY_SLOGAN } from '@/constants';

export const metadata: Metadata = {
  title: 'سفارش‌های من',
  description: `مشاهده تاریخچه و وضعیت سفارش‌ها در ${COMPANY_SLOGAN}`,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function OrdersPage() {
  return <OrdersContent />;
}
