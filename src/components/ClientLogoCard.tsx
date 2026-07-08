"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ClientLogo } from '../types';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ClientLogoCardProps {
  client: ClientLogo;
  index: number;
}

const ClientLogoCard: React.FC<ClientLogoCardProps> = ({ client, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1, triggerOnce: true });
  const [imgError, setImgError] = useState(false);

  const cardContent = (
    <div
      className={`
        bg-gray-800 p-6 rounded-xl shadow-lg 
        flex items-center justify-center h-32 sm:h-36
        transform transition-all duration-500 ease-out group
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {imgError ? (
        <div className="max-h-16 sm:max-h-20 max-w-full flex items-center justify-center bg-gray-700 rounded px-3 py-2">
          <span className="text-gray-400 text-xs text-center">{client.name}</span>
        </div>
      ) : (
        <Image
          src={client.logoUrl}
          alt={client.name || 'لوگوی مشتری ویرا شبکه آران'}
          width={160}
          height={80}
          className="max-h-16 sm:max-h-20 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );

  return (
    <div ref={cardRef}>
      {client.websiteUrl && client.websiteUrl !== '#' ? (
        <a
          href={client.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`وب‌سایت ${client.name}`}
          className="block hover:shadow-lg hover:shadow-lg rounded-xl transition-shadow duration-300"
        >
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default React.memo(ClientLogoCard);