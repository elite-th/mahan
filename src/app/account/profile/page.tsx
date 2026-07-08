import type { Metadata } from 'next';
import ProfileContent from './ProfileContent';
import { COMPANY_SLOGAN } from '@/constants';

export const metadata: Metadata = {
  title: 'پروفایل کاربری',
  description: `مشاهده و ویرایش اطلاعات پروفایل کاربری در ${COMPANY_SLOGAN}`,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ProfilePage() {
  return <ProfileContent />;
}
