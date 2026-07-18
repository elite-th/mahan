"use client";

import React from 'react';
import ProductListSection from '@/components/ProductListSection';
import { getFeaturedProducts } from '@/lib/mock-data';

/**
 * FeaturedProducts — mock mode.
 *
 * Uses static mock data instead of an Apollo GraphQL query. No backend
 * connection required.
 */
export default function FeaturedProducts() {
  const products = getFeaturedProducts(4);
  return <ProductListSection products={products} />;
}
