import React from 'react';
import {
  Router as RouterIcon,
  Network as NetworkIcon,
  ShieldCheck as ShieldCheckIcon,
  Wifi as WifiIcon,
  type LucideIcon,
} from 'lucide-react';

/**
 * NetworkCoreVisual — "Network Core" hero diagram (DESIGN-HERO.md §2, §2.5).
 *
 * A pure SVG engineering diagram, NOT decorative motion graphics:
 *  - Central node: solid surface-2 circle, 1px border-strong, router icon. No glow, no breathing.
 *  - Two STATIC concentric rings (close radii → "double-line coverage zone", not bullseye).
 *  - Four straight dashed connector lines to four node cards (1px, dashed).
 *  - Four solid (non-glowing) flow dots traveling along the lines — the ONE animation,
 *    communicating "data in motion" (functional, equivalent to a spinner).
 *  - Four node cards as HTML overlays (Router / Switch / Firewall / Wireless).
 *
 * Mobile (< lg): cards + lines + dots are hidden; only the central node + 2 rings
 * remain as a static, scaled-down decorative element.
 *
 * Anti-slop: no blur/drop-shadow, no gradients, no backdrop-blur, no scale/translate
 * hover, no animate-pulse/ping/bounce. The only keyframe is `flow-dot` in globals.css.
 */

type NodeCardDef = {
  label: string;
  /** Card center in 480×480 viewBox coords. */
  cx: number;
  cy: number;
  Icon: LucideIcon;
};

type LineDef = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Animation delay (s) for the flow dot on this line. */
  delay: string;
};

// Card centers — four corners of the viewBox (with comfortable inset).
const CARDS: NodeCardDef[] = [
  { label: 'روتر',    cx: 70,  cy: 70,  Icon: RouterIcon },
  { label: 'سوئیچ',   cx: 410, cy: 70,  Icon: NetworkIcon },
  { label: 'فایروال', cx: 70,  cy: 410, Icon: ShieldCheckIcon },
  { label: 'وایرلس',  cx: 410, cy: 410, Icon: WifiIcon },
];

// Connector lines: start at the edge of the central node (r=40, centered at 240,240)
// and travel toward each card center. Diagonal direction unit vector = (±1,±1)/√2,
// so 40px from center ≈ ±28.28 → start points (212,212), (268,212), (212,268), (268,268).
const LINES: LineDef[] = [
  { x1: 212, y1: 212, x2: 70,  y2: 70,  delay: '0s' },
  { x1: 268, y1: 212, x2: 410, y2: 70,  delay: '1s' },
  { x1: 212, y1: 268, x2: 70,  y2: 410, delay: '2s' },
  { x1: 268, y1: 268, x2: 410, y2: 410, delay: '3s' },
];

const VIEWBOX = 480;

const NetworkCoreVisual: React.FC = () => {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        {/* Two static concentric coverage rings.
            Radii 62 and 70 are intentionally close — reads as a "double-line
            coverage zone" on an engineering map, NOT a bullseye/target.
            No animation (would be decorative slop). */}
        <circle
          cx="240"
          cy="240"
          r="62"
          fill="none"
          stroke="var(--hero-ring)"
          strokeWidth="1"
        />
        <circle
          cx="240"
          cy="240"
          r="70"
          fill="none"
          stroke="var(--hero-ring)"
          strokeWidth="1"
        />

        {/* Four straight dashed connector lines + four solid flow dots.
            Hidden below lg (mobile shows only the static core + rings). */}
        <g className="hidden lg:block">
          {LINES.map((l, i) => (
            <line
              key={`line-${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="var(--hero-line)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}

          {LINES.map((l, i) => (
            <circle
              key={`dot-${i}`}
              r="3"
              fill="var(--hero-flow)"
              className="hero-flow-dot"
              style={
                {
                  '--flow-path': `path('M ${l.x1} ${l.y1} L ${l.x2} ${l.y2}')`,
                  animationDelay: l.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </g>

        {/* Central node — solid surface-2 fill, 1px border-strong stroke.
            NO glow, NO breathing animation, NO filter. Just a clean filled circle. */}
        <circle
          cx="240"
          cy="240"
          r="40"
          fill="var(--surface-2)"
          stroke="var(--border-strong)"
          strokeWidth="1"
        />
        {/* Router icon centered in the core (240,240). Lucide icons are nested
            SVG elements (valid SVG). Translate positions the 40×40 icon so its
            center aligns with the core center. */}
        <g transform="translate(220, 220)">
          <RouterIcon
            size={40}
            strokeWidth={1.5}
            className="text-[#a78bfa]"
            aria-hidden="true"
          />
        </g>
      </svg>

      {/* Four node cards as HTML overlays (desktop only).
          Positioned by percentage so they scale with the responsive container.
          Each card is a solid surface-1 box with 1px border, an accent icon,
          and a Persian label — no glass, no gradient, no hover lift. */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {CARDS.map((card, i) => {
          const leftPct = (card.cx / VIEWBOX) * 100;
          const topPct = (card.cy / VIEWBOX) * 100;
          const { Icon } = card;
          return (
            <div
              key={`card-${i}`}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border border-[#2a2640] bg-[#15121f] px-3 py-2"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <Icon size={16} className="text-[#a78bfa]" aria-hidden="true" />
              <span className="whitespace-nowrap text-xs font-medium text-[#f0edf7]">
                {card.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkCoreVisual;
