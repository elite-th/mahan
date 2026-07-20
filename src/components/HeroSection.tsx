"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone } from 'lucide-react';
import NetworkCoreVisual from './NetworkCoreVisual';

/**
 * HeroSection — "Network Core" redesign (DESIGN-HERO.md §3).
 *
 * Two-column layout on desktop (single column on mobile):
 *  - Right column (RTL = text side): eyebrow, H1, one-sentence subtitle, two CTAs.
 *  - Left  column (RTL = visual side): <NetworkCoreVisual /> engineering diagram.
 *
 * No stats row (removed in pass 2 — stat inflation with AboutSection).
 * Solid surfaces, 1px borders, one accent color. No gradient text, no glow,
 * no backdrop-blur, no hover lift. The only motion in the hero is the flow-dot
 * animation inside NetworkCoreVisual (functional: "data in motion").
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
      className="relative -mt-16 flex min-h-[80vh] items-center border-b border-[#2a2640] bg-[#0c0a14] px-4 pb-16 pt-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Text column — appears on the RIGHT in RTL (first grid child) */}
        <div className="flex flex-col items-start">
          {/* Eyebrow — credential line, muted, small */}
          <p className="mb-6 text-sm text-[#b4aecb]">
            <span>شرکت تخصصی زیرساخت و شبکه</span>
            <span className="mx-2 text-[#7a7396]" aria-hidden="true">·</span>
            <span>واردات رسمی تجهیزات ICT</span>
          </p>

          {/* H1 — solid text color, NO gradient text */}
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-[#f0edf7] sm:text-5xl lg:text-6xl">
            زیرساخت شبکه‌ی شما، در دستان متخصصان
          </h1>

          {/* Subtitle — ONE focused sentence */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#b4aecb] sm:text-lg">
            واردات، تأمین و اجرای تخصصی تجهیزات شبکه — از روتر و سوئیچ سیسکو تا
            فایروال و راهکارهای وایرلس سازمانی.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleViewProducts}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#a78bfa] px-6 py-3 text-sm font-semibold text-[#0c0a14] transition-colors duration-150 hover:bg-[#c4b5fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
            >
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-1 py-3 text-sm font-medium text-[#f0edf7] underline decoration-[#7a7396] underline-offset-4 transition-colors hover:decoration-[#a78bfa]"
            >
              <Phone className="h-4 w-4 text-[#b4aecb]" aria-hidden="true" />
              درخواست مشاوره فنی
            </a>
          </div>
        </div>

        {/* Visual column — appears on the LEFT in RTL (second grid child) */}
        <div className="w-full">
          <NetworkCoreVisual />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
