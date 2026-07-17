import type { MetadataRoute } from 'next';
import { getClient } from '@/lib/apollo-client-server';
import { GET_PRODUCTS_QUERY } from '@/graphql/queries';
import { SITE_URL } from '@/constants';

/**
 * Dynamic sitemap — enumerates static routes plus every product page.
 * trailingSlash is true in next.config.js, so all paths end with '/'.
 * ISR: revalidate every hour so new products appear without a redeploy.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/products/`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/solutions/`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Dynamic product pages — best-effort; on failure we still serve static routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data } = await getClient().query({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 1000 },
    });

    const slugs: string[] = (data?.products?.nodes ?? [])
      .map((n: { slug?: string }) => n.slug)
      .filter((s: string | undefined): s is string => Boolean(s));

    productRoutes = slugs.map(slug => ({
      url: `${SITE_URL}/product/${slug}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // GraphQL fetch failed — static routes are still returned below.
  }

  return [...staticRoutes, ...productRoutes];
}
