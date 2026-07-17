"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ClientLogo } from '../types';

interface ClientLogoCardProps {
  client: ClientLogo;
}

/**
 * ClientLogoCard — a single logo card used inside the OurClients marquee.
 *
 * Simplified (Task 5-C): the marquee is always visible, so the previous
 * IntersectionObserver-driven fade-in is no longer needed. The card is now
 * a plain `.glass` rounded card with a fixed marquee slot size
 * (h-24 w-40) and an image error fallback. React.memo kept so duplicating
 * the list for the seamless marquee loop doesn't trigger re-renders.
 */
const ClientLogoCard: React.FC<ClientLogoCardProps> = ({ client }) => {
  const [imgError, setImgError] = useState(false);

  const cardContent = (
    <div
      className="glass flex h-24 w-40 items-center justify-center rounded-2xl px-4
                 transition-transform duration-300 hover:scale-[1.04] hover:glow-ring"
    >
      {imgError ? (
        <div className="flex max-h-16 max-w-full items-center justify-center rounded-lg bg-[#2a1450]/60 px-3 py-2 text-center">
          <span className="text-[10px] leading-tight text-purple-200/70">
            {client.name}
          </span>
        </div>
      ) : (
        <Image
          src={client.logoUrl}
          alt={client.name || 'لوگوی مشتری ماهان ارتباطات خردمنده'}
          width={160}
          height={64}
          className="max-h-16 max-w-full object-contain"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );

  if (client.websiteUrl && client.websiteUrl !== '#') {
    return (
      <a
        href={client.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`وب‌سایت ${client.name}`}
        className="block rounded-2xl outline-none"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default React.memo(ClientLogoCard);
