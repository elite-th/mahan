"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Network, Shield, Cpu, Monitor, Router } from 'lucide-react';
import { textToBg } from './utils';
import type { SolutionColor } from './types';

interface ResumeMethodologyProps {
  color: SolutionColor;
}

/** Expertise item definition */
interface ExpertiseItem {
  icon: React.ReactNode;
  label: string;
}

const EXPERTISE_ITEMS: ExpertiseItem[] = [
  { icon: <Network className="w-5 h-5" />, label: 'شبکه' },
  { icon: <Shield className="w-5 h-5" />, label: 'امنیت اطلاعات' },
  { icon: <Cpu className="w-5 h-5" />, label: 'سیسکو' },
  { icon: <Monitor className="w-5 h-5" />, label: 'مایکروسافت' },
  { icon: <Router className="w-5 h-5" />, label: 'میکروتیک' },
];

/**
 * ResumeMethodology – Work methodology section for the Resume tab.
 *
 * Displays a grid of expertise cards (icon + label) with accent
 * backgrounds and colored icons, followed by a footer description.
 * Uses a 2-column on mobile / 3-column on desktop grid layout.
 */
export default function ResumeMethodology({ color }: ResumeMethodologyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
    >
      {/* Section title */}
      <h3 className="text-xl font-bold text-[var(--text)] mb-2 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
        روش کار
      </h3>

      {/* Subtitle */}
      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
        شرکت ویرا شبکه آران با بهره‌گیری از تیمی متخصص و باتجربه در حوزه‌های:
      </p>

      {/* Expertise grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5" role="list" aria-label="حوزه‌های تخصصی">
        {EXPERTISE_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.06, ease: 'easeOut' as const }}
            className={`
              flex items-center gap-2.5
              ${color.bg}
              border ${color.border}
              rounded-xl px-4 py-3
            `}
            role="listitem"
          >
            <span className={color.primary} aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-[var(--text)] text-sm font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Footer text */}
      <p className="text-[var(--text-muted)] text-sm leading-relaxed">
        خدمات خود را با استفاده از جدیدترین روش‌ها و استانداردهای روز ارائه می‌دهد. همکاری با تأمین‌کنندگان داخلی و خارجی باعث شده این شرکت بتواند تجهیزات موردنیاز پروژه‌های بزرگ را حتی در شرایط دشوار تأمین نماید.
      </p>
    </motion.div>
  );
}
