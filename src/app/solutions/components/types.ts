import type React from 'react';

export interface SolutionColor {
  primary: string;   // e.g. "text-rose-400"
  light: string;     // e.g. "text-rose-300"
  bg: string;        // e.g. "bg-rose-500/10"
  border: string;    // e.g. "border-rose-500/30"
  glow: string;      // e.g. "shadow-lg"
}

export interface SolutionData {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  heroImage: string;
  description: string;
  featureSectionTitle?: string;
  features: string[];
  steps?: { title: string; desc: string }[];
  details?: string;
  advantages?: string[];
  color: SolutionColor;
}
