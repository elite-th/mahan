"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { textToBg } from './utils';

interface FeatureCardProps {
  text: string;
  color: {
    primary: string;   // e.g. "text-rose-400"
  };
  index: number;
}

/**
 * FeatureCard – A lightweight feature list item.
 *
 * No card, no border, no backdrop-blur, no hover.
 * Just clean text with a tiny colored dot and a subtle stagger animation.
 */
export default function FeatureCard({ text, color, index }: FeatureCardProps) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="flex items-start gap-2.5 py-1.5"
    >
      {/* Small colored bullet */}
      <span
        className={`mt-1.5 shrink-0 w-1 h-1 rounded-full ${textToBg(color.primary)}`}
        aria-hidden="true"
      />
      <span className="text-gray-300 text-sm leading-relaxed">{text}</span>
    </motion.li>
  );
}
