"use client";

import React from 'react';
import { COMPANY_NAME, COMPANY_SLOGAN } from '../constants';

/**
 * AboutSection — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - p5.js neural-network particle animation (already removed in v2)
 *  - `.aurora` animated background blobs
 *  - Decorative SVG: concentric arcs + honeycomb + scattered dots (noise)
 *  - Eyebrow label "درباره ما" in orchid uppercase tracking
 *  - `text-gradient` on the H2
 *  - Animated count-up stats (requestAnimationFrame 0 → value)
 *  - `.glass` + `.glow-ring` on stat cards
 *  - Gradient icon circles `bg-gradient-to-br from-violet to-orchid`
 *  - `hover:-translate-y-1` lift on stat cards
 *  - Lucide icons (Award/Building2/Boxes/Headphones) as stat decorations
 *  - `fade-in` entrance animation
 *
 * Replaced with:
 *  - A quiet two-column layout: heading + body text on the right (RTL),
 *    a plain stats column on the left. No decorative SVG.
 *  - Solid color heading. The numbers are shown directly (no count-up) —
 *    a real company states its numbers; it doesn't perform them.
 *  - Stats are a vertical list of label + value pairs, separated by 1px
 *    borders. No cards, no icons, no gradients.
 */
const STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '۵+', label: 'سال تجربه تخصصی' },
  { value: '۱۰+', label: 'سازمان مشتری' },
  { value: '۱۰۰+', label: 'محصول تخصصی' },
  { value: '۲۴/۷', label: 'پشتیبانی فنی' },
];

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="border-b border-[#262430] bg-[#0b0a0f] py-20 sm:py-24"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-12 lg:gap-12">

          {/* Text block (right in RTL, spans 7/12) */}
          <div className="lg:col-span-7">
            <h2
              id="about-heading"
              className="text-3xl font-semibold leading-tight text-[#ece9f2] sm:text-4xl"
            >
              درباره {COMPANY_NAME}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#a8a3b8]">
              <span className="font-semibold text-[#ece9f2]">{COMPANY_SLOGAN}</span>{' '}
              از سال ۱۴۰۰ با تمرکز بر واردات، تأمین و اجرای پروژه‌های تجهیزات
              شبکه و زیرساخت فناوری اطلاعات فعالیت می‌کند. مجموعه ما با در اختیار
              داشتن کارت بازرگانی، نماد اعتماد الکترونیک (اینماد) و کد مالیاتی،
              فرایند خرید را شفاف و قابل اعتماد برای مشتریان سازمانی و دولتی
              فراهم کرده است.
            </p>
          </div>

          {/* Stats list (left in RTL, spans 5/12) */}
          <div className="lg:col-span-5">
            <dl className="border-t border-[#262430]">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between border-b border-[#262430] py-4"
                >
                  <dt className="text-sm text-[#a8a3b8]">{stat.label}</dt>
                  <dd className="text-2xl font-semibold text-[#ece9f2] nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
