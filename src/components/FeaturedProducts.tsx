"use client";

import React from 'react';
import { useQuery } from '@apollo/client/react/hooks';
import { GET_PRODUCTS_QUERY } from '@/graphql/queries';
import ProductListSection from '@/components/ProductListSection';
import ErrorDisplay from '@/components/ErrorDisplay';
import { ProductNode } from '@/types';

/**
 * FeaturedProducts — Client-side fetch for the homepage product grid.
 *
 * WHY CLIENT-SIDE?
 * Previously this was an async Server Component (SSR + ISR via `getClient()`).
 * In the Next.js App Router, an async Server Component without an immediately
 * available data cache blocks the *entire* page render (including HeroSection,
 * which is independent of product data). During a cache miss / dev, the user
 * landed on the page and saw the product skeleton while the hero animation
 * had not even rendered yet.
 *
 * By fetching on the client after mount:
 *  - HeroSection renders instantly on first paint.
 *  - Products load progressively with a skeleton that matches the grid layout.
 *  - Apollo cache + NextSSR hydration still hydrate server data if present.
 */
export default function FeaturedProducts() {
  const { data, loading, error } = useQuery<{ products: { nodes: ProductNode[] } }>(
    GET_PRODUCTS_QUERY,
    {
      variables: { first: 4 },
      fetchPolicy: 'cache-first',
    }
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message="خطا در بارگذاری محصولات ویژه. لطفا اتصال اینترنت خود را بررسی کنید." />
      </div>
    );
  }

  // Return empty until data is ready — no skeleton, no animation.
  if (loading) return null;

  const products = data?.products?.nodes || [];
  return <ProductListSection products={products} />;
}
