"use client";

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  CONFIG                                                              */
/* ------------------------------------------------------------------ */

/* PERF: Removed FLOATING_ORBS and MESH_BLOBS arrays (heavy GPU blur +
   infinite-loop animations) to reduce AI-slop visual noise and improve
   CLS/INP metrics. Icons are no longer rendered as floating glow halos. */

/* Generate deterministic particles using a simple seed-based approach */
function generateParticles(count: number) {
  const particles: { x: number; y: number; size: number; duration: number; delay: number; opacity: number }[] = [];
  // Simple LCG for deterministic "random" numbers
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < count; i++) {
    particles.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 1 + rand() * 2.5,
      duration: 12 + rand() * 20,
      delay: rand() * 8,
      opacity: 0.15 + rand() * 0.35,
    });
  }
  return particles;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export default function SolutionsHero() {
  // PERF: Respect the user's prefers-reduced-motion setting — render a static
  // (but still attractive) version with no infinite-loop animations.
  const shouldReduceMotion = useReducedMotion();
  // PERF: Reduced from 30 to 8 particles — dramatic cut in concurrent animation jobs.
  const particles = useMemo(() => generateParticles(shouldReduceMotion ? 0 : 8), [shouldReduceMotion]);

  return (
    <section
      className="relative py-28 md:py-40 px-4 overflow-hidden"
      aria-label="خدمات ویرا شبکه آران"
    >
      {/* Layer 1: Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Layer 2: REMOVED — mesh gradient blobs were heavy blurred color spots
          that drift on infinite loops (AI-slop pattern). Cut for performance. */}

      {/* Layer 3: Particle field — tiny floating dots */}
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            y: [0, -30, -60],
          }}
          transition={{
            opacity: { duration: p.duration, repeat: Infinity, delay: p.delay },
            y: { duration: p.duration * 1.5, repeat: Infinity, ease: 'linear', delay: p.delay },
          }}
        />
      ))}

      {/* Layer 4: Spotlight radial glow behind the title (opacity reduced to
          keep the effect subtle, no longer competing with removed blobs). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0.02) 40%, transparent 70%)',
        }}
      />

      {/* Layer 5: Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Layer 6: Bottom fade to match next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900" />

      {/* Layer 7: REMOVED — floating icon orbs with glow halos + infinite
          float animation + backdrop-blur. Cut as AI-slop / GPU-heavy. */}

      {/* Content */}
      <motion.div
        className="relative max-w-4xl mx-auto text-center z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Decorative line above title */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="block w-8 h-px bg-gradient-to-r from-transparent to-sky-400/60" />
          <span className="block w-1.5 h-1.5 rounded-full bg-sky-400/60" />
          <span className="block w-8 h-px bg-gradient-to-l from-transparent to-sky-400/60" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
        >
          {/* Solid color headings (gradient text removed for clarity + B2B trust) */}
          <span className="text-sky-300">
            خدمات ویرا شبکه آران
          </span>
          <br />
          <span className="text-white text-3xl md:text-4xl lg:text-5xl">
            برای شما
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300/80 max-w-2xl mx-auto leading-relaxed"
        >
          با بهره‌گیری از تجربه و تخصص روز، خدمات نوآورانه و قابل اعتماد را
          برای نیازهای ICT سازمان شما ارائه می‌نماید.
        </motion.p>

        {/* Decorative line below subtitle */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 mt-6"
        >
          <span className="block w-12 h-px bg-gradient-to-r from-transparent to-sky-400/40" />
          <span className="block w-2 h-2 rounded-full bg-sky-400/30" />
          <span className="block w-12 h-px bg-gradient-to-l from-transparent to-sky-400/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
