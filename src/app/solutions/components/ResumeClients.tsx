"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';
import { textToBg, colorToRgba } from './utils';
import type { SolutionColor } from './types';

interface ResumeClientsProps {
  color: SolutionColor;
}

const CLIENTS = [
  "بانک پارسیان",
  "بانک سامان",
  "شرکت داده‌پردازی فن‌آوا",
  "شرکت پیشگامان توسعه ارتباطات",
  "شرکت داروسازی عبیدی",
];

/**
 * ResumeClients – Grid of client names with glassmorphic cards.
 *
 * Section title with Building icon. Client names are displayed in a
 * responsive grid (2-col mobile, 3-col desktop) of small cards with
 * subtle hover effects.
 */
export default function ResumeClients({ color }: ResumeClientsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      dir="rtl"
    >
      {/* Section title */}
      <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
        <Building className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />
        برخی مشتریان
      </h3>

      {/* Clients grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
        role="list"
        aria-label="برخی مشتریان"
      >
        {CLIENTS.map((client, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: 'easeOut' as const }}
            className={`
              bg-slate-800 border border-slate-700 rounded-xl px-4 py-3
              text-center text-gray-300 text-sm font-medium
              transition-all duration-200
              hover:border-[color:var(--hover-border)] hover:bg-white/[0.05]
            `}
            style={{ '--hover-border': colorToRgba(color.bg, 0.3) } as React.CSSProperties}
            role="listitem"
          >
            {client}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
