import React from 'react';
import ProductGrid from "./ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { COMPANY_SLOGAN, SITE_URL } from "@/constants";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `محصولات و تجهیزات شبکه | ${COMPANY_SLOGAN}`,
  description: `کاتالوگ کامل تجهیزات شبکه ماهان ارتباطات خردمنده؛ سوئیچ سیسکو، روتر، تجهیزات دیتاسنتر و سرور با گارانتی و قیمت رقابتی. خرید آنلاین با مشاوره تخصصی.`,
  keywords: ['خرید تجهیزات شبکه', 'سوئیچ سیسکو', 'روتر سیسکو', 'تجهیزات دیتاسنتر', 'سرور', 'کاتالوگ محصولات شبکه', COMPANY_SLOGAN],
  alternates: { canonical: '/products/' },
  openGraph: {
    title: `محصولات و تجهیزات شبکه | ${COMPANY_SLOGAN}`,
    description: `کاتالوگ کامل تجهیزات شبکه؛ سوئیچ سیسکو، روتر و تجهیزات دیتاسنتر با گارانتی.`,
    url: `${SITE_URL}/products/`, type: 'website',
  },
};

/**
 * ProductsPage — mock mode.
 *
 * Uses static mock data instead of an Apollo server query. No backend
 * connection required.
 */
export default function ProductsPage() {
  const products = MOCK_PRODUCTS;

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-[#f4f1fb] sm:text-4xl">
            کاتالوگ محصولات
          </h1>
          <p className="mt-3 text-sm text-[#c5bede] max-w-2xl">
            جدیدترین تجهیزات شبکه و راهکارهای فناوری اطلاعات را اینجا بیابید.
          </p>
        </div>
        <ProductGrid allProducts={products} />
      </div>
    </section>
  );
}
