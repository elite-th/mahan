"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { SolutionData } from './types';

interface SolutionsTabBarProps {
  solutions: SolutionData[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function SolutionsTabBar({ solutions, activeId, onSelect }: SolutionsTabBarProps) {
  return (
    <section dir="rtl" className="relative z-20 -mt-8 mb-8" aria-label="انتخاب خدمات">
      <div className="max-w-6xl mx-auto px-4">
        <nav role="tablist" aria-label="خدمات" className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2">
          {solutions.map((s) => {
            const isActive = activeId === s.id;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`solution-panel-${s.id}`}
                id={`solution-tab-${s.id}`}
                onClick={() => onSelect(s.id)}
                className={`
                  relative flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm md:text-base font-semibold
                  transition-all duration-300 border whitespace-nowrap flex-shrink-0
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]
                  ${
                    isActive
                      ? `${s.color.bg} ${s.color.primary} ${s.color.border} shadow-lg ${s.color.glow} scale-105`
                      : 'bg-[var(--surface-1)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--surface-1)]'
                  }
                `}
              >
                {/* Color dot indicator */}
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300 ${
                    isActive ? s.color.primary.replace('text-', 'bg-') : 'bg-[var(--surface-2)]'
                  }`}
                />
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </span>
                <span className="hidden sm:inline">{s.shortTitle}</span>

                {/* Animated underline indicator */}
                {isActive && (
                  <motion.div
                    layoutId="solutions-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{
                      background: 'currentColor',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
