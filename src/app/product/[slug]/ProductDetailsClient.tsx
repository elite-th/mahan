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


// Define a reusable type for a non-nullable image object
type ImageType = NonNullable<ProductDetails['image']>;

export default function ProductDetailsClient({ product }: { product: ProductDetails }) {
    const { showToast } = useToast();
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(product.image);

    // SINGLE SOURCE OF TRUTH: the WooCommerce `displayPrice` — computed
    // by the Noskhan plugin at GraphQL resolve time using the current
    // USD rate. We do NOT recompute on the client (avoids mismatch with
    // cart and Zibal charge). The WC price is ISR-cached for ≤5 min.
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
            case 'IN_STOCK': return <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">موجود در انبار</span>;
            case 'OUT_OF_STOCK': return <span className="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">ناموجود</span>;
            default: return <span className="text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">نیازمند استعلام</span>;
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-900 text-gray-100 pb-20">
            {/* Background elements — removed heavy blur glow orbs (AI-slop) */}

            <div className="container mx-auto px-4 py-10 relative z-10">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 text-sm">
                    <ol className="flex items-center flex-wrap gap-2 text-gray-400">
                        <li><Link href="/" className="hover:text-sky-400 transition-colors">خانه</Link></li>
                        <li className="text-gray-600">/</li>
                        <li><Link href="/products" className="hover:text-sky-400 transition-colors">محصولات</Link></li>
                        {category && (
                            <>
                                <li className="text-gray-600">/</li>
                                <li><Link href={`/products?category=${category.slug}`} className="hover:text-sky-400 transition-colors">{category.name}</Link></li>
                            </>
                        )}
                        <li className="text-gray-600">/</li>
                        <li className="text-gray-200 font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Image Section */}
                    <div className="lg:col-span-6 xl:col-span-7">
                        <div className="sticky top-28 space-y-4">
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 shadow-lg relative group">
                                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl relative">
                                    {selectedImage ? (
                                        <Image
                                            src={selectedImage.sourceUrl}
                                            alt={selectedImage.altText || product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-700/50 flex items-center justify-center text-gray-500 italic">تصویری موجود نیست</div>
                                    )}
                                </div>
                                {/* Image Overlay decoration */}
                                <div className="absolute inset-4 rounded-xl border border-white/5 pointer-events-none"></div>
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar rtl">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 transform hover:scale-105 focus:outline-none 
                                                ${selectedImage?.sourceUrl === img.sourceUrl
                                                    ? 'ring-2 ring-sky-500 ring-offset-4 ring-offset-slate-900 border-2 border-transparent shadow-lg shadow-lg'
                                                    : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0 border border-slate-700'}`}
                                        >
                                            <Image src={img.sourceUrl} alt={img.altText || `${product.name} - تصویر ${index + 1}`} width={80} height={80} className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}


                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:col-span-6 xl:col-span-5">
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    {renderStockStatus(product.stockStatus)}
                                    {category && (
                                        <Link href={`/products?category=${category.slug}`} className="text-xs font-medium text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 hover:bg-sky-500/20 transition-colors">
                                            {category.name}
                                        </Link>
                                    )}
                                </div>
                                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black leading-tight mb-6">
                                    <span className="text-white">
                                        {product.name}
                                    </span>
                                </h1>

                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-4xl sm:text-5xl font-black text-sky-400 tracking-tight nums" dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayPrice) }} />
                                </div>

                                {usdPrice ? (
                                    <p className="text-base text-gray-400 mb-2 nums">
                                        معادل: {formatUsdPrice(usdPrice)}
                                    </p>
                                ) : null}

                                {product.sku && (
                                    <p className="text-xs text-gray-500 tracking-widest mt-2 nums" style={{ fontFamily: 'var(--font-plex)' }}>SKU: {product.sku}</p>
                                )}
                            </div>

                            <div className="relative group p-[2px] rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 shadow-lg shadow-lg hover:shadow-lg transition-all duration-300">
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
                                    className="flex items-center justify-start gap-3 h-14 bg-slate-900 rounded-full px-8 text-white font-black text-xl hover:bg-slate-800 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="text-white">
                                        {product.stockStatus === 'OUT_OF_STOCK' ? 'ناموجود' : 'افزودن به سبد خرید'}
                                    </span>
                                    <ShoppingCartIcon className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/40 hover:bg-slate-700/60 transition-colors rounded-xl border border-slate-700 text-sm font-bold text-gray-300"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href).then(() => {
                                            showToast('لینک محصول برای اشتراک گذاری کپی شد!', 'success');
                                        });
                                    }}
                                >
                                    <ShareIcon className="w-5 h-5" />
                                    اشتراک گذاری
                                </button>
                                <Link
                                    href="/#contact"
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/40 hover:bg-slate-700/60 transition-colors rounded-xl border border-slate-700 text-sm font-bold text-gray-300"
                                >
                                    مشاوره رایگان
                                </Link>
                            </div>

                            {/* Summary description */}
                            <div className="pt-8 border-t border-slate-800/60">
                                <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                                    معرفی
                                </h3>
                                <div className="prose prose-invert prose-sm text-gray-400 line-clamp-4 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description || 'توضیحاتی برای این محصول ثبت نشده است.') }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Details Section */}
                {product.description && (
                    <div className="mt-20">
                        <div className="grid grid-cols-1 gap-10">
                            <div>
                                <div className="bg-slate-800 rounded-xl p-8 sm:p-12 border border-slate-700/50 shadow-lg overflow-hidden relative">
                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl"></div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 relative flex items-center gap-4">
                                        توضیحات تکمیلی
                                        <div className="flex-grow h-[1px] bg-gradient-to-l from-slate-700 to-transparent"></div>
                                    </h2>

                                    <article className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed 
                                        prose-headings:text-sky-300 prose-headings:font-black prose-a:text-sky-400 prose-strong:text-white"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
