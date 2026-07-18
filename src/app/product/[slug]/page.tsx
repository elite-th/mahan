import React from 'react';
import ProductDetailsClient from "./ProductDetailsClient";
import JsonLd from "@/components/JsonLd";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { COMPANY_NAME, COMPANY_SLOGAN, SITE_URL } from "@/constants";
import { productSchema, breadcrumbSchema } from "@/lib/seo";
import { getMockProductBySlug } from "@/lib/mock-data";

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
  const product = getMockProductBySlug(slug);
  if (!product) {
    return { title: `محصول یافت نشد | ${COMPANY_NAME}`, robots: { index: false, follow: true } };
  }
  const description = stripHtml(product.description ?? null).substring(0, 160) || `خرید ${product.name} با گارانتی و پشتیبانی تخصصی از ${COMPANY_SLOGAN}.`;
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
  };
}

/**
 * ProductPage — mock mode.
 *
 * Looks up the product in the mock data by slug. No Apollo/GraphQL query.
 */
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);
  if (!product) { notFound(); }

  // Adapt ProductNode → ProductDetails shape expected by ProductDetailsClient
  const details: ProductDetails = {
    __typename: product.__typename,
    id: product.id,
    databaseId: product.databaseId,
    name: product.name,
    slug: product.slug,
    description: product.description ?? null,
    price: product.price ?? null,
    displayPrice: product.displayPrice ?? null,
    sku: product.sku ?? null,
    stockStatus: product.stockStatus ?? null,
    image: product.image ? { sourceUrl: product.image.sourceUrl, altText: product.image.altText ?? null } : null,
    galleryImages: { nodes: [] },
    productCategories: product.productCategories ?? null,
    metaData: product.metaData,
  };

  const category = details.productCategories?.nodes?.[0];
  const description = stripHtml(details.description) || `خرید ${details.name} با گارانتی و پشتیبانی تخصصی.`;
  const numericPrice = extractNumericPrice(details.price);
  const productLd = productSchema({
    name: details.name, description, slug: details.slug,
    image: details.image?.sourceUrl, sku: details.sku ?? undefined,
    category: category?.name, price: numericPrice, currency: 'IRR', availability: details.stockStatus,
  });
  const breadcrumbLd = breadcrumbSchema([
    { name: 'خانه', url: `${SITE_URL}/` },
    { name: 'محصولات', url: `${SITE_URL}/products/` },
    ...(category ? [{ name: category.name, url: `${SITE_URL}/products/?category=${category.slug}` }] : []),
    { name: details.name, url: `${SITE_URL}/product/${details.slug}/` },
  ]);
  return (
    <>
      <JsonLd data={[productLd, breadcrumbLd]} />
      <ProductDetailsClient product={details} />
    </>
  );
}
