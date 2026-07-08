import React from 'react';
import { COMPANY_SLOGAN, SITE_URL } from '@/constants';
import type { Metadata } from 'next';
import SolutionsContent from './SolutionsContent';
import JsonLd from '@/components/JsonLd';
import { serviceSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: `خدمات و راهکارهای فناوری اطلاعات | ${COMPANY_SLOGAN}`,
  description: `خدمات تخصصی ویرا شبکه آران شامل امنیت شبکه، دیتاسنتر، SD-WAN، مجازی‌سازی، ایمیل سرور Exchange و واردات تجهیزات شبکه و سرور با مشاوره و پشتیبانی حرفه‌ای.`,
  keywords: ['امنیت شبکه', 'دیتاسنتر', 'SD-WAN', 'مجازی‌سازی', 'ایمیل سرور', 'واردات تجهیزات شبکه', 'راهکار فناوری اطلاعات', 'مشاوره شبکه', COMPANY_SLOGAN],
  alternates: { canonical: '/solutions/' },
  openGraph: {
    title: `خدمات و راهکارهای فناوری اطلاعات | ${COMPANY_SLOGAN}`,
    description: `خدمات تخصصی امنیت شبکه، دیتاسنتر، SD-WAN، مجازی‌سازی، ایمیل سرور و واردات تجهیزات.`,
    url: `${SITE_URL}/solutions/`, type: 'website',
  },
};

const servicesLd = [
  serviceSchema({ name: 'امنیت شبکه', serviceType: 'Network Security', description: 'ارزیابی خطرات و آسیب‌پذیری‌ها، پیاده‌سازی فایروال، NIDS/HIDS، رمزنگاری و VPN، آزمایش استحکام و مدیریت امنیت اطلاعات بر اساس ISO-27001.', url: `${SITE_URL}/solutions/` }),
  serviceSchema({ name: 'راه‌اندازی دیتاسنتر', serviceType: 'Data Center Solutions', description: 'مشاوره، طراحی، راه‌اندازی و بهره‌برداری مراکز داده منطبق بر استانداردهای TIA942، ANSI/BICSI 002-201، ISO20000 و CISCO SAFE.', url: `${SITE_URL}/solutions/` }),
  serviceSchema({ name: 'پیاده‌سازی SD-WAN', serviceType: 'SD-WAN', description: 'راه‌اندازی، پیاده‌سازی و پشتیبانی شبکه گسترده مبتنی بر نرم‌افزار (SD-WAN) با ارائه لایسنس‌های معتبر و داشبورد مدیریتی یکپارچه.', url: `${SITE_URL}/solutions/` }),
  serviceSchema({ name: 'مجازی‌سازی', serviceType: 'Virtualization', description: 'مشاوره، طراحی و پشتیبانی زیرساخت مجازی (VMware، Citrix، Microsoft)، VDI، Disaster Recovery و High Availability.', url: `${SITE_URL}/solutions/` }),
  serviceSchema({ name: 'ایمیل سرور Exchange', serviceType: 'Email Server', description: 'راه‌اندازی میل سرور Microsoft Exchange با دسترسی از موبایل، دسکتاپ و وب، تقویم اشتراکی و ویژگی‌های امنیتی.', url: `${SITE_URL}/solutions/` }),
  serviceSchema({ name: 'واردات تجهیزات شبکه و سرور', serviceType: 'Network Equipment Import', description: 'واردات تخصصی تجهیزات سرور و شبکه؛ از اخذ کارت بازرگانی و ثبت سفارش تا تخصیص ارز و ترخیص کالا از گمرک.', url: `${SITE_URL}/solutions/` }),
];

export default function SolutionsPage() {
  return (
    <>
      <JsonLd data={servicesLd} />
      <SolutionsContent />
    </>
  );
}
