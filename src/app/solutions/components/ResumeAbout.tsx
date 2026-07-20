"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { textToBg, colorToRgba } from './utils';
import type { SolutionColor } from './types';

interface ResumeAboutProps {
  color: SolutionColor;
}

/**
 * ResumeAbout – "About the company" section for the Resume tab.
 *
 * Displays company description, goals, and team information
 * with a glassmorphic card wrapper and Building2 icon.
 * Clean text with colored bar accent on the title.
 */
export default function ResumeAbout({ color }: ResumeAboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="bg-[var(--surface-1)] border border-[var(--border)] rounded-xl p-6"
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-[var(--text)] mb-5 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
        <Building2 className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />
        درباره شرکت
      </h3>

      {/* Description */}
      <div className="space-y-4">
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          شرکت بازرگانی ویرا شبکه آران یکی از پیشروان حوزه تجارت بین‌المللی و فناوری اطلاعات است که با رویکردی نوآورانه در زمینه واردات تجهیزات شبکه و سرور، طراحی شبکه و دیتاسنتر، امنیت اطلاعات و ارائه راهکارهای فناوری فعالیت می‌کند.
        </p>

        {/* Goals */}
        <div className="border-r-2 pr-4" style={{ borderColor: colorToRgba(color.bg, 0.3) }}>
          <h4 className="text-[var(--text)] font-semibold text-sm mb-2">اهداف ما</h4>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
            هدف این شرکت ایجاد روابط بلندمدت و پایدار با مشتریان و ارائه خدمات باکیفیت در حوزه تجارت بین‌الملل، واردات و صادرات، تضمین کیفیت، حمل‌ونقل و فناوری اطلاعات است.
          </p>
        </div>

        {/* Team */}
        <div className="border-r-2 pr-4" style={{ borderColor: colorToRgba(color.bg, 0.3) }}>
          <h4 className="text-[var(--text)] font-semibold text-sm mb-2">تیم ما</h4>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
            اعضای تیم ویرا شبکه آران دارای تجربه و مدارک بین‌المللی در حوزه شبکه و فناوری اطلاعات بوده و تمرکز شرکت بر ارائه راهکارهای نوین، افزایش کیفیت خدمات و ارتقای رضایت مشتریان است.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
