/**
 * Centralized SEO data — single source of truth for structured data,
 * metadata, and rich-snippet content across the MAHAN site.
 *
 * Keeping this server-side (no "use client") lets us emit JSON-LD
 * structured data from Server Components for Google rich results,
 * while still sharing the same data with client components.
 */

import { SITE_URL, COMPANY_NAME, COMPANY_SLOGAN } from '@/constants';

// ---------------------------------------------------------------------------
// Contact & business info
// ---------------------------------------------------------------------------

export const CONTACT = {
  phoneSales: '09386473626',
  phoneSupport: '09104491267',
  email: 'info@mahan-ic.ir',
  addressCountry: 'IR',
  addressRegion: 'تهران',
  addressLocality: 'شمیرانات، تجریش',
  streetAddress: 'محله ازگل، گلچین جنوبی، کوچه لاله، پلاک ۳',
  /** Approximate geo coordinates of the Tajrish / Asgel area, northern Tehran. */
  geo: { latitude: 35.8059, longitude: 51.4361 },
} as const;

/** Working hours: Saturday–Thursday, 08:00–16:00 Asia/Tehran. */
export const OPENING_HOURS = [
  {
    days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '08:00',
    closes: '16:00',
  },
] as const;

/** Social / external profiles for Organization `sameAs`. */
export const SOCIAL_LINKS: string[] = [
  // Add real social profile URLs here when available (Instagram, LinkedIn, etc.)
];

// ---------------------------------------------------------------------------
// FAQ — shared by FaqSection (client) and FAQPage JSON-LD (server)
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'ماهان از چه سالی شرکت شروع به کار کرده است؟',
    answer:
      'ماهان ارتباطات خردمنده از سال 1400 فعالیت خود را شروع کرده است.',
  },
  {
    question: 'از چه زمانی فروشگاه اینترنتی ماهان راه اندازی شده است؟',
    answer:
      'ماهان، از همان ابتدا آغاز به کار فعالیت خود، درکنار فروش عمده، به صورت فروشگاه آنلاین نیز فعالیت خود را ادامه داده است.',
  },
  {
    question: 'آیا اینماد و کد مالیاتی دارید؟',
    answer:
      'بله اینماد و کد مالیاتی برای دریافت درگاه پرداخت مستقیم ضروری است و ما هر دو را دریافت کرده ایم.',
  },
  {
    question: 'امکان شارژ مجدد محصولات پس از خرید وجود دارد؟',
    answer: 'بله در صورت موجود بودن محصولات شارژ میگردد.',
  },
  {
    question: 'آدرس ماهان ارتباطات کجاست؟',
    answer:
      'استان تهران - شهرستان شمیرانات - بخش مرکزی - شهر تجریش - محله ازگل - خیابان گلچین جنوبی - کوچه لاله - پلاک ۳',
  },
  {
    question: 'ساعات پاسخگویی مجموعه به چه صورت میباشد؟',
    answer:
      'ما از شنبه تا پنج شنبه 8 الی 16 در خدمت شما به صورت آنلاین و تلفنی هستیم.',
  },
  {
    question: 'شماره تماس ماهان؟',
    answer: 'شماره فروش: 09386473626 | شماره پشتیبانی: 09104491267',
  },
];

// ---------------------------------------------------------------------------
// Structured-data builders (schema.org JSON-LD)
// ---------------------------------------------------------------------------

/** Organization + LocalBusiness schema (rich results for name, logo, address, hours). */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'ElectronicsStore'],
  '@id': `${SITE_URL}/#organization`,
  name: COMPANY_SLOGAN,
  alternateName: COMPANY_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  telephone: [CONTACT.phoneSales, CONTACT.phoneSupport],
  address: {
    '@type': 'PostalAddress',
    addressCountry: CONTACT.addressCountry,
    addressRegion: CONTACT.addressRegion,
    addressLocality: CONTACT.addressLocality,
    streetAddress: CONTACT.streetAddress,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: CONTACT.geo.latitude,
    longitude: CONTACT.geo.longitude,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: CONTACT.phoneSales,
      contactType: 'sales',
      areaServed: 'IR',
      availableLanguage: ['Persian'],
    },
    {
      '@type': 'ContactPoint',
      telephone: CONTACT.phoneSupport,
      contactType: 'customer support',
      areaServed: 'IR',
      availableLanguage: ['Persian'],
    },
  ],
  openingHoursSpecification: OPENING_HOURS.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  priceRange: '$$',
  ...(SOCIAL_LINKS.length > 0 ? { sameAs: SOCIAL_LINKS } : {}),
} as const;

/** WebSite schema with SearchAction — enables Google sitelinks search box. */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: COMPANY_SLOGAN,
  alternateName: COMPANY_NAME,
  inLanguage: 'fa-IR',
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
} as const;

/** FAQPage schema — enables FAQ rich results on Google. */
export function faqSchema(items: FaqItem[] = FAQ_ITEMS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** BreadcrumbList schema — enables breadcrumb rich results. */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Product schema — enables product / offer rich results. */
export function productSchema(opts: {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  sku?: string;
  category?: string;
  price?: string; // numeric string e.g. "12500000"
  currency?: string;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_HOLD' | null;
}) {
  const availabilityMap: Record<string, string> = {
    IN_STOCK: 'https://schema.org/InStock',
    OUT_OF_STOCK: 'https://schema.org/OutOfStock',
    ON_HOLD: 'https://schema.org/PreOrder',
  };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    url: `${SITE_URL}/product/${opts.slug}/`,
  };

  if (opts.description) schema.description = opts.description;
  if (opts.sku) schema.sku = opts.sku;
  if (opts.category) {
    schema.category = { '@type': 'Thing', name: opts.category };
  }
  if (opts.image) {
    schema.image = opts.image;
  }

  // Offers — only emit when we have a usable numeric price
  if (opts.price && opts.price !== '0' && opts.availability) {
    schema.offers = {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${opts.slug}/`,
      price: opts.price,
      priceCurrency: opts.currency ?? 'IRR',
      availability: availabilityMap[opts.availability] ?? 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#organization` },
    };
  }

  return schema;
}

/** Service schema — for the solutions / services page. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'ایران' },
  };
}
