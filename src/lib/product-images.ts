import { logger } from '@/lib/logger';

/**
 * Fetch product images from WooCommerce REST API.
 *
 * WPGraphQL sometimes returns null for product images when products are
 * imported via CSV (the _thumbnail_id meta isn't set properly). The REST
 * API always returns images correctly, so we use it as a fallback.
 *
 * @returns a Map of databaseId → { sourceUrl, altText }
 */
export async function fetchProductImagesFromRest(): Promise<Map<number, { sourceUrl: string; altText: string }>> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    logger.error('product-images: WooCommerce REST credentials not configured');
    return new Map();
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';

  const imageMap = new Map<number, { sourceUrl: string; altText: string }>();
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(
        `${apiUrl}/wc/v3/products?per_page=100&page=${page}&status=publish`,
        {
          headers: { Authorization: `Basic ${auth}` },
          next: { revalidate: 300 }, // Cache 5 minutes
        }
      );

      if (!response.ok) {
        logger.error('product-images: REST API error', { status: response.status, page });
        break;
      }

      const products = (await response.json()) as Array<{
        id: number;
        images?: Array<{ src: string; alt?: string }>;
      }>;

      if (products.length === 0) {
        hasMore = false;
        break;
      }

      for (const product of products) {
        if (product.images && product.images.length > 0) {
          imageMap.set(product.id, {
            sourceUrl: product.images[0].src,
            altText: product.images[0].alt || '',
          });
        }
      }

      // Check if there are more pages
      const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1', 10);
      if (page >= totalPages) {
        hasMore = false;
      } else {
        page++;
      }
    } catch (error) {
      logger.error('product-images: fetch failed', undefined, error instanceof Error ? error : undefined);
      break;
    }
  }

  logger.info(`product-images: fetched ${imageMap.size} product images from REST API`);
  return imageMap;
}

/**
 * Enrich products with images from REST API.
 *
 * For each product that has no image (GraphQL returned null), look up
 * the image from the REST API map and attach it.
 *
 * @param products — array of product nodes from GraphQL
 * @returns the same array, with image filled in where missing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enrichProductsWithImages(products: any[], imageMap: Map<number, { sourceUrl: string; altText: string }>): any[] {
  return products.map((product) => {
    if (!product.image?.sourceUrl) {
      const restImage = imageMap.get(product.databaseId);
      if (restImage) {
        return {
          ...product,
          image: {
            sourceUrl: restImage.sourceUrl,
            altText: restImage.altText || product.name,
          },
        };
      }
    }
    return product;
  });
}
