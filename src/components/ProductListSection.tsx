import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

import { ProductNode } from '@/types';

interface ProductListSectionProps {
  products: ProductNode[];
}

const ProductListSection: React.FC<ProductListSectionProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="py-16 sm:py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-sky-400 mb-4">
            منتخبی از محصولات ما
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            نگاهی گذرا به برخی از تجهیزات و راهکارهای برجسته ما. برای مشاهده لیست کامل کلیک کنید.
          </p>
        </div>

        {/* Responsive Grid Layout for all screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} isFeatured={true} />
          ))}
        </div>

        {/* "View More" Link */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block px-8 py-3 border-2 border-sky-600 text-sky-400 font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-sky-600 hover:text-white hover:shadow-lg hover:shadow-lg"
          >
            مشاهده بیشتر
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductListSection;