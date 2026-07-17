"use client";

import React from 'react';

/**
 * HeroSketchEngine — DEPRECATED (Task 5-A hero redesign).
 *
 * The hero was redesigned to use a pure CSS/SVG visual (aurora background
 * blobs + concentric signal rings + hex grid texture + flowing data curves)
 * instead of the p5.js particle canvas — the p5 particle network was the
 * most identifiable VIRA element and has been removed to make the hero
 * distinctly different.
 *
 * This file is kept as a no-op so any external imports still resolve cleanly.
 * `HeroSection.tsx` no longer imports or renders this component, and the
 * `useHeroSketch` hook is now dead code (left untouched — out of scope).
 *
 * The props interface is preserved (all fields optional) for backwards
 * compatibility with any caller still passing refs.
 */
export interface HeroSketchEngineProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
  sketchContainerRef?: React.RefObject<HTMLDivElement | null>;
  buttonVisRef?: React.RefObject<HTMLDivElement | null>;
  realButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onLowPerfChange?: (isLowPerf: boolean) => void;
}

const HeroSketchEngine: React.FC<HeroSketchEngineProps> = () => {
  return null;
};

export default HeroSketchEngine;
