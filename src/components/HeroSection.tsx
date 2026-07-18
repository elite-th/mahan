"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone } from 'lucide-react';

/**
 * HeroSection — mock mode (v3, no image).
 *
 * The image panel was removed (no raster assets in mock mode). The hero is
 * now a single-column text layout — the brand name is the headline, full stop.
 */
const HeroSection: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleViewProducts = () => {
    router.push('/products');
  };

  return (
    <section
      id="hero"
      aria-label="ماهان ارتباطات خردمنده"
      className="relative -mt-16 flex min-h-[80vh] items-center border-b border-[#262430] bg-[#0b0a0f] px-4 pb-16 pt-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* Inline credential line */}
        <p className="mb-6 text-sm text-[#a8a3b8]">
          <span className="text-[#ece9f2]">شرکت رسمی فناوری اطلاعات</span>
          <span className="mx-2 text-[#6b6680]">·</span>
          واردات رسمی تجهیزات شبکه
        </p>

        {/* Headline */}
        <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-[#ece9f2] sm:text-5xl lg:text-6xl">
          ماهان ارتباطات خردمنده
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#a8a3b8]">
          واردات، تأمین و اجرای پروژه‌های تجهیزات شبکه و زیرساخت فناوری اطلاعات
          برای سازمان‌های دولتی و خصوصی.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleViewProducts}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#a78bfa] px-6 py-3 text-sm font-semibold text-[#0b0a0f] transition-colors duration-150 hover:bg-[#c4b5fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
          >
            مشاهده محصولات
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-1 py-3 text-sm font-medium text-[#ece9f2] underline decoration-[#6b6680] underline-offset-4 transition-colors hover:decoration-[#a78bfa]"
          >
            <Phone className="h-4 w-4 text-[#a8a3b8]" aria-hidden="true" />
            درخواست مشاوره
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
