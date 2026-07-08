import React from 'react';
import { getClient } from "@/lib/apollo-client-server";
import { GET_PRODUCT_BY_SLUG_QUERY } from "@/graphql/queries";
import ProductDetailsClient from "./ProductDetailsClient";
import ErrorDisplay from "@/components/ErrorDisplay";
import JsonLd from "@/components/JsonLd";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { COMPANY_NAME, COMPANY_SLOGAN, SITE_URL } from "@/constants";
import { productSchema, breadcrumbSchema } from "@/lib/seo";
import { logger } from '@/lib/logger';

export interface ProductDetails {
  __typename: 'SimpleProduct' | 'VariableProduct';
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | null;
  displayPrice: string | null;
  sku: string | null;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_HOLD' | null;
  image: { sourceUrl: string; altText: string | null; } | null;
  galleryImages: { nodes: ({ sourceUrl: string; altText: string | null; })[]; };
  productCategories: { nodes: ({ name: string; slug: string; })[]; } | null;
  /** WooCommerce product meta — used by Noskhan (MNSWMC) plugin for USD pricing. */
  metaData?: { key: string; value: string | null; }[];
}

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function extractNumericPrice(price: string | null): string | undefined {
  if (!price) return undefined;
  const cleaned = price.replace(/[^\d.]/g, '');
  return cleaned || undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await getClient().query({ query: GET_PRODUCT_BY_SLUG_QUERY, variables: { slug } });
    const product: ProductDetails | null = data?.product;
    if (!product) {
      return { title: `محصول یافت نشد | ${COMPANY_NAME}`, robots: { index: false, follow: true } };
    }
    const description = stripHtml(product.description).substring(0, 160) || `خرید ${product.name} با گارانتی و پشتیبانی تخصصی از ${COMPANY_SLOGAN}.`;
    const category = product.productCategories?.nodes?.[0];
    return {
      title: `${product.name} - قیمت و خرید`,
      description,
      keywords: [product.name, `خرید ${product.name}`, `قیمت ${product.name}`, category?.name, 'تجهیزات شبکه', COMPANY_SLOGAN].filter((k): k is string => Boolean(k)),
      alternates: { canonical: `/product/${product.slug}/` },
      openGraph: {
        title: product.name, description,
        url: `${SITE_URL}/product/${product.slug}/`, type: 'website',
        images: product.image ? [{ url: product.image.sourceUrl, alt: product.image.altText || product.name }] : [],
      },
      twitter: {
        card: 'summary_large_image', title: product.name, description,
        images: product.image ? [product.image.sourceUrl] : [],
      },
    };
  } catch (error) {
    const { slug } = await params;
    logger.error('Error generating product metadata', { slug }, error instanceof Error ? error : undefined);
    return { title: `خطا در بارگذاری | ${COMPANY_NAME}` };
  }
}

export const revalidate = 300;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { data } = await getClient().query({
      query: GET_PRODUCT_BY_SLUG_QUERY, variables: { slug },
      context: { fetchOptions: { next: { revalidate: 300 } } },
    });
    const product: ProductDetails | null = data?.product;
    if (!product) { notFound(); }
    const category = product.productCategories?.nodes?.[0];
    const description = stripHtml(product.description) || `خرید ${product.name} با گارانتی و پشتیبانی تخصصی.`;
    const numericPrice = extractNumericPrice(product.price);
    const productLd = productSchema({
      name: product.name, description, slug: product.slug,
      image: product.image?.sourceUrl, sku: product.sku ?? undefined,
      category: category?.name, price: numericPrice, currency: 'IRR', availability: product.stockStatus,
    });
    const breadcrumbLd = breadcrumbSchema([
      { name: 'خانه', url: `${SITE_URL}/` },
      { name: 'محصولات', url: `${SITE_URL}/products/` },
      ...(category ? [{ name: category.name, url: `${SITE_URL}/products/?category=${category.slug}` }] : []),
      { name: product.name, url: `${SITE_URL}/product/${product.slug}/` },
    ]);
    return (
      <>
        <JsonLd data={[productLd, breadcrumbLd]} />
        <ProductDetailsClient product={product} />
      </>
    );
  } catch (error) {
    logger.error('Error fetching product', { slug }, error instanceof Error ? error : undefined);
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message="خطا در بارگذاری اطلاعات محصول. لطفا دوباره تلاش کنید." />
      </div>
    );
  }
}
