import type { Metadata } from 'next';
import AccountContent from './AccountContent';
import { COMPANY_SLOGAN } from '@/constants';

export const metadata: Metadata = {
  title: 'حساب کاربری',
  description: `داشبورد کاربری ${COMPANY_SLOGAN} - مشاهده سفارش‌ها و اطلاعات حساب`,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AccountPage() {
  return <AccountContent />;
}
