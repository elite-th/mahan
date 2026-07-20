"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ProductDetails } from './page';
import { parseWooCommercePrice, extractUsdPrice, formatUsdPrice } from '@/utils/formatting';
import { sanitizeHtml } from '@/utils/sanitize';
import { ShoppingCartIcon, ShareIcon } from '@/components/ui/icons';

type ImageType = NonNullable<ProductDetails['image']>;

/**
 * ProductDetailsClient — v3 anti-slop styling + mock mode (unoptimized images).
 */
export default function ProductDetailsClient({ product }: { product: ProductDetails }) {
    const { showToast } = useToast();
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(product.image);

    const usdPrice = extractUsdPrice(product.metaData);
    const displayPrice = product.displayPrice || 'قیمت نامشخص';

    useEffect(() => {
        if (product?.image) {
            setSelectedImage(product.image);
        }
    }, [product]);

    const allImages = [product.image, ...product.galleryImages.nodes]
      .filter((img): img is ImageType => !!img)
      .filter((img, index, self) => self.findIndex(i => i.sourceUrl === img.sourceUrl) === index);
    const category = product.productCategories?.nodes?.[0];

    const renderStockStatus = (status: string | null) => {
        switch (status) {
            case 'IN_STOCK': return <span className="text-xs font-medium text-emerald-400 border border-emerald-900 px-3 py-1 rounded">موجود در انبار</span>;
            case 'OUT_OF_STOCK': return <span className="text-xs font-medium text-red-400 border border-red-900 px-3 py-1 rounded">ناموجود</span>;
            default: return <span className="text-xs font-medium text-amber-400 border border-amber-900 px-3 py-1 rounded">نیازمند استعلام</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0a14] text-[#f0edf7] pb-20">
            <div className="container mx-auto px-4 py-10">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 text-sm">
                    <ol className="flex items-center flex-wrap gap-2 text-[#7a7396]">
                        <li><Link href="/" className="transition-colors hover:text-[#f0edf7]">خانه</Link></li>
                        <li>/</li>
                        <li><Link href="/products" className="transition-colors hover:text-[#f0edf7]">محصولات</Link></li>
                        {category && (
                            <>
                                <li>/</li>
                                <li><Link href={`/products?category=${category.slug}`} className="transition-colors hover:text-[#f0edf7]">{category.name}</Link></li>
                            </>
                        )}
                        <li>/</li>
                        <li className="text-[#b4aecb] font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Image Section */}
                    <div className="lg:col-span-6 xl:col-span-7">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <div className="bg-[#15121f] p-4 rounded-lg border border-[#2a2640]">
                                <div className="aspect-[4/3] w-full overflow-hidden rounded relative">
                                    {selectedImage ? (
                                        <Image
                                            src={selectedImage.sourceUrl}
                                            alt={selectedImage.altText || product.name}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#7a7396] text-sm">تصویری موجود نیست</div>
                                    )}
                                </div>
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative w-20 h-20 rounded overflow-hidden flex-shrink-0 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]
                                                ${selectedImage?.sourceUrl === img.sourceUrl
                                                    ? 'border-[#a78bfa]'
                                                    : 'border-[#2a2640] opacity-60 hover:opacity-100'}`}
                                        >
                                            <Image src={img.sourceUrl} alt={img.altText || `${product.name} - تصویر ${index + 1}`} width={80} height={80} unoptimized className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:col-span-6 xl:col-span-5">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    {renderStockStatus(product.stockStatus)}
                                    {category && (
                                        <Link href={`/products?category=${category.slug}`} className="text-xs font-medium text-[#a78bfa] border border-[#3a3556] px-3 py-1 rounded transition-colors hover:border-[#a78bfa]">
                                            {category.name}
                                        </Link>
                                    )}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mb-6 text-[#f0edf7]">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-3xl sm:text-4xl font-semibold text-[#f0edf7] tracking-tight nums" dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayPrice) }} />
                                </div>

                                {usdPrice ? (
                                    <p className="text-sm text-[#7a7396] mb-2 nums">
                                        معادل: {formatUsdPrice(usdPrice)}
                                    </p>
                                ) : null}

                                {product.sku && (
                                    <p className="text-xs text-[#7a7396] tracking-widest mt-2 nums">SKU: {product.sku}</p>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: parseWooCommercePrice(product.price || product.displayPrice),
                                        imageUrl: product.image?.sourceUrl || '',
                                        slug: product.slug,
                                    });
                                }}
                                disabled={product.stockStatus === 'OUT_OF_STOCK' || parseWooCommercePrice(product.price || product.displayPrice) <= 0}
                                className="flex items-center justify-center gap-2 h-12 bg-[#a78bfa] rounded-md px-6 text-[#0c0a14] font-semibold text-base hover:bg-[#c4b5fd] transition-colors w-full disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ShoppingCartIcon className="w-5 h-5" />
                                {product.stockStatus === 'OUT_OF_STOCK' ? 'ناموجود' : 'افزودن به سبد خرید'}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-[#2a2640] hover:border-[#3a3556] hover:bg-[#1d1a2b] transition-colors rounded-md text-sm font-medium text-[#b4aecb]"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href).then(() => {
                                            showToast('لینک محصول کپی شد', 'success');
                                        });
                                    }}
                                >
                                    <ShareIcon className="w-4 h-4" />
                                    اشتراک‌گذاری
                                </button>
                                <Link
                                    href="/#contact"
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-[#2a2640] hover:border-[#3a3556] hover:bg-[#1d1a2b] transition-colors rounded-md text-sm font-medium text-[#b4aecb]"
                                >
                                    مشاوره رایگان
                                </Link>
                            </div>

                            {/* Summary description */}
                            <div className="pt-6 border-t border-[#2a2640]">
                                <h3 className="text-sm font-semibold text-[#f0edf7] mb-3">معرفی</h3>
                                <div className="prose prose-invert prose-sm text-[#b4aecb] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description || 'توضیحاتی برای این محصول ثبت نشده است.') }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Details Section */}
                {product.description && (
                    <div className="mt-16">
                        <div className="bg-[#15121f] rounded-lg p-6 sm:p-10 border border-[#2a2640]">
                            <h2 className="text-xl sm:text-2xl font-semibold text-[#f0edf7] mb-6">
                                توضیحات تکمیلی
                            </h2>
                            <article className="prose prose-invert prose-lg max-w-none text-[#b4aecb] leading-relaxed
                                prose-headings:text-[#f0edf7] prose-a:text-[#a78bfa] prose-strong:text-[#f0edf7]"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
