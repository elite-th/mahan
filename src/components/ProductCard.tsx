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

/**
 * ProductCard — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - `.border-gradient` gradient border (violet→orchid) via `::before` mask trick
 *  - `backdrop-blur` glass body + translucent `rgba(31,14,54,0.8)` background
 *  - `hover:glow-ring` colored shadow on the whole card
 *  - `group-hover:scale-105` zoom on the product image (500ms)
 *  - Always-on bottom gradient overlay that "deepens" on hover
 *  - Out-of-stock `.glass` overlay + `.glass` "ناموجود" pill
 *  - Featured "ویژه" gradient pill (`from-violet to-orchid`) + colored glow shadow
 *  - `text-gradient` on the price (gradient text)
 *  - Circular gradient arrow button (`from-violet to-orchid`) + colored shadow
 *  - `group-hover:scale-110` on the arrow
 *  - Floating glass cart button with gradient ring + glass inner disc
 *  - `hover:scale-110` + `hover:glow-ring` on the cart button
 *  - `opacity-0 translate-y-2 translate-x-2` reveal-on-hover choreography
 *
 * Replaced with:
 *  - A solid surface card with a 1px border. Border color brightens on hover.
 *  - Image stays put (no zoom). A simple out-of-stock overlay (solid, no glass).
 *  - Featured badge: small solid accent text "ویژه" top-left, no pill chrome.
 *  - Price in solid color (the same accent), normal font weight.
 *  - Arrow: a plain text "→" link, no circular button.
 *  - Cart button: solid accent square icon button, always visible on hover
 *    (no choreographed reveal), no gradient ring.
 *
 * Cart logic (`addToCart` payload, `dangerouslySetInnerHTML` for price) is
 * IDENTICAL to v2 — only the visual layer changed.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, index: _index, isFeatured }) => {
  const navigateTo = `/product/${product.slug || product.databaseId}`;
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const { addToCart } = useCart();

  const usdPrice = extractUsdPrice(product.metaData);
  const displayPrice = product.displayPrice || 'نامشخص';
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
    <div className="group relative flex flex-col h-full overflow-hidden rounded-lg border border-[#2a2640] bg-[#15121f] transition-colors duration-150 hover:border-[#3a3556]">
      <Link href={navigateTo} aria-label={product.name} className="block relative h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] bg-[#1d1a2b]">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#7a7396] text-sm">
              تصویر در دسترس نیست
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0c0a14]/80">
              <span className="text-sm font-semibold text-[#b4aecb]">ناموجود</span>
            </div>
          )}

          {isFeatured && !isOutOfStock && (
            <span className="absolute top-3 left-3 text-xs font-medium text-[#a78bfa]">
              ویژه
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-[#f0edf7] line-clamp-2 h-10 mb-3 leading-5">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#b4aecb] mb-1">قیمت نهایی</span>
              <span
                className="text-lg font-semibold text-[#f0edf7] nums leading-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayPrice) }}
              />
              {usdPrice ? (
                <span className="text-[11px] text-[#b4aecb] mt-1 nums">
                  ({formatUsdPrice(usdPrice)})
                </span>
              ) : null}
            </div>

            <ArrowLeftIcon className="w-4 h-4 text-[#7a7396] transition-colors group-hover:text-[#a78bfa]" />
          </div>
        </div>
      </Link>

      {/* Cart button — solid, always-visible-on-hover, no choreography */}
      {!isOutOfStock && (
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label="افزودن به سبد خرید"
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-md bg-[#0c0a14]/90 border border-[#2a2640] text-[#a78bfa] opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:border-[#a78bfa] hover:text-[#c4b5fd]"
        >
          <ShoppingCartIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ProductCard;
