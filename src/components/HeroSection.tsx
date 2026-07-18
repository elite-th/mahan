"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Phone } from 'lucide-react';

/**
 * HeroSection — anti-slop redesign (v3).
 *
 * What was removed (AI slop):
 *  - p5.js particle canvas (VIRA signature)
 *  - `.aurora` animated background blobs
 *  - SVG hex grid + concentric signal rings + flow curves (decorative noise)
 *  - Pill badge with `animate-ping` dot + `glow-ring`
 *  - `text-gradient` on the H1
 *  - Subtle shimmer animation on the title
 *  - Gradient CTA button (from-violet via-violet to-orchid) + colored shadow
 *  - `hover:-translate-y-0.5` lift
 *  - `.glass` on the secondary CTA
 *  - Trust badges row with lucide icons (ShieldCheck/Headphones/Truck)
 *  - `.glass` stats strip with gradient dividers + `text-gradient` numbers
 *  - Staggered fade-in entrance animations (delay1..delay6)
 *
 * What replaced it:
 *  - A quiet, asymmetric layout: text block on the right (RTL), a single
 *    real product/sector image on the left. No decorative SVG.
 *  - Solid color title (no gradient). The brand name is the headline.
 *  - One primary CTA (solid accent fill) + one secondary (text link with
 *    an underline, no button chrome).
 *  - One inline credential line (not a badge row): "واردات رسمی · گارانتی
 *    اصالت · پشتیبانی فنی" — text-only, separated by middle dots.
 *  - No stats strip in the hero (the About section owns the numbers).
 */
const HeroSection: React.FC = () => {
  const router = useRouter();

  // On mount (page load/refresh), scroll to top so the hero is in view.
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
      className="relative -mt-20 flex min-h-[88vh] items-center border-b border-[#262430] bg-[#0b0a0f] px-4 pb-16 pt-32 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* ── Text block (right in RTL, spans 7/12 on desktop) ── */}
        <div className="lg:col-span-7">
          {/* Inline credential line — text only, no pill, no ping dot */}
          <p className="mb-6 text-sm text-[#a8a3b8]">
            <span className="text-[#ece9f2]">شرکت رسمی فناوری اطلاعات</span>
            <span className="mx-2 text-[#6b6680]">·</span>
            واردات رسمی تجهیزات شبکه
          </p>

          {/* Headline — solid color, no gradient, no shimmer.
              The brand name IS the headline. */}
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-[#ece9f2] sm:text-5xl lg:text-6xl">
            ماهان ارتباطات خردمنده
          </h1>

          {/* Subtitle — restrained, one line */}
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#a8a3b8]">
            واردات، تأمین و اجرای پروژه‌های تجهیزات شبکه و زیرساخت فناوری اطلاعات
            برای سازمان‌های دولتی و خصوصی.
          </p>

          {/* CTAs — one solid primary, one text-link secondary (no button chrome) */}
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

        {/* ── Visual block (left in RTL, spans 5/12 on desktop) ──
            A single real image (the hero-bg asset) in a plain frame.
            No SVG decoration, no gradient overlay, no hover scale. */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#262430] bg-[#131218]">
            <Image
              src="/images/hero-bg.png"
              alt="تجهیزات شبکه و دیتاسنتر"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
