"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { SolutionData } from './types';
import FeatureCard from './FeatureCard';
import StepTimeline from './StepTimeline';
import AdvantageList from './AdvantageList';
import { textToBg } from './utils';

interface SolutionDetailProps {
  solution: SolutionData;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export default function SolutionDetail({ solution }: SolutionDetailProps) {
  const { color } = solution;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={solution.id}
        dir="rtl"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-6xl mx-auto px-4 py-8 md:py-12"
        role="tabpanel"
        id={`solution-panel-${solution.id}`}
        aria-labelledby={`solution-tab-${solution.id}`}
      >
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column: Image + Description + Details (NO card for details) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-[var(--surface-1)]">
              <Image
                src={solution.heroImage}
                alt={solution.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent" />
              {/* Title badge overlay — removed backdrop-blur-md */}
              <div className="absolute bottom-4 right-4 left-4">
                <div
                  className={`inline-flex items-center gap-2 ${color.bg} border ${color.border} rounded-xl px-4 py-2`}
                >
                  <span className={color.primary}>{solution.icon}</span>
                  <span className="text-[var(--text)] font-bold text-sm md:text-base">{solution.title}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className={`text-2xl md:text-3xl font-bold text-[var(--text)] flex items-center gap-3 ${color.primary}`}>
                {solution.icon}
                <span>{solution.title}</span>
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
                {solution.description}
              </p>
            </div>

            {/* Details — simple border-r accent paragraph, no card wrapper */}
            {solution.details && (
              <p
                className="text-[var(--text-faint)] leading-relaxed text-sm border-r-2 pr-4"
                style={{ borderColor: 'var(--detail-accent, rgba(100,116,139,0.3))' }}
              >
                {solution.details}
              </p>
            )}
          </div>

          {/* Right column: Features + Steps + Advantages — NO card wrappers */}
          <div className="lg:col-span-3 space-y-10">
            {/* Features section — just heading + list */}
            <div>
              <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
                {solution.featureSectionTitle || 'خدمات ارائه‌شده'}
              </h3>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1" role="list">
                {solution.features.map((f, i) => (
                  <FeatureCard
                    key={i}
                    text={f}
                    color={{
                      primary: color.primary,
                    }}
                    index={i}
                  />
                ))}
              </ul>
            </div>

            {/* Steps section */}
            {solution.steps && solution.steps.length > 0 && (
              <StepTimeline steps={solution.steps} color={color} />
            )}

            {/* Advantages section */}
            {solution.advantages && solution.advantages.length > 0 && (
              <AdvantageList advantages={solution.advantages} color={color} />
            )}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
