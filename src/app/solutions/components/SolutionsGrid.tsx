"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { SolutionData } from './types';

interface SolutionsGridProps {
  solutions: SolutionData[];
  activeId: string;
  onSelect: (id: string) => void;
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function SolutionsGrid({ solutions, activeId, onSelect }: SolutionsGridProps) {
  const otherSolutions = solutions.filter((s) => s.id !== activeId && s.id !== 'resume');

  return (
    <section dir="rtl" className="max-w-6xl mx-auto px-4 pb-16" aria-label="سایر خدمات">
      <h2 className="text-2xl font-bold text-[var(--text)] mb-8 text-center">همه خدمات</h2>
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
        key={activeId}
      >
        {otherSolutions.map((s) => (
          <motion.button
            key={s.id}
            variants={gridItemVariants}
            onClick={() => onSelect(s.id)}
            className={`
              group text-right bg-[var(--surface-1)] border border-[var(--border)] rounded-xl p-5
              transition-all duration-300
              hover:-translate-y-1 hover:border-[color:var(--accent-border)] hover:bg-[var(--surface-1)]
              hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]
            `}
            style={{
              '--accent-border': `var(--color-${s.id}-border, rgba(100, 116, 139, 0.3))`,
            } as React.CSSProperties}
            aria-label={`مشاهده ${s.title}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${s.color.bg} ${s.color.primary} flex items-center justify-center group- transition-transform`}
              >
                {s.icon}
              </div>
              <h3 className="text-[var(--text)] font-bold">{s.title}</h3>
            </div>
            <p className="text-[var(--text-muted)] text-sm line-clamp-2">
              {s.description.length > 120 ? s.description.slice(0, 120) + '…' : s.description}
            </p>
            <div
              className={`mt-3 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all ${s.color.primary}`}
            >
              بیشتر بدانید
              <ArrowLeft className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
