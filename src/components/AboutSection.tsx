"use client";

import React, { useEffect, useRef, useState } from 'react';
import { COMPANY_NAME } from '../constants';

/**
 * AboutSection — with animated count-up stats.
 *
 * The stats use a requestAnimationFrame count-up that triggers when the
 * stats container scrolls into view (IntersectionObserver). Each row also
 * gets a subtle reveal animation (.stat-row → .is-visible, defined in
 * globals.css). Persian digits are rendered throughout.
 *
 * Respects prefers-reduced-motion: if the user has reduced motion enabled,
 * the final values are shown immediately with no count-up.
 */

type Stat = {
  /** Numeric target value (the count-up destination). */
  target: number;
  /** Label shown under/beside the number. */
  label: string;
  /** Optional suffix appended after the number (e.g. "+", "/۷"). */
  suffix?: string;
  /** Optional prefix (e.g. "۲۴/" for the 24/7 case). */
  prefix?: string;
};

const STATS: ReadonlyArray<Stat> = [
  { target: 5,   label: 'سال تجربه تخصصی', suffix: '+' },
  { target: 10,  label: 'سازمان مشتری',    suffix: '+' },
  { target: 100, label: 'محصول تخصصی',    suffix: '+' },
  { target: 24,  label: 'پشتیبانی فنی',    prefix: '', suffix: '/۷' },
];

/** Convert a Latin-digit number to Persian digits. */
const toPersian = (n: number | string): string =>
  String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/** Single stat row with count-up behavior. */
const StatRow: React.FC<{ stat: Stat; index: number; start: boolean }> = ({ stat, index, start }) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    // Respect reduced-motion: show final value immediately.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(stat.target);
      return;
    }

    const duration = 1400; // ms
    const startTime = performance.now() + index * 120; // staggered start

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(stat.target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, stat.target, index]);

  return (
    <div
      className={`stat-row flex items-baseline justify-between border-b py-4 ${start ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <dt className="text-sm">{stat.label}</dt>
      <dd className="text-2xl font-semibold nums">
        {stat.prefix && <span>{stat.prefix}</span>}
        {toPersian(value)}
        {stat.suffix && <span>{stat.suffix}</span>}
      </dd>
    </div>
  );
};

const AboutSection: React.FC = () => {
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="border-b py-20 sm:py-24"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-12 lg:gap-12">

          {/* Text block (right in RTL, spans 7/12) */}
          <div className="lg:col-span-7">
            <h2
              id="about-heading"
              className="text-3xl font-semibold leading-tight sm:text-4xl"
            >
              درباره {COMPANY_NAME}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--text)]">ماهان ارتباطات خردمنده</span>{' '}
              از سال ۱۴۰۰ با تمرکز بر واردات، تأمین و اجرای پروژه‌های تجهیزات
              شبکه و زیرساخت فناوری اطلاعات فعالیت می‌کند. ما با کارت بازرگانی،
              نماد اعتماد الکترونیک (اینماد) و کد مالیاتی، فرایند خرید را شفاف
              و قابل اعتماد برای مشتریان سازمانی و دولتی فراهم کرده‌ایم.
            </p>
          </div>

          {/* Stats list (left in RTL, spans 5/12) */}
          <div className="lg:col-span-5" ref={sectionRef}>
            <dl className="border-t border-[var(--border)]">
              {STATS.map((stat, i) => (
                <StatRow key={stat.label} stat={stat} index={i} start={startCount} />
              ))}
            </dl>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
