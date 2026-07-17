import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductCard from './ProductCard';

import { ProductNode } from '@/types';

interface ProductListSectionProps {
  products: ProductNode[];
}

const ProductListSection: React.FC<ProductListSectionProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="relative py-16 sm:py-24 bg-[#0c0418] aurora overflow-hidden">
      {/* Subtle geometric SVG pattern overlay for depth (non-interactive) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="mahan-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#c084fc"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mahan-grid)" />
      </svg>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading block */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#e879f9] mb-4">
            محصولات
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gradient mb-5 leading-tight">
            منتخبی از محصولات ما
          </h2>
          <p className="text-base sm:text-lg text-purple-100/60 max-w-2xl mx-auto leading-relaxed">
            نگاهی گذرا به برخی از تجهیزات و راهکارهای برجسته ما. برای مشاهده لیست کامل کلیک کنید.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} isFeatured={true} />
          ))}
        </div>

        {/* "View More" — glass pill button with gradient text + sliding arrow */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full glass text-base font-bold transition-all duration-300 hover:glow-ring"
          >
            <span className="text-gradient">مشاهده بیشتر</span>
            <ArrowLeft
              className="w-5 h-5 text-[#c084fc] transition-transform duration-300 group-hover:-translate-x-1.5"
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductListSection;
