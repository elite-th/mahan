"use client";

import React, { useState, useEffect } from 'react';
import ProductListSection from '@/components/ProductListSection';
import ErrorDisplay from '@/components/ErrorDisplay';
import { ProductNode } from '@/types';

/**
 * FeaturedProducts — Client-side fetch for the homepage product grid.
 *
 * Fetches products from /api/products-feed which:
 * 1. Gets products from GraphQL (price, stock, meta)
 * 2. Enriches with images from REST API (fallback for CSV-imported products
 *    where GraphQL returns image: null)
 */
export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/products-feed?limit=4')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message="خطا در بارگذاری محصولات ویژه. لطفا اتصال اینترنت خود را بررسی کنید." />
      </div>
    );
  }

  if (loading) return null;

  return <ProductListSection products={products} />;
}
