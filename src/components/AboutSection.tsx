"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { Award, Building2, Boxes, Headphones, type LucideIcon } from 'lucide-react';
import { COMPANY_NAME, COMPANY_SLOGAN } from '../constants';

// ---------------------------------------------------------------------------
// Design notes (Task 5-C):
//   • p5.js neural-network particle animation REMOVED entirely — this was the
//     most identifiable VIRA element. Replaced with a pure inline SVG
//     decorative overlay (concentric arcs + hexagonal honeycomb) that is
//     clearly geometric, NOT a particle network.
//   • Count-up animation kept (framer-motion useInView + requestAnimationFrame)
//     but with NO p5 dependency.
//   • Stat cards now use .glass utility with violet→orchid gradient numbers.
//   • Section uses .aurora for ambient background blobs (defined in globals.css).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Persian digit helper
// ---------------------------------------------------------------------------
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function toPersianDigits(n: number): string {
  return n.toString().replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

// ---------------------------------------------------------------------------
// Stat config — four cards rendered in a 2×2 (mobile) / 4-col (desktop) grid
// ---------------------------------------------------------------------------
interface StatConfig {
  value: number;
  suffix?: string;
  label: string;
  Icon: LucideIcon;
}

const STATS: StatConfig[] = [
  { value: 5, suffix: '+', label: 'سال تجربه تخصصی', Icon: Award },
  { value: 10, suffix: '+', label: 'سازمان مشتری', Icon: Building2 },
  { value: 100, suffix: '+', label: 'محصول تخصصی', Icon: Boxes },
];

// 24/7 is a static (non-counting) stat — rendered separately.
const STATIC_STAT = { label: 'پشتیبانی فنی', Icon: Headphones, display: '۲۴/۷' };

// ---------------------------------------------------------------------------
// StatCounter — animates from 0 → value when scrolled into view.
// Uses easeOutCubic for smooth deceleration. Persian digit conversion.
// Respects prefers-reduced-motion: jumps to final value immediately.
// ---------------------------------------------------------------------------
function StatCounter({ value, suffix = '', label, Icon }: StatConfig) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);
  const prefersReducedMotionRef = useRef(false);

  // Detect reduced-motion preference once on mount (browser only).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    prefersReducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  useEffect(() => {
    if (!inView) return;
    // Skip animation under reduced-motion: show final value right away.
    if (prefersReducedMotionRef.current) {
      setDisplay(value);
      return;
    }
    let raf: number;
    let start: number | undefined;
    const duration = 1500;
    const step = (t: number) => {
      if (start === undefined) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutCubic: 1 - (1 - x)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className="glass glow-ring rounded-2xl p-5 sm:p-6 text-center fade-in
                 transition-transform duration-300 hover:-translate-y-1
                 flex flex-col items-center justify-center gap-3"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl
                       bg-gradient-to-br from-[#a855f7]/20 to-[#e879f9]/20
                       ring-1 ring-[#c084fc]/30 text-[#e879f9]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div
        className="text-3xl sm:text-4xl font-black text-gradient nums leading-none"
        aria-label={`${toPersianDigits(value)}${suffix}`}
      >
        {toPersianDigits(display)}
        {suffix && <span className="text-[#c084fc]">{suffix}</span>}
      </div>
      <div className="text-xs sm:text-sm text-purple-100/70 font-medium leading-snug">
        {label}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Static stat (۲۴/۷) — same visual treatment, no count-up.
// ---------------------------------------------------------------------------
function StaticStatCard({
  label,
  display,
  Icon,
}: {
  label: string;
  display: string;
  Icon: LucideIcon;
}) {
  return (
    <div
      className="glass glow-ring rounded-2xl p-5 sm:p-6 text-center fade-in
                 transition-transform duration-300 hover:-translate-y-1
                 flex flex-col items-center justify-center gap-3"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl
                       bg-gradient-to-br from-[#a855f7]/20 to-[#e879f9]/20
                       ring-1 ring-[#c084fc]/30 text-[#e879f9]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="text-3xl sm:text-4xl font-black text-gradient nums leading-none">
        {display}
      </div>
      <div className="text-xs sm:text-sm text-purple-100/70 font-medium leading-snug">
        {label}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Decorative SVG — concentric arcs (top-left) + hexagonal honeycomb (bottom-right)
// Pure inline SVG. Deliberately geometric & static, NOT a particle network.
// ---------------------------------------------------------------------------
function DecorativeSVG() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 800"
      fill="none"
    >
      <defs>
        <radialGradient id="mahan-ring-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e879f9" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#a855f7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mahan-arc-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#c084fc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e879f9" stopOpacity="0.0" />
        </linearGradient>
        <pattern
          id="mahan-hex"
          x="0"
          y="0"
          width="56"
          height="48"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(0 0)"
        >
          <path
            d="M28 0 L56 16 L56 32 L28 48 L0 32 L0 16 Z"
            fill="none"
            stroke="#c084fc"
            strokeOpacity="0.35"
            strokeWidth="0.7"
          />
        </pattern>
      </defs>

      {/* Concentric arcs emanating from the top-right corner */}
      <g transform="translate(1180 60)" strokeLinecap="round">
        {[60, 120, 190, 270, 360, 460, 570, 690].map((r, i) => (
          <circle
            key={`ring-${i}`}
            r={r}
            fill="none"
            stroke="url(#mahan-arc-stroke)"
            strokeWidth={i % 2 === 0 ? 1.6 : 0.9}
            opacity={0.85 - i * 0.08}
          />
        ))}
        {/* Soft inner glow disk */}
        <circle r="48" fill="url(#mahan-ring-grad)" opacity="0.45" />
      </g>

      {/* Hexagonal honeycomb panel in the lower-left */}
      <g transform="translate(-30 540)">
        <rect x="0" y="0" width="520" height="320" fill="url(#mahan-hex)" />
      </g>

      {/* A few dotted hexagon accents scattered between the two clusters */}
      <g fill="#e879f9" opacity="0.55">
        {[
          [220, 220],
          [520, 140],
          [780, 360],
          [340, 420],
          [640, 540],
          [920, 250],
        ].map(([cx, cy], i) => (
          <circle key={`dot-${i}`} cx={cx} cy={cy} r="2.4" />
        ))}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AboutSection — pure CSS/SVG redesign (no p5)
// ---------------------------------------------------------------------------
const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="aurora relative overflow-hidden bg-[#0c0418] py-20 sm:py-28 lg:py-32"
      aria-labelledby="about-heading"
    >
      {/* Decorative geometric overlay (replaces p5 neural net) */}
      <DecorativeSVG />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading block */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#e879f9] sm:text-sm">
            درباره ما
          </span>
          <h2
            id="about-heading"
            className="text-gradient mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
          >
            درباره {COMPANY_NAME}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-loose text-purple-100/80 sm:text-lg">
            <span className="font-bold text-[#c084fc]">{COMPANY_SLOGAN}</span> از
            سال ۱۴۰۰ با تمرکز بر واردات، تأمین و اجرای پروژه‌های تجهیزات شبکه و
            زیرساخت فناوری اطلاعات فعالیت می‌کند. مجموعه ما با در اختیار داشتن کارت
            بازرگانی، نماد اعتماد الکترونیک (اینماد) و کد مالیاتی، فرایند خرید را
            شفاف و قابل اعتماد برای مشتریان سازمانی و دولتی فراهم کرده است.
          </p>
        </div>

        {/* Stats grid: 2×2 on mobile, 4 columns on desktop */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:mt-16 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
          <StaticStatCard
            label={STATIC_STAT.label}
            display={STATIC_STAT.display}
            Icon={STATIC_STAT.Icon}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
