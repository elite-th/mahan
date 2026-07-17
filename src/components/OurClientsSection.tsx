"use client";

import React from 'react';
import ClientLogoCard from './ClientLogoCard';
import { ClientLogo } from '../types';
import { COMPANY_SLOGAN } from '../constants';

const WP_UPLOADS = 'https://wordpress.mahan-ic.ir/wp-content/uploads/2026/06';

// Client display names are used as image alt text for accessibility & SEO.
// Replace these with the real organization names once they are confirmed.
const clientsData: ClientLogo[] = [
  { id: 'client-1', name: 'مشتری ۱ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture1.png` },
  { id: 'client-2', name: 'مشتری ۲ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture2.jpg` },
  { id: 'client-3', name: 'مشتری ۳ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture3.png` },
  { id: 'client-4', name: 'مشتری ۴ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture4.png` },
  { id: 'client-5', name: 'مشتری ۵ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture5.jpg` },
  { id: 'client-6', name: 'مشتری ۶ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture6.png` },
  { id: 'client-7', name: 'مشتری ۷ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture7.png` },
  { id: 'client-8', name: 'مشتری ۸ - همکار تجاری ماهان ارتباطات خردمنده', logoUrl: `${WP_UPLOADS}/Picture8.png` },
];

const OurClientsSection: React.FC = () => {
  // Duplicate the list so the marquee loop is seamless — when the track has
  // moved 50% of its own width (= exactly one full set), the second copy is
  // in the same position the first copy started in, so the animation can
  // jump back to 0 with no visible glitch. The CSS keyframe `marquee-rtl`
  // in globals.css does exactly this (0% → translateX(50%)).
  const marqueeItems = [...clientsData, ...clientsData];

  return (
    <section
      id="clients"
      className="relative overflow-hidden bg-[#160826] py-20 sm:py-24 lg:py-28"
      aria-labelledby="clients-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading block */}
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#e879f9] sm:text-sm">
            مشتریان ما
          </span>
          <h2
            id="clients-heading"
            className="text-gradient mb-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
          >
            همکاران تجاری ما
          </h2>
          <p className="text-base leading-loose text-purple-100/70 sm:text-lg">
            افتخار همکاری با مجموعه‌ای از برترین سازمان‌ها و شرکت‌ها در صنایع
            مختلف.
          </p>
        </div>
      </div>

      {/* Full-bleed marquee strip — sits outside the container so logos scroll
          edge-to-edge across the viewport. Gradient fade masks on both sides
          blend the logos in/out against the section background. */}
      <div className="relative w-full">
        {/* Left fade mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 lg:w-40
                     bg-gradient-to-l from-[#160826] to-transparent"
        />
        {/* Right fade mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 lg:w-40
                     bg-gradient-to-r from-[#160826] to-transparent"
        />

        <div
          className="overflow-hidden"
          role="region"
          aria-label={`نوار همکاران تجاری ${COMPANY_SLOGAN}`}
        >
          {/* The marquee-track CSS class lives in globals.css and applies
              `animation: marquee-rtl 40s linear infinite;` with
              `:hover { animation-play-state: paused; }`.

              Spacing is applied per-item via `me-*` (margin-inline-end)
              rather than flex `gap`. With `gap`, the trailing gap before
              the duplicated set introduces a 0.5×gap misalignment when the
              keyframe resets from translateX(50%) → translateX(0), causing
              a visible jump every loop. Per-item margin keeps the spacing
              uniform across the loop boundary → seamless. */}
          <ul className="marquee-track py-2">
            {marqueeItems.map((client, index) => (
              <li
                key={`${client.id}-dup-${index}`}
                className="me-4 shrink-0 sm:me-6"
                aria-label={client.name}
              >
                <ClientLogoCard client={client} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OurClientsSection;
