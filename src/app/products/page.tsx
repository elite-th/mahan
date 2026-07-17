import React from 'react';
import { getClient } from "@/lib/apollo-client-server";
import { GET_PRODUCTS_QUERY } from "@/graphql/queries";
import ProductGrid from "./ProductGrid";
import ErrorDisplay from "@/components/ErrorDisplay";
import { COMPANY_SLOGAN, SITE_URL } from "@/constants";
import type { Metadata } from 'next';
import { ProductNode } from "@/types";
import { logger } from '@/lib/logger';
import { fetchProductImagesFromRest, enrichProductsWithImages } from '@/lib/product-images';

// ISR: Revalidate every 5 minutes instead of re-rendering on every request
export const revalidate = 300;

// ProductNode imported from types

export const metadata: Metadata = {
  title: `محصولات و تجهیزات شبکه | ${COMPANY_SLOGAN}`,
  description: `کاتالوگ کامل تجهیزات شبکه ویرا شبکه آران؛ سوئیچ سیسکو، روتر، تجهیزات دیتاسنتر و سرور با گارانتی و قیمت رقابتی. خرید آنلاین با مشاوره تخصصی.`,
  keywords: ['خرید تجهیزات شبکه', 'سوئیچ سیسکو', 'روتر سیسکو', 'تجهیزات دیتاسنتر', 'سرور', 'کاتالوگ محصولات شبکه', COMPANY_SLOGAN],
  alternates: { canonical: '/products/' },
  openGraph: {
    title: `محصولات و تجهیزات شبکه | ${COMPANY_SLOGAN}`,
    description: `کاتالوگ کامل تجهیزات شبکه؛ سوئیچ سیسکو، روتر و تجهیزات دیتاسنتر با گارانتی.`,
    url: `${SITE_URL}/products/`, type: 'website',
  },
};

export default async function ProductsPage() {
  try {
    const { data } = await getClient().query({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 1000 },
    });

    let products: ProductNode[] = data?.products?.nodes || [];

    // Enrich with REST API images (fallback for CSV-imported products)
    const imageMap = await fetchProductImagesFromRest();
    products = enrichProductsWithImages(products, imageMap) as ProductNode[];

    return (
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-400 mb-4">
              کاتالوگ محصولات
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              جدیدترین تجهیزات شبکه و راهکارهای فناوری اطلاعات را اینجا بیابید.
            </p>
          </div>
          <ProductGrid allProducts={products} />
        </div>
      </section>
    );
  } catch (error) {
    logger.error('Error fetching products for products page', undefined, error instanceof Error ? error : undefined);
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message="خطا در بارگذاری لیست محصولات. لطفا بعدا تلاش کنید." />
      </div>
    );
  }
}