import React from 'react';
import ProductListSection from '@/components/ProductListSection';
import { getFeaturedProducts } from '@/lib/products';

/**
 * FeaturedProducts — real backend (GraphQL + REST image enrichment).
 *
 * Server component: fetches featured products from WPGraphQL (enriched with
 * REST images) and passes them to the client ProductListSection for display.
 */
export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);
  return <ProductListSection products={products} />;
}
