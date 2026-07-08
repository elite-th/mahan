"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/formatting';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { SHIPPING_METHODS } from '@/constants/shipping';
import type { ShippingMethod } from '@/constants/shipping';
import { Truck, Bike, Package, Phone } from 'lucide-react';


interface _OrderData {
  email: string;
  phone: string;
  fullName: string;
  companyName?: string;
  taxId: string;
  fullAddress: string;
  postalCode: string;
}

interface FormErrors {
  email?: string;
  phone?: string;
}

const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone: string) => {
  // Basic validation for Iranian mobile numbers (e.g., 09xxxxxxxxx)
  const re = /^09[0-9]{9}$/;
  return re.test(phone);
};

/** Map icon name string from config to the actual lucide-react component */
const ShippingIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case 'Truck':
      return <Truck className={className} />;
    case 'Bike':
      return <Bike className={className} />;
    case 'Package':
      return <Package className={className} />;
    default:
      return <Truck className={className} />;
  }
};

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    companyName: '',
    taxId: '',
    fullAddress: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'card2card'>('online');
  const [shippingMethod, setShippingMethod] = useState<string>('snapp_express');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const subtotal = getCartTotal();
  const total = subtotal;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'لطفا یک آدرس ایمیل معتبر وارد کنید.';
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'لطفا یک شماره تماس معتبر (مانند 09123456789) وارد کنید.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Payment Request
    setIsSubmitting(true);
    try {
      showToast('در حال انتقال به درگاه پرداخت...', 'info');

      if (paymentMethod === 'online') {
        const response = await fetch('/api/payment/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            description: `پرداخت سفارش توسط ${formData.fullName}`,
            email: formData.email,
            mobile: formData.phone,
            formData: { ...formData, shippingMethod },
            cartItems,
            shippingMethod,
          }),
        });
        const data = await response.json();
        if (data.success && data.url) {
          // Normal Zibal redirect
          window.location.href = data.url;
        } else if (data.success && data.flow === 'card2card') {
          // Amount exceeded Zibal limit → auto-fallback to card-to-card
          clearCart();
          router.push(`/payment/result?flow=card2card&order=${data.orderId}&token=${data.token}`);
        } else {
          showToast(data.error || 'خطا در ارتباط با درگاه پرداخت.', 'error');
          console.error('Payment Error:', data);
          setIsSubmitting(false);
        }
      } else {
        // Card to Card
        const response = await fetch('/api/order/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: { ...formData, shippingMethod },
            cartItems,
            shippingMethod,
          }),
        });
        const data = await response.json();
        if (data.success && data.token) {
          clearCart();
          router.push(`/payment/result?flow=card2card&order=${data.orderId}&token=${data.token}`);
        } else {
          showToast(data.error || 'خطا در ثبت سفارش.', 'error');
          console.error('Order Creation Error:', data);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      showToast('خطای سیستمی رخ داد. لطفاً اتصال اینترنت خود را بررسی کنید.', 'error');
      console.error('System Error:', error);
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-slate-900 text-gray-100 min-h-[calc(100vh-10rem)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-400 mb-8">
            سبد خرید شما برای پرداخت خالی است.
          </h1>
          <Link href="/products" className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
            بازگشت به فروشگاه
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-900 text-gray-100 min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-sky-400 mb-10">
          تکمیل سفارش و پرداخت
        </h1>
        <div className="lg:flex lg:gap-8 xl:gap-12">
          <div className="lg:w-2/3 xl:w-3/4 mb-10 lg:mb-0">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact Info */}
              <fieldset className="p-6 bg-slate-800 rounded-xl shadow-lg">
                <legend className="text-xl font-semibold text-sky-300 mb-4 px-2">اطلاعات تماس</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">آدرس ایمیل <span className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" placeholder="example@domain.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">شماره تماس <span className="text-red-500">*</span></label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" placeholder="۰۹۱۲xxxxxxx" />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Billing / Shipping Address */}
              <fieldset className="p-6 bg-slate-800 rounded-xl shadow-lg">
                <legend className="text-xl font-semibold text-sky-300 mb-4 px-2">اطلاعات ارسال و فاکتور</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" placeholder="مثال: محمد رضایی" />
                  </div>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">نام شرکت (اختیاری)</label>
                    <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" placeholder="در صورت تمایل وارد کنید" />
                  </div>
                  <div>
                    <label htmlFor="taxId" className="block text-sm font-medium text-gray-300 mb-1">کد ملی / شناسه ملی <span className="text-red-500">*</span></label>
                    <input type="text" id="taxId" name="taxId" value={formData.taxId} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" placeholder="۱۰ رقم برای کد ملی" maxLength={10} />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">کد پستی <span className="text-red-500">*</span></label>
                    <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" placeholder="۱۰ رقم بدون خط تیره" maxLength={10} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-300 mb-1">آدرس کامل <span className="text-red-500">*</span></label>
                    <textarea id="fullAddress" name="fullAddress" rows={4} value={formData.fullAddress} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors" placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد"></textarea>
                  </div>
                </div>
              </fieldset>

              {/* Shipping Method Selection */}
              <fieldset className="p-6 bg-slate-800 rounded-xl shadow-lg">
                <legend className="text-xl font-semibold text-sky-300 mb-4 px-2">روش ارسال</legend>
                {/* Courier coordination notice */}
                <div className="mb-5 px-4 py-3 bg-amber-900/20 border border-amber-700/40 rounded-lg text-amber-200 text-sm flex items-start gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <p className="font-medium">برای هماهنگی پیک با پشتیبانی تماس بگیرید</p>
                    <p className="text-amber-300/70 text-xs mt-1">هزینه ارسال بسته به روش انتخابی و مقصد، توسط پشتیبانی اعلام می‌شود.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method: ShippingMethod) => {
                    const isSelected = shippingMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'border-sky-500 bg-sky-900/20' : 'border-gray-700 hover:border-gray-600'}`}
                        onClick={() => setShippingMethod(method.id)}
                      >
                        <input
                          id={`shipping-${method.id}`}
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setShippingMethod(method.id)}
                          className="h-4 w-4 text-sky-600 bg-gray-700 border-gray-600 focus:ring-sky-500 flex-shrink-0"
                        />
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-sky-800/40 text-sky-300' : 'bg-gray-700/50 text-gray-400'}`}>
                            <ShippingIcon iconName={method.icon} className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label htmlFor={`shipping-${method.id}`} className="text-sm font-medium text-gray-200 cursor-pointer">
                              {method.title}
                            </label>
                            <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{method.estimatedDays}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </fieldset>

              {/* Payment Method */}
              <fieldset className="p-6 bg-slate-800 rounded-xl shadow-lg">
                <legend className="text-xl font-semibold text-sky-300 mb-4 px-2">روش پرداخت</legend>
                <div className="space-y-4">
                  <div className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-sky-500 bg-sky-900/20' : 'border-gray-700 hover:border-gray-600'}`} onClick={() => setPaymentMethod('online')}>
                    <input id="payment-online" type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="h-4 w-4 text-sky-600 bg-gray-700 border-gray-600 focus:ring-sky-500" />
                    <label htmlFor="payment-online" className="mr-3 block text-sm font-medium text-gray-200 cursor-pointer">پرداخت آنلاین (زیبال)</label>
                  </div>
                  <div className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card2card' ? 'border-sky-500 bg-sky-900/20' : 'border-gray-700 hover:border-gray-600'}`} onClick={() => setPaymentMethod('card2card')}>
                    <input id="payment-transfer" type="radio" name="payment" value="card2card" checked={paymentMethod === 'card2card'} onChange={() => setPaymentMethod('card2card')} className="h-4 w-4 text-sky-600 bg-gray-700 border-gray-600 focus:ring-sky-500" />
                    <label htmlFor="payment-transfer" className="mr-3 block text-sm font-medium text-gray-200 cursor-pointer">کارت به کارت / حواله بانکی</label>
                  </div>
                </div>
              </fieldset>
              <div className="mt-10 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-10 py-4 text-white text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 hover:scale-105'}`}
                >
                  {isSubmitting ? 'در حال پردازش...' : 'ثبت سفارش و پرداخت'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3 xl:w-1/4 lg:sticky lg:top-28 self-start h-auto">
            <div className="p-6 bg-slate-800 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-sky-300 mb-6 border-b border-slate-700 pb-3">خلاصه سفارش</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-gray-200">{item.name}</p>
                      <p className="text-gray-400">تعداد: {item.quantity}</p>
                    </div>
                    <p className="text-gray-300 font-medium nums">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-slate-700 pt-4">
                <div className="flex justify-between text-md">
                  <p className="text-gray-300">جمع جزء:</p>
                  <p className="text-gray-200 font-medium nums">{formatPrice(subtotal)}</p>
                </div>
                {/* Shipping cost notice */}
                <div className="px-3 py-2 bg-amber-900/15 border border-amber-700/30 rounded-md text-amber-200 text-xs flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  هزینه ارسال: با پشتیبانی هماهنگ کنید
                </div>
                <div className="flex justify-between text-xl font-bold mt-2 pt-2 border-t border-slate-600">
                  <p className="text-sky-400">مبلغ تقریبی:</p>
                  <p className="text-sky-300 nums">{formatPrice(total)}</p>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">+ هزینه ارسال (پس از هماهنگی با پشتیبانی)</p>
                <p className="text-[11px] text-amber-400/80 mt-1">
                  ⚠ قیمت نهایی بر اساس نرخ روز دلار در زمان ثبت سفارش محاسبه می‌شود و ممکن است اندکی متفاوت باشد.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-2 text-xs text-emerald-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>خرید امن با نماد اعتماد الکترونیک (اینماد)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
