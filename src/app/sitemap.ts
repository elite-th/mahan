import type { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { SITE_URL } from '@/constants';

/**
 * Static + mock-product sitemap.
 *
 * Mock mode: product URLs come from MOCK_PRODUCTS instead of a GraphQL
 * query. No backend connection required.
 */
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/products/`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const productRoutes: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}/`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
