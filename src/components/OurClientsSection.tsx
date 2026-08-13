"use client";

import React from 'react';
import ClientLogoCard from './ClientLogoCard';
import { MOCK_CLIENTS } from '@/lib/mock-data';
import { COMPANY_SLOGAN } from '../constants';

/**
 * OurClientsSection — infinite marquee carousel.
 *
 * Shows 5 client slots at a time on desktop (2 on mobile, 3 on tablet).
 * The full client list is duplicated (rendered twice) to create a seamless
 * infinite scroll loop. The animation pauses on hover for readability.
 *
 * Clients are ordered by fame (most well-known first) in mock-data.ts.
 *
 * Respects prefers-reduced-motion: animation stops, shows a static row.
 */
const OurClientsSection: React.FC = () => {
  // Duplicate the list so the marquee can loop seamlessly (translateX -50%
  // = exactly one full set).
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

        {/* Marquee viewport — overflow hidden, shows 5 slots on desktop.
            The inner .clients-track scrolls infinitely (defined in globals.css). */}
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

          {/* Scrolling track — duplicated list for seamless loop */}
          <div className="clients-track">
            {loopedClients.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="w-[200px] sm:w-[220px] lg:w-[240px] shrink-0 border-l border-[#3A3150] first:border-l-0"
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
