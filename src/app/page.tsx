import React from 'react';
import type { Metadata } from 'next';

import HeroSection from "@/components/HeroSection";
import OurClientsSection from "@/components/OurClientsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/seo";
import { COMPANY_SLOGAN, SITE_URL } from "@/constants";

export const metadata: Metadata = {
  title: COMPANY_SLOGAN,
  description: `ماهان ارتباطات خردمنده، فروشگاه آنلاین تجهیزات شبکه و ارائه‌دهنده خدمات تخصصی امنیت شبکه، دیتاسنتر، SD-WAN، مجازی‌سازی و ایمیل سرور. خرید سوئیچ سیسکو، روتر و تجهیزات دیتاسنتر با گارانتی.`,
  alternates: { canonical: '/' },
  openGraph: {
    title: COMPANY_SLOGAN,
    description: `فروشگاه آنلاین تجهیزات شبکه و خدمات تخصصی فناوری اطلاعات با گارانتی و پشتیبانی.`,
    url: SITE_URL, type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema()} />
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <OurClientsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
