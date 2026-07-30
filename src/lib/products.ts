/**
 * Product data access layer — real WooCommerce/GraphQL backend.
 *
 * Fetches products from WPGraphQL and enriches them with images from the
 * WooCommerce REST API (GraphQL returns null images for CSV-imported products).
 *
 * Catalog-only mode: read-only GET requests, no mutations, no cart, no auth.
 */

import { getClient } from '@/lib/apollo-client-server';
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_SLUG_QUERY } from '@/graphql/queries';
import { fetchProductImagesFromRest, enrichProductsWithImages } from '@/lib/product-images';
import { logger } from '@/lib/logger';
import type { ProductNode } from '@/types';

/**
 * Fetch all products from GraphQL + enrich with REST images.
 *
 * Apollo returns frozen objects, so we shallow-copy each product node before
 * enriching (per the prompt's Apollo note).
 */
export async function getAllProducts(): Promise<ProductNode[]> {
  try {
    const { data } = await getClient().query({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 1000 },
      context: { fetchOptions: { next: { revalidate: 300 } } },
    });

    const rawProducts: ProductNode[] = data?.products?.nodes ?? [];
    if (rawProducts.length === 0) {
      logger.warn('products: GraphQL returned 0 products');
      return [];
    }

    // Shallow-copy each node (Apollo objects are frozen) before enriching.
    const mutable = rawProducts.map((p) => ({ ...p }));
    const imageMap = await fetchProductImagesFromRest();
    const enriched = enrichProductsWithImages(mutable as unknown as Record<string, unknown>[], imageMap) as unknown as ProductNode[];

    logger.info(`products: fetched ${enriched.length} products (${imageMap.size} images from REST)`);
    return enriched;
  } catch (error) {
    logger.error('products: getAllProducts failed', undefined, error instanceof Error ? error : undefined);
    return [];
  }
}

/**
 * Fetch featured products (first N by databaseId order).
 */
export async function getFeaturedProducts(count: number = 4): Promise<ProductNode[]> {
  const all = await getAllProducts();
  return all.slice(0, count);
}

/**
 * Fetch a single product by slug from GraphQL + enrich with REST image.
 */
export async function getProductBySlug(slug: string): Promise<ProductNode | null> {
  try {
    const { data } = await getClient().query({
      query: GET_PRODUCT_BY_SLUG_QUERY,
      variables: { slug },
      context: { fetchOptions: { next: { revalidate: 300 } } },
    });

    const raw: ProductNode | null = data?.product ?? null;
    if (!raw) {
      logger.warn(`products: product not found for slug "${slug}"`);
      return null;
    }

    // Shallow-copy (Apollo frozen) + enrich image if missing.
    const mutable = { ...raw };
    if (!mutable.image?.sourceUrl) {
      const imageMap = await fetchProductImagesFromRest();
      const enriched = enrichProductsWithImages([mutable as unknown as Record<string, unknown>], imageMap) as unknown as ProductNode[];
      return enriched[0] ?? mutable;
    }
    return mutable;
  } catch (error) {
    logger.error(`products: getProductBySlug failed for "${slug}"`, undefined, error instanceof Error ? error : undefined);
    return null;
  }
}

/**
 * Fetch all product categories (derived from products list).
 */
export async function getAllCategories(): Promise<{ name: string; slug: string }[]> {
  const products = await getAllProducts();
  const seen = new Map<string, { name: string; slug: string }>();
  for (const p of products) {
    for (const cat of p.productCategories?.nodes ?? []) {
      if (!seen.has(cat.slug)) seen.set(cat.slug, cat);
    }
  }
  return Array.from(seen.values());
}
