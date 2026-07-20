"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CopyIcon } from '@/components/ui/icons';

// Real Data provided by user (from environment variables)
const CARD_OWNER = 'امیرحسین کامرانی';
const CARD_NUMBER = '6104337378877557';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '';

interface VerifiedOrder {
    id: number;
    total: string;
    status: string;
    expiry?: string;
}

function CardToCardResult({ orderId, token }: { orderId: string, token: string }) {
    const [loading, setLoading] = useState(true);
    const [verifiedOrder, setVerifiedOrder] = useState<VerifiedOrder | null>(null);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (!orderId || !token) {
            setError('Invalid link');
            setLoading(false);
            return;
        }

        fetch('/api/order/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, token })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setVerifiedOrder(data.order);
                } else {
                    setError(data.error || 'Verification failed');
                }
            })
            .catch(() => setError('Connection error'))
            .finally(() => setLoading(false));
    }, [orderId, token]);

    useEffect(() => {
        if (verifiedOrder?.expiry) {
            const expiryDate = verifiedOrder.expiry;
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = new Date(expiryDate).getTime() - now;

                if (distance < 0) {
                    clearInterval(interval);
                    setTimeLeft('Expired');
                } else {
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeLeft(`${hours} ساعت و ${minutes} دقیقه`);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [verifiedOrder]);

    const handleCopy = async (text: string, field: string) => {
        let success = false;
        try {
            await navigator.clipboard.writeText(text);
            success = true;
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            success = !!document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        if (success) {
            setCopiedField(field);
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setCopiedField(null), 2000);
        }
    };

    if (loading) return <div className="text-center text-[var(--accent)]">در حال اعتبارسنجی...</div>;

    if (error) {
        return (
            <div className="max-w-md mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-8 text-center border border-[var(--border)]">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-red-400">خطا در دسترسی</h1>
                <p className="text-[var(--text-muted)] mb-6">{error === 'Invalid token' ? 'توکن امنیتی نامعتبر است. لطفا از لینک اصلی استفاده کنید.' : 'لینک منقضی یا نامعتبر است.'}</p>
                <Link href="/" className="px-6 py-2 bg-[var(--surface-2)] rounded-lg text-[var(--text)]">بازگشت</Link>
            </div>
        );
    }

    if (!verifiedOrder) {
        return <div className="text-center text-[var(--accent)]">در حال بارگذاری...</div>;
    }

    const whatsappMessage = `سلام، من سفارش شماره #${verifiedOrder.id} را ثبت کردم.\nمبلغ: ${verifiedOrder.total}\nرسید پرداخت پیوست شد.`;
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="max-w-xl mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-6 sm:p-10 border border-[var(--border)]">
            <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--accent-hover)]/20 text-[var(--accent)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h1 className="text-3xl font-bold text-[var(--accent-hover)] mb-2">ثبت سفارش موفق</h1>
                <p className="text-[var(--text-muted)]">سفارش شما موقتاً رزرو شد. برای نهایی‌سازی، لطفاً مبلغ را واریز کنید.</p>
            </div>

            <div className="bg-[var(--bg)] rounded-xl p-6 mb-8 border border-[var(--border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[var(--accent-hover)] to-emerald-500"></div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[var(--text-muted)] text-sm">شماره سفارش</span>
                    <span className="text-xl text-[var(--text)] nums">{verifiedOrder.id}</span>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">نام صاحب حساب</p>
                        <p className="text-lg font-semibold text-[var(--text)]">{CARD_OWNER}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">شماره کارت</p>
                        <div className="flex items-center justify-between bg-[var(--surface-1)] p-3 rounded-lg border border-[var(--border)]">
                            <span className="text-xl text-[var(--accent-hover)] tracking-wider nums">{CARD_NUMBER}</span>
                            <button onClick={() => handleCopy(CARD_NUMBER, 'card')} className={`transition-all duration-200 ${copiedField === 'card' ? 'text-green-400 scale-110' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`} title={copiedField === 'card' ? 'کپی شد!' : 'کپی کردن'}>
                                {copiedField === 'card' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                ) : (
                                    <CopyIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                </div>

                <div className="bg-emerald-900/20 rounded-lg p-3 text-center border border-emerald-900/50">
                    <p className="text-sm text-emerald-400 mb-1">زمان باقی‌مانده رزرو</p>
                    <p className="text-2xl font-bold text-emerald-300 dir-ltr nums">{timeLeft || '---'}</p>
                </div>
            </div>

            <div className="text-center space-y-4">
                <p className="text-sm text-[var(--text-muted)]">پس از واریز، دکمه زیر را بزنید تا رسید را در واتساپ ارسال کنید:</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-lg transform hover:-translate-y-1">
                    <span className="ml-2 rtl:ml-0 rtl:mr-2 text-xl">ارسال رسید در واتساپ</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg>
                </a>
                <Link href="/" className="block text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm mt-4">بازگشت به خانه</Link>
            </div>
        </div>
    );
}

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const flow = searchParams.get('flow');
    const orderId = searchParams.get('order');
    const token = searchParams.get('token');
    const status = searchParams.get('status');
    const refId = searchParams.get('refId');
    const reason = searchParams.get('reason');
    const isSuccess = status === 'success';
    const isOrderUpdateFailed = status === 'order_update_failed';

    useEffect(() => {
        if (isSuccess) {
            clearCart();
        }
    }, [clearCart, isSuccess]);

    if (flow === 'card2card' && orderId && token) {
        return <CardToCardResult orderId={orderId} token={token} />;
    }

    // C6: Server-side payment status display
    // Show different UI for: success, order_update_failed, or regular failure
    if (isOrderUpdateFailed) {
        return (
            <div className="max-w-md mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-8 text-center border border-amber-700/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold mb-4 text-amber-400">پرداخت تأیید شد — نیاز به بررسی</h1>

                <p className="text-[var(--text-muted)] mb-4">
                    پرداخت شما با موفقیت انجام شد، اما ثبت وضعیت سفارش در سیستم با مشکل مواجه شد.
                </p>
                <p className="text-amber-300 text-sm mb-6">
                    لطفاً کد پیگیری زیر را یادداشت کنید و با پشتیبانی تماس بگیرید.
                </p>

                {refId && (
                    <div className="bg-[var(--bg)] rounded-lg p-4 mb-4 border border-[var(--border)]">
                        <p className="text-sm text-[var(--text-muted)] mb-1">کد پیگیری تراکنش</p>
                        <p className="text-xl text-amber-300 nums">{refId}</p>
                    </div>
                )}

                {orderId && (
                    <div className="bg-[var(--bg)] rounded-lg p-4 mb-6 border border-[var(--border)]">
                        <p className="text-sm text-[var(--text-muted)] mb-1">شماره سفارش</p>
                        <p className="text-xl text-[var(--accent-hover)] nums">#{orderId}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <Link href="/" className="block w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors">
                        بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        );
    }

    // Standard Flow (success or failure)
    return (
        <div className="max-w-md mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-8 text-center border border-[var(--border)]">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isSuccess ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </div>

            <h1 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                {isSuccess ? 'پرداخت موفق' : 'پرداخت ناموفق'}
            </h1>

            <p className="text-[var(--text-muted)] mb-8">
                {isSuccess
                    ? 'سفارش شما با موفقیت ثبت و پرداخت شد.'
                    : 'متاسفانه پرداخت شما انجام نشد یا توسط شما لغو گردید.'}
            </p>

            {isSuccess && refId && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-8 border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">کد پیگیری تراکنش</p>
                    <p className="text-xl text-[var(--accent-hover)] nums">{refId}</p>
                </div>
            )}

            {!isSuccess && reason && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-8 border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">علت خطا</p>
                    <p className="text-md text-red-300">
                        {reason === 'session_expired' ? 'نشست پرداخت منقضی شده است.' :
                            reason === 'gateway_timeout' ? 'زمان پاسخگویی درگاه پرداخت به پایان رسید. لطفاً دوباره تلاش کنید.' :
                            reason === 'gateway_rejected' ? 'پرداخت توسط درگاه رد شد. لطفاً دوباره تلاش کنید.' :
                            reason === 'gateway_unavailable' ? 'درگاه پرداخت در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.' :
                            reason === 'server_error' ? 'خطای سرور رخ داده است.' :
                            reason === 'cancelled' ? 'پرداخت توسط شما لغو شد.' :
                            'خطای ناشناخته'}
                    </p>
                </div>
            )}

            <div className="space-y-3">
                <Link href="/" className="block w-full px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] font-semibold rounded-lg transition-colors">
                    بازگشت به صفحه اصلی
                </Link>
                {!isSuccess && (
                    <Link href="/checkout" className="block w-full px-6 py-3 bg-[var(--surface-2)] hover:bg-[var(--surface-2)] text-[var(--text)] font-semibold rounded-lg transition-colors">
                        تلاش مجدد
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <section className="py-12 sm:py-20 bg-[var(--bg)] text-[var(--text)] min-h-[calc(100vh-10rem)] flex items-center justify-center">
            <div className="container mx-auto px-4">
                <Suspense fallback={<div className="text-center text-[var(--accent)]">در حال بارگذاری...</div>}>
                    <PaymentResultContent />
                </Suspense>
            </div>
        </section>
    );
}
