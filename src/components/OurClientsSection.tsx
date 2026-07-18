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

/**
 * OurClientsSection — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - Infinite marquee scroll (`.marquee-track`) — a flashy effect that
 *    prioritizes motion over legibility. Logos whipping by are hard to read.
 *  - Gradient fade masks on both edges (`bg-gradient-to-r from-bg to-transparent`)
 *  - Eyebrow label "مشتریان ما" in orchid uppercase tracking
 *  - `text-gradient` on the H2
 *
 * Replaced with: a static, evenly-spaced grid of client logos on a solid
 * background. Each logo sits in a bordered cell. No animation, no masks.
 * Logos are readable and scannable — which is the entire point of a
 * "our clients" section.
 */
const OurClientsSection: React.FC = () => {
  return (
    <section
      id="clients"
      className="border-b border-[#262430] bg-[#0b0a0f] py-20 sm:py-24"
      aria-labelledby="clients-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2
            id="clients-heading"
            className="text-3xl font-semibold leading-tight text-[#ece9f2] sm:text-4xl"
          >
            همکاران تجاری ما
          </h2>
          <p className="mt-4 text-base leading-8 text-[#a8a3b8]">
            افتخار همکاری با مجموعه‌ای از سازمان‌ها و شرکت‌ها در صنایع مختلف.
          </p>
        </div>

        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#262430] border border-[#262430] rounded-lg overflow-hidden"
          role="list"
          aria-label={`همکاران تجاری ${COMPANY_SLOGAN}`}
        >
          {clientsData.map((client) => (
            <li key={client.id} className="bg-[#0b0a0f]">
              <ClientLogoCard client={client} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default OurClientsSection;
