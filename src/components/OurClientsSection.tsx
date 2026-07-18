"use client";

import React from 'react';
import ClientLogoCard from './ClientLogoCard';
import { MOCK_CLIENTS } from '@/lib/mock-data';
import { COMPANY_SLOGAN } from '../constants';

/**
 * OurClientsSection — mock mode.
 *
 * Uses mock client data with inline SVG data-URI logos. No external image
 * URLs, no WordPress dependency.
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
          {MOCK_CLIENTS.map((client) => (
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
