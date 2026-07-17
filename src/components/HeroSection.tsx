"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Headphones, Truck, ArrowLeft, Phone, type LucideIcon } from 'lucide-react';
import styles from './HeroSection.module.css';

/**
 * Trust badges row (3 items) — below the CTA buttons.
 */
const TRUST_BADGES: ReadonlyArray<{ icon: LucideIcon; label: string }> = [
  { icon: ShieldCheck, label: 'گارانتی اصالت کالا' },
  { icon: Headphones, label: 'پشتیبانی تخصصی ۲۴/۷' },
  { icon: Truck, label: 'تحویل سریع' },
];

/**
 * Stats strip (3 items, Persian digits) — bottom of hero, in a glass container.
 */
const STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '۵+', label: 'سال تجربه' },
  { value: '۱۰+', label: 'سازمان مشتری' },
  { value: '۱۰۰+', label: 'محصول تخصصی' },
];

/**
 * HeroSection — redesigned (Task 5-A).
 *
 * Removed (VIRA signatures):
 *  - p5.js particle canvas (HeroSketchEngine dynamic import + usage)
 *  - SVG `unopaq` color-matrix filters
 *  - Spinning gradient `.spin` layers around the CTA
 *  - `isLowPerf` state, `sketchContainerRef`/`buttonVisRef`/`realButtonRef` refs
 *
 * New visual (distinct from VIRA):
 *  - `.aurora` animated background blobs (violet + orchid)
 *  - SVG overlay: hex grid texture + concentric signal rings + flowing data curves
 *  - Static `.text-gradient` title with a subtle slow shimmer (replaces the old
 *    spinning gradient layer animation)
 *
 * Layout: full-height hero, slides under the fixed header (-mt-20), centered
 * content stack — pill badge → title → subtitle → 2 CTAs → 3 trust badges →
 * glass stats strip.
 *
 * Performance: pure CSS/SVG, no canvas. Respects prefers-reduced-motion.
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
      aria-label="ماهان ارتباطات خردمنده — پیشگام در صنعت ICT"
      className="aurora relative -mt-20 flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0c0418] px-4 pb-12 pt-28 sm:pt-32"
    >
      {/* ──────────────────────────────────────────────────────────────
          SVG geometric pattern overlay (DISTINCT from VIRA's particle
          network / PCB traces). Layers:
            1. Subtle hexagonal grid texture (background structure)
            2. Concentric signal rings centered on the viewport (ICT
               broadcast/communication feel)
            3. Two flowing data curves suggesting network connectivity
          All purely decorative — aria-hidden, pointer-events: none.
         ────────────────────────────────────────────────────────────── */}
      <svg
        className={`pointer-events-none absolute inset-0 h-full w-full ${styles.patternSvg}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="50%" stopColor="#e879f9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
          </linearGradient>
          <pattern id="heroHexGrid" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M28 0 L56 16 L56 32 L28 48 L0 32 L0 16 Z"
              fill="none"
              stroke="#c084fc"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Layer 1: hex grid texture */}
        <rect width="100%" height="100%" fill="url(#heroHexGrid)" />

        {/* Layer 2: concentric signal rings (outer <g> positions the group to
            viewport center; inner <g className=rings> handles the breathe
            animation via CSS transform — keeping the two transforms on
            separate elements avoids the CSS-transform-replaces-SVG-attribute
            conflict). */}
        <g transform="translate(720 450)">
          <g className={styles.rings}>
            <circle r="140" fill="none" stroke="#c084fc" strokeOpacity="0.20" strokeWidth="1" />
            <circle r="240" fill="none" stroke="#c084fc" strokeOpacity="0.16" strokeWidth="1" />
            <circle r="350" fill="none" stroke="#e879f9" strokeOpacity="0.12" strokeWidth="1" />
            <circle r="470" fill="none" stroke="#c084fc" strokeOpacity="0.08" strokeWidth="1" />
            <circle r="600" fill="none" stroke="#e879f9" strokeOpacity="0.05" strokeWidth="1" />
            <circle r="740" fill="none" stroke="#c084fc" strokeOpacity="0.03" strokeWidth="1" />
          </g>
        </g>

        {/* Layer 3: flowing data curves */}
        <g className={styles.flowLines}>
          <path
            d="M -100 280 Q 360 130, 720 330 T 1540 260"
            fill="none"
            stroke="url(#heroCurveGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          <path
            d="M -100 660 Q 360 810, 720 590 T 1540 670"
            fill="none"
            stroke="url(#heroCurveGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.30"
          />
        </g>
      </svg>

      {/* ──────────────────────────────────────────────────────────────
          Centered content stack
         ────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        {/* 1. Pill badge */}
        <div
          className={`${styles.fade} ${styles.delay1} glow-ring mb-6 inline-flex items-center gap-2 rounded-full border border-[#9333ea]/40 bg-[#1f0e36]/70 px-4 py-1.5 backdrop-blur-sm`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e879f9] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d946ef]" />
          </span>
          <span className="text-sm font-medium text-[#d8b4fe]">شرکت رسمی فناوری اطلاعات</span>
        </div>

        {/* 2. Main title — text-gradient utility + subtle shimmer (CSS module) */}
        <h1
          className={`${styles.fade} ${styles.delay2} ${styles.heroTitle} text-gradient text-4xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl`}
        >
          ماهان ارتباطات خردمنده
        </h1>

        {/* 3. Subtitle */}
        <p
          className={`${styles.fade} ${styles.delay3} mt-4 text-base text-[#c084fc]/80 sm:text-xl md:text-2xl`}
        >
          پیشگام در صنعت ICT
        </p>

        {/* 4. Two CTA buttons — stack on mobile, side-by-side on sm+.
              RTL flex-row: first child (primary) appears on the right,
              second child (secondary) appears on the left. */}
        <div
          className={`${styles.fade} ${styles.delay4} mt-8 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center`}
        >
          <button
            type="button"
            onClick={handleViewProducts}
            aria-label="مشاهده محصولات ماهان ارتباطات خردمنده"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#9333ea] via-[#a855f7] to-[#e879f9] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#9333ea]/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e879f9]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e879f9]"
          >
            <span>مشاهده محصولات</span>
            <ArrowLeft
              className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </button>
          <a
            href="#contact"
            aria-label="درخواست مشاوره از ماهان ارتباطات خردمنده"
            className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-base font-semibold text-[#d8b4fe] transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span>درخواست مشاوره</span>
          </a>
        </div>

        {/* 5. Trust badges — 3 items with lucide-react icons */}
        <ul
          className={`${styles.fade} ${styles.delay5} mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3`}
        >
          {TRUST_BADGES.map((item, idx) => (
            <li key={idx} className="inline-flex items-center gap-2 text-sm text-[#cbd5e1]">
              <item.icon className="h-4 w-4 text-[#e879f9]" aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        {/* 6. Stats strip — glass container, 3 stats, Persian digits */}
        <div
          className={`${styles.fade} ${styles.delay6} glass mt-8 flex w-full max-w-2xl items-stretch justify-around gap-2 rounded-2xl px-4 py-4 sm:px-6`}
        >
          {STATS.map((stat, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div
                  className="w-px self-center bg-gradient-to-b from-[#9333ea]/10 via-[#c084fc]/40 to-[#9333ea]/10"
                  style={{ height: '2.5rem' }}
                  aria-hidden="true"
                />
              )}
              <div className="flex flex-1 flex-col items-center gap-0.5">
                <span className="text-gradient text-2xl font-bold nums sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-[#c084fc]/70 sm:text-sm">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
