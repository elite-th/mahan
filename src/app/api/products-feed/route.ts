export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getClient } from '@/lib/apollo-client-server';
import { GET_PRODUCTS_QUERY } from '@/graphql/queries';
import { fetchProductImagesFromRest, enrichProductsWithImages } from '@/lib/product-images';
import { ProductNode } from '@/types';

/**
 * GET /api/products-feed
 *
 * Returns products enriched with images from REST API.
 * Used by client-side components (FeaturedProducts) that can't
 * call the server-side enrichment directly.
 *
 * Query params:
 *   - limit: number of products (default: 1000)
 */
export const revalidate = 300; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1000', 10);

    // 1. Fetch products from GraphQL (price, stock, meta)
    const { data } = await getClient().query({
      query: GET_PRODUCTS_QUERY,
      variables: { first: limit },
      context: { fetchOptions: { next: { revalidate: 300 } } },
    });

    let products: ProductNode[] = data?.products?.nodes || [];

    // 2. Fetch image map from REST API (fallback for missing images)
    const imageMap = await fetchProductImagesFromRest();

    // 3. Enrich products with REST images
    products = enrichProductsWithImages(products, imageMap) as ProductNode[];

    return NextResponse.json({ products }, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('products-feed error:', error);
    return NextResponse.json(
      { products: [], error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
