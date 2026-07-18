"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ClientLogo } from '../types';

interface ClientLogoCardProps {
  client: ClientLogo;
}

/**
 * ClientLogoCard — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - `.glass` card surface + `backdrop-blur`
 *  - `.glow-ring` on hover
 *  - `hover:scale-[1.04]` zoom on the logo
 *  - IntersectionObserver entrance animation (opacity/translate-y)
 *  - `index` prop + staggered `transitionDelay` (per-card entrance choreography)
 *
 * Replaced with: a plain bordered cell (the border comes from the parent
 * grid's `gap-px` on a `bg-border` wrapper, so each cell is separated by a
 * 1px line). The logo sits centered with generous padding. On hover, the
 * logo brightness shifts slightly — that's it.
 *
 * The `index` prop is removed (no longer needed). If any caller still passes
 * it, TypeScript will warn — but the parent (OurClientsSection) was updated
 * in lockstep.
 */
const ClientLogoCard: React.FC<ClientLogoCardProps> = ({ client }) => {
  const [imgError, setImgError] = useState(false);

  const inner = (
    <div className="flex h-28 items-center justify-center p-6">
      {imgError ? (
        <span className="text-xs text-center text-[#6b6680] leading-snug">
          {client.name}
        </span>
      ) : (
        <Image
          src={client.logoUrl}
          alt={client.name || 'لوگوی همکار تجاری'}
          width={140}
          height={60}
          className="max-h-14 max-w-full object-contain opacity-60 transition-opacity duration-200 hover:opacity-100"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );

  return (
    <>
      {client.websiteUrl && client.websiteUrl !== '#' ? (
        <a
          href={client.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`وب‌سایت ${client.name}`}
          className="block"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </>
  );
};

export default React.memo(ClientLogoCard);
