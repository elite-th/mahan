"use client";

import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

import { ProductNode } from '@/types';

interface ProductListSectionProps {
  products: ProductNode[];
}

/**
 * ProductListSection — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - `.aurora` ambient background blobs
 *  - Faint SVG grid pattern overlay (orchid, 4% opacity)
 *  - Eyebrow "محصولات" in orchid uppercase
 *  - `text-gradient` on the H2
 *  - `.glass` pill "view more" button with `.glow-ring` + sliding arrow
 *
 * Replaced with: a left-aligned heading (no eyebrow), a plain product grid,
 * and a simple text-link "مشاهده همه محصولات →" below. Quiet, scannable.
 */
const ProductListSection: React.FC<ProductListSectionProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="border-b border-[#383150] bg-[#1a1625] py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-[#f4f1fb] sm:text-4xl">
              منتخبی از محصولات
            </h2>
            <p className="mt-3 text-sm text-[#c5bede] max-w-xl">
              نگاهی به برخی از تجهیزات برجسته. برای مشاهده لیست کامل به صفحه محصولات مراجعه کنید.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} isFeatured={true} />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a78bfa] transition-colors hover:text-[#c4b5fd]"
          >
            مشاهده همه محصولات
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductListSection;
