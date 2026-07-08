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
    <div className="group relative flex flex-col h-full bg-slate-800 rounded-xl border border-slate-700/50 hover:border-sky-500/50 transition-all duration-500 shadow-lg hover:shadow-lg hover:shadow-lg overflow-hidden">
      {/* Product Link wrapper (Main content) */}
      <Link href={navigateTo} aria-label={product.name} className="block relative h-full">
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-[4/3]">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-slate-700/50 flex items-center justify-center text-slate-500 italic">تصویر در دسترس نیست</div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10">
              <span className="text-white text-sm font-black border border-red-500/30 bg-red-500/10 px-6 py-2 rounded-full shadow-lg">
                ناموجود
              </span>
            </div>
          )}

          {isFeatured && !isOutOfStock && (
            <div className="absolute top-4 left-4 bg-gradient-to-l from-sky-600 to-sky-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg z-10 border border-white/10">
              ویژه
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-100 transition-colors group-hover:text-white line-clamp-2 h-14 mb-4">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium mb-1">قیمت نهایی:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-sky-400 nums" dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayPrice) }} />
              </div>
              {usdPrice ? (
                <span className="text-xs text-slate-400 mt-1 nums">
                  ({formatUsdPrice(usdPrice)})
                </span>
              ) : null}
            </div>

            <div className="w-12 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50 group-hover:bg-sky-500/10 group-hover:border-sky-500/30 transition-all duration-300 transform group-hover:scale-105">
              <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-sky-400 group-hover:-translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </Link>

      {/* Floating Buy Button - outside main link to avoid hydration issues */}
      {!isOutOfStock && (
        <button
          onClick={handleAddToCart}
          aria-label="افزودن به سبد خرید"
          className="absolute top-4 right-4 z-20 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center
                    opacity-0 translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500 ease-out hover:bg-emerald-500 hover:scale-110 shadow-lg border border-white/10"
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ProductCard;