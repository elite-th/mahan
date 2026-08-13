"use client";

import React from 'react';
import Image from 'next/image';
import { ClientLogo } from '../types';

interface ClientLogoCardProps {
  client: ClientLogo;
}

/**
 * ClientLogoCard — displays a client logo image, or a text monogram
 * (first letter of the company name) for clients without a logo image.
 *
 * Clients with a logoUrl show the image via next/image (unoptimized pass-through).
 * Clients without a logoUrl (empty string) show a styled monogram chip.
 */
const ClientLogoCard: React.FC<ClientLogoCardProps> = ({ client }) => {
  const hasLogo = Boolean(client.logoUrl);

  // Build a monogram from the first letter of the company name.
  const monogram = client.name?.trim()?.charAt(0) || '؟';

  const inner = (
    <div className="flex h-28 items-center justify-center p-6">
      {hasLogo ? (
        <ImageWithFallback
          src={client.logoUrl}
          alt={client.name || 'لوگوی همکار تجاری'}
          name={client.name}
        />
      ) : (
        // Text monogram fallback — for clients without a logo image.
        <div className="flex flex-col items-center gap-2">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-lg font-bold text-[var(--accent)]"
            aria-hidden="true"
          >
            {monogram}
          </span>
          <span className="text-xs text-center text-[var(--text-muted)] leading-snug max-w-[120px]">
            {client.name}
          </span>
        </div>
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

/**
 * Image component with onError fallback to the text monogram.
 * If the image fails to load, we show the monogram instead of a broken image.
 */
const ImageWithFallback: React.FC<{ src: string; alt: string; name: string }> = ({ src, alt, name }) => {
  const [errored, setErrored] = React.useState(false);

  if (errored) {
    const monogram = name?.trim()?.charAt(0) || '؟';
    return (
      <div className="flex flex-col items-center gap-2">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-lg font-bold text-[var(--accent)]"
          aria-hidden="true"
        >
          {monogram}
        </span>
        <span className="text-xs text-center text-[var(--text-muted)] leading-snug max-w-[120px]">
          {name}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={140}
      height={60}
      unoptimized
      className="max-h-14 max-w-full object-contain opacity-60 transition-opacity duration-200 hover:opacity-100"
      onError={() => setErrored(true)}
    />
  );
};

export default React.memo(ClientLogoCard);
