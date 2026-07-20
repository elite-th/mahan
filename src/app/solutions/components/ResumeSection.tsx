"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SolutionColor } from './types';
import ResumeAbout from './ResumeAbout';
import ResumeCEOMessage from './ResumeCEOMessage';
import ResumeMethodology from './ResumeMethodology';
import ResumeServices from './ResumeServices';
import ResumeProjects from './ResumeProjects';
import ResumeClients from './ResumeClients';
import ResumeContact from './ResumeContact';

/** Accent color scheme for the Resume tab — cyan/teal */
export const RESUME_COLOR: SolutionColor = {
  primary: 'text-cyan-400',
  light: 'text-cyan-300',
  bg: 'bg-cyan-500/10',
  border: 'border-cyan-500/30',
  glow: 'shadow-lg',
};

interface ResumeSectionProps {
  color?: SolutionColor;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

/**
 * ResumeSection – Main resume component for the Resume tab.
 *
 * Composes all resume sub-components into a 2-column layout:
 * Left column (2/5): About + CEO Message + Contact
 * Right column (3/5): Methodology + Services + Projects + Clients
 * Uses AnimatePresence for entrance animation and dir="rtl" for RTL layout.
 */
export default function ResumeSection({ color: colorProp }: ResumeSectionProps) {
  const color = colorProp ?? RESUME_COLOR;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="resume"
        dir="rtl"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-6xl mx-auto px-4 py-8 md:py-12"
        role="tabpanel"
        id="solution-panel-resume"
        aria-labelledby="solution-tab-resume"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="block w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/60" />
            <span className="block w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
            <span className="block w-8 h-px bg-gradient-to-l from-transparent to-cyan-400/60" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3"
          >
            <span className="text-[var(--accent)]">
              رزومه توانمندی‌ها و سوابق اجرایی
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' as const }}
            className="text-[var(--text-muted)] text-sm md:text-base"
          >
            شرکت ویرا شبکه آران (VNA)
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <span className="block w-12 h-px bg-gradient-to-r from-transparent to-cyan-400/40" />
            <span className="block w-2 h-2 rounded-full bg-cyan-400/30" />
            <span className="block w-12 h-px bg-gradient-to-l from-transparent to-cyan-400/40" />
          </motion.div>
        </div>

        {/* 2-column layout */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column (2/5): About + CEO Message + Contact */}
          <div className="lg:col-span-2 space-y-6">
            <ResumeAbout color={color} />
            <ResumeCEOMessage color={color} />
            <ResumeContact color={color} />
          </div>

          {/* Right column (3/5): Methodology + Services + Projects + Clients */}
          <div className="lg:col-span-3 space-y-10">
            <ResumeMethodology color={color} />
            <ResumeServices color={color} />
            <ResumeProjects color={color} />
            <ResumeClients color={color} />
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
