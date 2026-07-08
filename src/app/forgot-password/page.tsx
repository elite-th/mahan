import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';
import { COMPANY_SLOGAN } from '@/constants';

export const metadata: Metadata = {
  title: 'بازیابی رمز عبور',
  description: `بازیابی رمز عبور حساب کاربری ${COMPANY_SLOGAN}`,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
