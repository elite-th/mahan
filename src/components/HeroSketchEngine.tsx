"use client";

import React, { useEffect } from 'react';
import { useHeroSketch } from '@/hooks/useHeroSketch';

/**
 * HeroSketchEngine — runs the p5.js particle-network animation behind the hero.
 *
 * This component renders nothing visually; it only mounts the useHeroSketch
 * hook which manages the p5 instance (particle flow along a horizontal path
 * that "activates" when the user hovers the CTA button).
 *
 * Loaded via `dynamic(() => import(...), { ssr: false })` in HeroSection so
 * p5.js (which touches `window` at init) never runs on the server.
 */
interface HeroSketchEngineProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  sketchContainerRef: React.RefObject<HTMLDivElement | null>;
  buttonVisRef: React.RefObject<HTMLDivElement | null>;
  realButtonRef: React.RefObject<HTMLButtonElement | null>;
  onLowPerfChange: (isLowPerf: boolean) => void;
}

const HeroSketchEngine: React.FC<HeroSketchEngineProps> = ({
  sectionRef,
  sketchContainerRef,
  buttonVisRef,
  realButtonRef,
  onLowPerfChange
}) => {
  const { isLowPerf } = useHeroSketch(
    sectionRef,
    sketchContainerRef,
    buttonVisRef,
    realButtonRef
  );

  useEffect(() => {
    onLowPerfChange(isLowPerf);
  }, [isLowPerf, onLowPerfChange]);

  return null; // Renders nothing — just runs the sketch.
};

export default HeroSketchEngine;
