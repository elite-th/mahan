"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { textToBg } from './utils';

interface AdvantageListProps {
  advantages: string[];
  color: {
    primary: string;   // e.g. "text-rose-400"
  };
}

/**
 * AdvantageList – Clean list of advantages with checkmark icons.
 *
 * Simple fade-in for the whole list. No per-item animation, no hover, no cards.
 * Section title: "چرا ویرا شبکه آران" with a colored bar accent.
 */
export default function AdvantageList({ advantages, color }: AdvantageListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
    >
      {/* Section title */}
      <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
        چرا ویرا شبکه آران
      </h3>

      {/* Advantages list */}
      <ul role="list" aria-label="چرا ویرا شبکه آران">
        {advantages.map((advantage, i) => (
          <li key={i} className="flex items-center gap-2.5 py-1.5">
            <Check className={`w-4 h-4 shrink-0 ${color.primary}`} />
            <span className="text-gray-300 text-sm leading-relaxed">{advantage}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
