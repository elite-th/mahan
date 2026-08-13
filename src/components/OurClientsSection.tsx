"use client";

import React, { useEffect, useRef } from 'react';
import ClientLogoCard from './ClientLogoCard';
import { MOCK_CLIENTS } from '@/lib/mock-data';
import { COMPANY_SLOGAN } from '../constants';

/**
 * OurClientsSection — infinite marquee carousel (seamless, JS-driven).
 *
 * The full client list (all 13 clients) is duplicated (rendered twice in a
 * row) inside a flex track. A requestAnimationFrame loop translates the
 * track from 0 to -setWidth (the exact pixel width of one set), then snaps
 * back to 0. Because set 2 is identical to set 1, the snap is invisible —
 * the user sees continuous motion.
 *
 * JS-driven (not CSS keyframes) because:
 *  - The exact pixel width is measured at runtime (responsive breakpoints).
 *  - The snap-back is guaranteed pixel-perfect (no sub-pixel rounding).
 *  - Pauses on hover and respects prefers-reduced-motion.
 *
 * The track is forced to LTR so flex layout is consistent.
 */
const OurClientsSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let setWidth = 0;
    let offset = 0;
    let rafId = 0;
    let lastTime = 0;
    let paused = false;

    // Pixels per second — constant scroll speed.
    const SPEED = 45; // px/s (slow, readable)

    const measure = () => {
      const children = track.children;
      const n = MOCK_CLIENTS.length;
      if (children.length < n) return;
      let w = 0;
      for (let i = 0; i < n; i++) w += children[i].getBoundingClientRect().width;
      setWidth = Math.round(w);
    };

    const tick = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = now - lastTime;
      lastTime = now;

      if (!paused && setWidth > 0) {
        // Advance offset, wrap around at -setWidth (seamless: set 2 == set 1).
        offset -= (SPEED * dt) / 1000;
        if (offset <= -setWidth) {
          // Wrap: add setWidth to bring it back into [−setWidth, 0].
          offset += setWidth;
        }
        track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      // Reset lastTime when tab becomes visible again (avoid huge dt jump).
      lastTime = 0;
    };

    measure();
    rafId = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Re-measure on resize (responsive item widths change at breakpoints).
    const ro = new ResizeObserver(() => {
      measure();
      // Re-clamp offset into the new range.
      if (setWidth > 0) offset = offset % setWidth;
    });
    ro.observe(track);

    // Pause on hover (only if motion is not reduced).
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const onEnter = () => { paused = true; };
      const onLeave = () => { paused = false; lastTime = 0; };
      track.addEventListener('mouseenter', onEnter);
      track.addEventListener('mouseleave', onLeave);
      return () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        ro.disconnect();
        track.removeEventListener('mouseenter', onEnter);
        track.removeEventListener('mouseleave', onLeave);
      };
    }

    // Reduced motion: pause the animation entirely (static row).
    if (prefersReduced) {
      paused = true;
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      ro.disconnect();
    };
  }, []);

  // Duplicate the list so the marquee can loop seamlessly.
  const loopedClients = [...MOCK_CLIENTS, ...MOCK_CLIENTS];

  return (
    <section
      id="clients"
      className="border-b border-[#3A3150] bg-[#110E18] py-20 sm:py-24"
      aria-labelledby="clients-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2
            id="clients-heading"
            className="text-3xl font-semibold leading-tight text-[#FBF7FE] sm:text-4xl"
          >
            همکاران تجاری ما
          </h2>
          <p className="mt-4 text-base leading-8 text-[#CFC6E0]">
            افتخار همکاری با مجموعه‌ای از سازمان‌ها و شرکت‌ها در صنایع مختلف.
          </p>
        </div>

        {/* Marquee viewport — overflow hidden, shows ~5 slots at a time. */}
        <div
          className="relative overflow-hidden border border-[#3A3150] rounded-lg bg-[#1E192B]"
          aria-label={`همکاران تجاری ${COMPANY_SLOGAN}`}
        >
          {/* Edge fade masks for a polished look (left/right gradients) */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#1E192B] to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#1E192B] to-transparent"
            aria-hidden="true"
          />

          {/* Scrolling track — duplicated list for seamless loop.
              Transform is driven by requestAnimationFrame (see useEffect)
              for pixel-perfect seamless looping. */}
          <div
            className="clients-track flex direction-ltr w-max-content"
            ref={trackRef}
            style={{ direction: 'ltr', width: 'max-content', willChange: 'transform' }}
          >
            {loopedClients.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="w-[200px] sm:w-[220px] lg:w-[240px] shrink-0 border-l border-[#3A3150]"
              >
                <ClientLogoCard client={client} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurClientsSection;
