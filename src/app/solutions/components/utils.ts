/**
 * Convert a Tailwind text-color class to its background equivalent.
 * e.g. "text-rose-400" → "bg-rose-400"
 *
 * Used across Solutions components for colored bars/dots/bullets
 * that need to derive a bg class from the primary text color.
 */
export function textToBg(textClass: string): string {
  return textClass.replace('text-', 'bg-');
}

/**
 * Map a Tailwind bg class to an rgba CSS value for inline styles.
 * Covers all color schemes used in the Solutions section.
 * Falls back to a neutral slate color for unknown classes.
 */
const BG_TO_RGBA: Record<string, { r: number; g: number; b: number }> = {
  'bg-rose-500/10':    { r: 244, g: 63,  b: 94  },
  'bg-emerald-500/10': { r: 16,  g: 185, b: 129 },
  'bg-amber-500/10':   { r: 245, g: 158, b: 11  },
  'bg-violet-500/10':  { r: 139, g: 92,  b: 246 },
  'bg-cyan-500/10':    { r: 6,   g: 182, b: 212 },
  'bg-teal-500/10':    { r: 20,  g: 184, b: 166 },
  'bg-[var(--accent-hover)]/10':     { r: 14,  g: 165, b: 233 },
  'bg-orange-500/10':  { r: 249, g: 115, b: 22  },
};

/**
 * Convert a SolutionColor.bg Tailwind class to an rgba string.
 * e.g. "bg-cyan-500/10" → "rgba(6, 182, 212, 0.3)"
 *
 * @param bgClass  The `color.bg` value (e.g. "bg-cyan-500/10")
 * @param alpha    Opacity for the rgba output (default 0.3)
 */
export function colorToRgba(bgClass: string, alpha = 0.3): string {
  const rgb = BG_TO_RGBA[bgClass];
  if (rgb) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  return `rgba(100, 116, 139, ${alpha})`; // fallback: slate
}
