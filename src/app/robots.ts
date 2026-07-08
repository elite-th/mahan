import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants';

/**
 * Dynamic robots.txt.
 * Allows crawling of public content; blocks cart, checkout, account, auth,
 * and payment routes which hold no SEO value and may leak session-specific
 * URLs into the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/cart/',
        '/checkout/',
        '/login/',
        '/register/',
        '/forgot-password/',
        '/account/',
        '/payment/',
        '/api/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
