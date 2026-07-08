"use client";

import React, { useEffect } from 'react';
import { useHeroSketch } from '@/hooks/useHeroSketch';

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

  return null; // This component doesn't render anything visually, it just runs the sketch
};

export default HeroSketchEngine;
