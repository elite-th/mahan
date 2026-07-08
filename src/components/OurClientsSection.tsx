import React from 'react';
import ClientLogoCard from './ClientLogoCard';
import { ClientLogo } from '../types';

const WP_UPLOADS = 'https://wordpress.vna-co.ir/wp-content/uploads/2026/06';

// Client display names are used as image alt text for accessibility & SEO.
// Replace these with the real organization names once they are confirmed.
const clientsData: ClientLogo[] = [
  { id: 'client-1', name: 'مشتری ۱ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture1.png` },
  { id: 'client-2', name: 'مشتری ۲ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture2.jpg` },
  { id: 'client-3', name: 'مشتری ۳ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture3.png` },
  { id: 'client-4', name: 'مشتری ۴ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture4.png` },
  { id: 'client-5', name: 'مشتری ۵ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture5.jpg` },
  { id: 'client-6', name: 'مشتری ۶ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture6.png` },
  { id: 'client-7', name: 'مشتری ۷ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture7.png` },
  { id: 'client-8', name: 'مشتری ۸ - همکار تجاری ویرا شبکه آران', logoUrl: `${WP_UPLOADS}/Picture8.png` },
];

const OurClientsSection: React.FC = () => {
  return (
    <section id="clients" className="py-16 sm:py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-sky-400 mb-4">
            مشتریان و همکاران ما
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            افتخار همکاری با مجموعه‌ای از برترین سازمان‌ها و شرکت‌ها در صنایع مختلف.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {clientsData.map((client, index) => (
            <ClientLogoCard key={client.id} client={client} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurClientsSection;
