"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ClientLogo } from '../types';

interface ClientLogoCardProps {
  client: ClientLogo;
}

/**
 * ClientLogoCard — mock mode.
 *
 * Logos are inline SVG data URIs (from mock-data.ts). next/image with
 * `unoptimized` passes data URIs through without hitting the image optimizer.
 */
const ClientLogoCard: React.FC<ClientLogoCardProps> = ({ client }) => {
  const [imgError, setImgError] = useState(false);

  const inner = (
    <div className="flex h-28 items-center justify-center p-6">
      {imgError ? (
        <span className="text-xs text-center text-[#948cae] leading-snug">
          {client.name}
        </span>
      ) : (
        <Image
          src={client.logoUrl}
          alt={client.name || 'لوگوی همکار تجاری'}
          width={140}
          height={60}
          unoptimized
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
