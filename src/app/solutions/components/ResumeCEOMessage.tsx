"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { textToBg, colorToRgba } from './utils';
import type { SolutionColor } from './types';

interface ResumeCEOMessageProps {
  color: SolutionColor;
}

/**
 * ResumeCEOMessage – CEO message section for the Resume tab.
 *
 * Displays a quote-style message with a large decorative quote mark
 * in the accent color, right-border accent line, and subtle User icon.
 * Quote text uses text-gray-400 for a softer visual weight.
 */
export default function ResumeCEOMessage({ color }: ResumeCEOMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-6"
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
        <User className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />
        پیام مدیرعامل
      </h3>

      {/* Quote block */}
      <div
        className="relative border-r-2 pr-5"
        style={{ borderColor: colorToRgba(color.bg, 0.4) }}
      >
        {/* Decorative quote mark */}
        <span
          className={`absolute -right-1 -top-3 text-4xl leading-none font-serif select-none ${color.primary}`}
          aria-hidden="true"
        >
          &#x201C;
        </span>

        <blockquote className="text-gray-400 text-sm leading-relaxed mt-2">
          با احترام به همکاران و مشتریان گرامی، ما در این شرکت با ارائه محصولات و خدمات باکیفیت، به دنبال برآورده ساختن نیازهای مشتریان هستیم و تلاش می‌کنیم با ایجاد ارتباطات مؤثر و همکاری سازنده، اهداف بلندمدت شرکت را محقق کنیم.
        </blockquote>
      </div>
    </motion.div>
  );
}
