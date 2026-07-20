"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Cable } from 'lucide-react';
import { textToBg } from './utils';
import type { SolutionColor } from './types';

interface ResumeServicesProps {
  color: SolutionColor;
}

const MAIN_SERVICES = [
  "واردات تجهیزات شبکه و سرور",
  "راه‌اندازی و پشتیبانی شبکه‌های LAN و WAN",
  "ارائه سرویس‌های DNS و Active Directory",
  "اجاره و نگهداری سرورها",
  "ترخیص کالا",
  "بازرسی کالا قبل و بعد از حمل",
  "تست کیفیت و ردیابی سفارشات",
  "تأمین مستقیم تجهیزات پروژه‌های بزرگ",
];

const ARAN_SERVICES = [
  "نظارت و اجرای پروژه‌های فیبر نوری",
  "اجرای پروژه‌های پسیو شبکه و سرور",
  "حفاری و کاتر زدن فیبر نوری",
  "نصب تجهیزات دیتاسنتر",
  "ارائه خدمات به شرکت‌ها، بانک‌ها، سازمان‌ها و سرویس‌دهندگان",
];

/**
 * ResumeServices – Two subsections for main services and Aran services.
 *
 * Each section has a colored bar accent title with an icon,
 * followed by a list of service items with small colored bullets.
 */
export default function ResumeServices({ color }: ResumeServicesProps) {
  return (
    <div className="space-y-10" dir="rtl">
      {/* Main Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
      >
        {/* Section title with colored bar accent */}
        <h3 className="text-xl font-bold text-[var(--text)] mb-5 flex items-center gap-2">
          <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
          <Package className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />
          خدمات اصلی
        </h3>

        {/* Services list */}
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1" role="list" aria-label="خدمات اصلی">
          {MAIN_SERVICES.map((service, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="flex items-start gap-2.5 py-1.5"
            >
              {/* Small colored bullet */}
              <span
                className={`mt-1.5 shrink-0 w-1 h-1 rounded-full ${textToBg(color.primary)}`}
                aria-hidden="true"
              />
              <span className="text-[var(--text-muted)] text-sm leading-relaxed">{service}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Aran Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' as const }}
      >
        {/* Section title with colored bar accent */}
        <h3 className="text-xl font-bold text-[var(--text)] mb-5 flex items-center gap-2">
          <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
          <Cable className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />
          خدمات آران
        </h3>

        {/* Services list */}
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1" role="list" aria-label="خدمات آران">
          {ARAN_SERVICES.map((service, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.15 + i * 0.04 }}
              className="flex items-start gap-2.5 py-1.5"
            >
              {/* Small colored bullet */}
              <span
                className={`mt-1.5 shrink-0 w-1 h-1 rounded-full ${textToBg(color.primary)}`}
                aria-hidden="true"
              />
              <span className="text-[var(--text-muted)] text-sm leading-relaxed">{service}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
