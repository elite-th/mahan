"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { textToBg } from './utils';

interface Step {
  title: string;
  desc: string;
}

interface StepTimelineProps {
  steps: Step[];
  color: {
    primary: string;   // e.g. "text-rose-400"
    bg: string;        // e.g. "bg-rose-500/10"
  };
}

/**
 * StepTimeline – Vertical timeline with numbered circles on the right (RTL).
 *
 * Each step is connected by a vertical line. The last step's line fades out
 * via a gradient. Simple opacity animation brings each step in.
 * Section title: "فرایند کار ما" with a colored bar accent.
 */
export default function StepTimeline({ steps, color }: StepTimelineProps) {
  return (
    <div className="space-y-4">
      {/* Section title */}
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
        فرایند کار
      </h3>

      {/* Timeline */}
      <div className="relative" role="list" aria-label="فرایند کار">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: i * 0.08,
                ease: 'easeOut' as const,
              }}
              className="flex gap-4 relative"
              role="listitem"
            >
              {/* Right column: numbered circle + vertical connector (RTL) */}
              <div className="flex flex-col items-center shrink-0 w-10">
                {/* Numbered circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-bold text-sm shrink-0
                    ${color.bg} ${color.primary}
                    border border-slate-700/30
                  `}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Vertical connecting line */}
                {!isLast && (
                  <div
                    className="w-px flex-1 min-h-[24px] mt-1"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, var(--step-line-color, rgba(100,116,139,0.3)), transparent)`,
                    }}
                  />
                )}
              </div>

              {/* Left column: content (RTL) */}
              <div className="flex-1 pb-6">
                <div className="py-2">
                  <h4 className="text-white font-semibold mb-1">
                    {step.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
