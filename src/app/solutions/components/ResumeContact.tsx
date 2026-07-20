"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Globe } from 'lucide-react';
import type { SolutionColor } from './types';
import { colorToRgba } from './utils';

interface ResumeContactProps {
  color: SolutionColor;
}

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

/**
 * ResumeContact – Compact contact information section.
 *
 * Uses a gradient background card similar to CTASection.
 * Each contact item is a row with icon + label + clickable value.
 */
export default function ResumeContact({ color }: ResumeContactProps) {
  const contactItems: ContactItem[] = [
    {
      icon: <Phone className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />,
      label: "تلفن",
      value: "021-91090702",
      href: "tel:02191090702",
    },
    {
      icon: <Mail className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />,
      label: "ایمیل",
      value: "info@example.com",
      href: "mailto:info@example.com",
    },
    {
      icon: <Globe className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />,
      label: "وب‌سایت",
      value: "example.com",
      href: "https://example.com",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(to left, ${colorToRgba(color.bg, 0.15)}, rgba(30, 41, 59, 0.4), rgba(30, 41, 59, 0.4))`,
        border: `1px solid ${colorToRgba(color.bg, 0.2)}`,
      }}
      dir="rtl"
    >
      <div className="bg-[var(--surface-1)] rounded-xl p-6">
        <h3 className="text-[var(--text)] font-bold text-lg mb-4 flex items-center gap-2">
          <Phone className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />
          اطلاعات تماس
        </h3>

        <div className="space-y-3">
          {contactItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[var(--text-muted)] text-sm">{item.label}:</span>
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`
                    text-[var(--text)] text-sm font-medium hover:underline
                    transition-colors duration-200
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]
                  `}
                  aria-label={`${item.label}: ${item.value}`}
                >
                  {item.value}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
