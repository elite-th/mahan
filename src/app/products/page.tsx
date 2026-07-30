import React from 'react';
import ProductGrid from "./ProductGrid";
import { getAllProducts } from "@/lib/products";
import { COMPANY_SLOGAN, SITE_URL } from "@/constants";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `محصولات و تجهیزات شبکه | ${COMPANY_SLOGAN}`,
  description: `کاتالوگ کامل تجهیزات شبکه ماهان ارتباطات خردمند؛ سوئیچ سیسکو، روتر، تجهیزات دیتاسنتر و سرور با گارانتی و قیمت رقابتی. خرید آنلاین با مشاوره تخصصی.`,
  keywords: ['خرید تجهیزات شبکه', 'سوئیچ سیسکو', 'روتر سیسکو', 'تجهیزات دیتاسنتر', 'سرور', 'کاتالوگ محصولات شبکه', COMPANY_SLOGAN],
  alternates: { canonical: '/products/' },
  openGraph: {
    title: `محصولات و تجهیزات شبکه | ${COMPANY_SLOGAN}`,
    description: `کاتالوگ کامل تجهیزات شبکه؛ سوئیچ سیسکو، روتر و تجهیزات دیتاسنتر با گارانتی.`,
    url: `${SITE_URL}/products/`, type: 'website',
  },
};

/**
 * ProductsPage — real backend (GraphQL + REST image enrichment).
 *
 * Fetches products from WPGraphQL, enriches images from WooCommerce REST,
 * and renders the catalog. Catalog-only mode: no cart, no auth, no payment.
 */
export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-[var(--text)] sm:text-4xl">
            کاتالوگ محصولات
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)] max-w-2xl">
            جدیدترین تجهیزات شبکه و راهکارهای فناوری اطلاعات را اینجا بیابید.
          </p>
        </div>
        {products.length === 0 ? (
          <p className="text-[var(--text-muted)]">در حال حاضر محصولی برای نمایش وجود ندارد.</p>
        ) : (
          <ProductGrid allProducts={products} />
        )}
      </div>
    </section>
  );
}
