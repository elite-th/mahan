"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { ProductNode } from '../types';
import { parseWooCommercePrice, extractUsdPrice, formatUsdPrice } from '../utils/formatting';
import { sanitizeHtml } from '../utils/sanitize';
import { ShoppingCartIcon, ArrowLeftIcon } from '../components/ui/icons';

interface ProductCardProps {
  product: ProductNode;
  index: number;
  isFeatured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index: _index, isFeatured }) => {
  const navigateTo = `/product/${product.slug || product.databaseId}`;
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const { addToCart } = useCart();

  // SINGLE SOURCE OF TRUTH for the display price: the WooCommerce
  // `displayPrice` (which is itself computed by the Noskhan plugin at
  // GraphQL resolve time using the current USD rate). We intentionally
  // do NOT compute `usdPrice × liveRate` on the client — that would
  // create a 3-way mismatch between display, cart, and Zibal charge.
  // The WC price is ISR-cached for at most 5 minutes, which is fresh
  // enough for display and consistent with what the user is charged.
  const usdPrice = extractUsdPrice(product.metaData);
  const displayPrice = product.displayPrice || 'نامشخص';
  // Cart stores the same price the user sees — no mismatch.
  const cartPrice = parseWooCommercePrice(product.price || product.displayPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: cartPrice,
      imageUrl: product.image?.sourceUrl || '',
      slug: product.slug,
    });
  };

  return (
    <div
      className="group relative flex flex-col h-full border-gradient overflow-hidden transition-all duration-500 hover:glow-ring"
      style={{ background: 'rgba(31, 14, 54, 0.8)', backdropFilter: 'blur(12px)' }}
    >
      {/* Product Link wrapper (Main content) */}
      <Link href={navigateTo} aria-label={product.name} className="block relative h-full">
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-[4/3] rounded-t-xl">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-[#2a1450]/60 flex items-center justify-center text-purple-300/50 italic">
              تصویر در دسترس نیست
            </div>
          )}

          {/* Subtle hover darkening overlay (always-on legibility guard) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418]/70 via-[#0c0418]/10 to-transparent pointer-events-none transition-opacity duration-500 group-hover:from-[#0c0418]/85"></div>

          {/* Out-of-stock glass overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0c0418]/60 backdrop-blur-sm">
              <span className="text-purple-50 text-sm font-black px-6 py-2 rounded-full glass border border-red-500/30 text-red-200 shadow-lg">
                ناموجود
              </span>
            </div>
          )}

          {/* Featured badge — gradient pill with glow */}
          {isFeatured && !isOutOfStock && (
            <div className="absolute top-4 left-4 z-10">
              <span
                className="inline-flex items-center text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-white/10 bg-gradient-to-l from-[#9333ea] to-[#d946ef]"
                style={{ boxShadow: '0 0 18px -4px rgba(217, 70, 239, 0.65)' }}
              >
                ویژه
              </span>
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-bold text-purple-50 transition-colors group-hover:text-white line-clamp-2 h-12 mb-3 leading-6">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-purple-300/60 font-medium mb-1">قیمت نهایی:</span>
              <span
                className="text-2xl font-black text-gradient nums leading-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayPrice) }}
              />
              {usdPrice ? (
                <span className="text-xs text-purple-300/50 mt-1.5 nums">({formatUsdPrice(usdPrice)})</span>
              ) : null}
            </div>

            {/* Circular gradient arrow button — scales + glows on hover */}
            <div
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-[#a855f7] to-[#d946ef] shadow-md transition-all duration-300 transform group-hover:scale-110"
              style={{ boxShadow: '0 6px 18px -6px rgba(168, 85, 247, 0.55)' }}
              aria-hidden="true"
            >
              <ArrowLeftIcon className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Floating Cart Button — glass circle with violet→orchid gradient ring */}
      {!isOutOfStock && (
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label="افزودن به سبد خرید"
          className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center
                     opacity-0 translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0
                     transition-all duration-500 ease-out hover:scale-110 hover:glow-ring
                     bg-gradient-to-br from-[#a855f7] to-[#d946ef] p-[1.5px] shadow-md"
        >
          {/* Glass inner disc that sits on top of the gradient ring */}
          <span
            className="flex w-full h-full rounded-full items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(232,121,249,0.10))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: 'inset 0 0 0 1px rgba(192,132,252,0.15)',
            }}
            aria-hidden="true"
          >
            <ShoppingCartIcon className="w-5 h-5 text-[#c084fc]" />
          </span>
        </button>
      )}
    </div>
  );
};

export default ProductCard;
