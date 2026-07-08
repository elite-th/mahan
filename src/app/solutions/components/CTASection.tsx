"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

interface CTASectionProps {
  color: {
    primary: string;
    bg: string;
    border: string;
  };
}

/* Color mapping for CSS custom properties — avoids dynamic Tailwind classes.
 * NOTE: Must be updated when new service colors are added to SOLUTIONS data. */
const COLOR_CSS_MAP: Record<string, { from: string; border: string }> = {
  'bg-rose-500/10': { from: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.2)' },
  'bg-emerald-500/10': { from: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.2)' },
  'bg-amber-500/10': { from: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.2)' },
  'bg-violet-500/10': { from: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.2)' },
  'bg-cyan-500/10': { from: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.2)' },
  'bg-teal-500/10': { from: 'rgba(20, 184, 166, 0.15)', border: 'rgba(20, 184, 166, 0.2)' },
  'bg-sky-500/10': { from: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.2)' },
  'bg-orange-500/10': { from: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.2)' },
};

/**
 * CTASection – Professional call-to-action section with gradient background.
 *
 * Uses CSS custom properties for the gradient (can't use dynamic Tailwind).
 * Layout: flex row on desktop, column on mobile.
 * Entrance animation: fade in + slide up via framer-motion.
 */
export default function CTASection({ color }: CTASectionProps) {
  const cssColors = COLOR_CSS_MAP[color.bg] ?? {
    from: 'rgba(14, 165, 233, 0.15)',
    border: 'rgba(14, 165, 233, 0.2)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(to left, ${cssColors.from}, rgba(30, 41, 59, 0.4), rgba(30, 41, 59, 0.4))`,
        border: `1px solid ${cssColors.border}`,
      }}
    >
      <div className="bg-slate-800/60 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Text content */}
          <div className="flex-1 text-center md:text-right">
            <h4 className="text-white font-bold text-xl mb-1">
              سوالی دارید؟ با ما صحبت کنید
            </h4>
            <p className="text-gray-400 text-sm">
              تیم فنی ما آماده پاسخگویی است.
            </p>
          </div>

          {/* Phone CTA button */}
          <a
            href="tel:02191090702"
            className="
              inline-flex items-center gap-2
              bg-sky-500 hover:bg-sky-600
              text-white px-6 py-3 rounded-xl
              font-semibold transition-colors duration-200
              focus-visible:outline-2 focus-visible:outline-sky-400 focus-visible:outline-offset-2
            "
            aria-label="تماس با ۰۲۱۹۱۰۹۰۷۰۲"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            ۰۲۱۹۱۰۹۰۷۰۲
          </a>
        </div>
      </div>
    </motion.div>
  );
}
