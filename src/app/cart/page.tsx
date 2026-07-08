"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatting';
import { ShoppingCartIcon, TrashIcon } from '@/components/ui/icons';

const QuantityControl: React.FC<{ quantity: number; onDecrease: () => void; onIncrease: () => void; ariaLabel: string; }> = ({ quantity, onDecrease, onIncrease, ariaLabel }) => (
  <div className="flex items-center" aria-label={ariaLabel}>
    <button onClick={onIncrease} className="w-8 h-8 flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors" aria-label="افزایش تعداد">+</button>
    <span className="w-12 h-8 flex items-center justify-center bg-gray-700 text-gray-200 mx-1 rounded-md">{quantity}</span>
    <button onClick={onDecrease} disabled={quantity <= 1} className="w-8 h-8 flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed" aria-label="کاهش تعداد">-</button>
  </div>
);

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-slate-900 text-gray-100 min-h-[calc(100vh-10rem)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-400 mb-8">سبد خرید شما خالی است</h1>
          <ShoppingCartIcon className="w-24 h-24 text-sky-500 mx-auto mb-8 opacity-50" />
          <p className="text-lg text-gray-400 mb-8">به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
          <Link href="/products" className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
            مشاهده محصولات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-900 text-gray-100 min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-sky-400 mb-10">سبد خرید شما</h1>
        <div className="lg:flex lg:gap-8 xl:gap-12">
          <div className="lg:w-2/3 xl:w-3/4 mb-10 lg:mb-0">
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-800 rounded-xl shadow-lg">
                  <Image src={item.imageUrl} alt={item.name} width={96} height={96} className="object-cover rounded-lg flex-shrink-0" sizes="96px" />
                  <div className="flex-grow text-center sm:text-right">
                    <Link href={`/product/${item.slug || item.id}`} className="text-lg font-semibold text-sky-400 hover:text-sky-300 transition-colors">{item.name}</Link>
                    <p className="text-sm text-gray-400 nums">{formatPrice(item.price)}</p>
                  </div>
                  <div className="my-2 sm:my-0">
                    <QuantityControl quantity={item.quantity} onIncrease={() => updateQuantity(item.id, item.quantity + 1)} onDecrease={() => updateQuantity(item.id, item.quantity - 1)} ariaLabel={`تعداد برای ${item.name}`} />
                  </div>
                  <p className="text-md font-medium text-gray-200 w-28 text-center nums">{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 transition-colors p-2" aria-label={`حذف ${item.name} از سبد خرید`}><TrashIcon className="w-6 h-6" /></button>
                </div>
              ))}
            </div>
            {cartItems.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <button onClick={() => { if(window.confirm("آیا از خالی کردن سبد خرید مطمئن هستید؟")) { clearCart(); } }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-300 order-2 sm:order-1">
                  خالی کردن سبد
                </button>
                <Link href="/products" className="px-6 py-2 border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white font-medium rounded-lg shadow-md transition-colors duration-300 order-1 sm:order-2">
                    ادامه خرید
                </Link>
              </div>
            )}
          </div>
          <div className="lg:w-1/3 xl:w-1/4 lg:sticky lg:top-28 self-start h-auto">
            <div className="p-6 bg-slate-800 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-sky-300 mb-6 border-b border-slate-700 pb-3">خلاصه سفارش</h2>
              <div className="space-y-2 border-t border-slate-700 pt-4">
                <div className="flex justify-between text-lg">
                  <p className="text-gray-300">جمع کل:</p>
                  <p className="text-gray-200 font-bold nums">{formatPrice(getCartTotal())}</p>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4 pt-3 border-t border-slate-600">
                  <p className="text-sky-400">مبلغ نهایی قابل پرداخت:</p>
                  <p className="text-sky-300 nums">{formatPrice(getCartTotal())}</p>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <button onClick={() => router.push('/checkout')} className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
                  نهایی کردن سفارش و پرداخت
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>پرداخت امن از طریق درگاه معتبر زیبال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}