"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

/**
 * Verify result — matches the FLAT shape of apiSuccess/apiError responses.
 * apiSuccess returns: { success: true, status, orderId, refId, ... }
 * apiError returns: { success: false, error: "..." }
 */
interface VerifyResult {
    success: boolean;
    status?: string;       // "success" | "failed" | "order_update_failed" | "already_processing"
    orderId?: number;
    refId?: string;
    trackId?: number;
    cardNumber?: string;
    reason?: string;
    message?: string;
    error?: string;
}

export default function VerifyPayment({
    trackId,
    success,
    orderId: urlOrderId,
}: {
    trackId?: string;
    success?: string;
    orderId?: string;
}) {
    const [result, setResult] = useState<VerifyResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { clearCart } = useCart();

    useEffect(() => {
        if (!trackId) {
            setError('شناسه تراکنش یافت نشد.');
            setLoading(false);
            return;
        }

        // If Zibal reported failure directly (success=0), don't bother verifying
        if (success === '0') {
            setResult({
                success: false,
                status: 'failed',
                reason: 'gateway_rejected',
                orderId: urlOrderId ? Number(urlOrderId) : undefined,
            });
            setLoading(false);
            return;
        }

        fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackId: Number(trackId) }),
        })
            .then((r) => r.json())
            .then((data: VerifyResult) => {
                setResult(data);
                // Clear cart on successful payment
                if (data.success && data.status === 'success') {
                    clearCart();
                }
            })
            .catch(() => {
                setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
            })
            .finally(() => setLoading(false));
    }, [trackId, success, urlOrderId, clearCart]);

    if (loading) {
        return (
            <div className="max-w-md mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-8 text-center border border-[var(--border)]">
                <div className="flex items-center justify-center mb-4">
                    <svg className="animate-spin h-10 w-10 text-[var(--accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-[var(--accent-hover)]">در حال تأیید پرداخت...</h1>
                <p className="text-[var(--text-muted)] mt-2">لطفاً منتظر بمانید.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-8 text-center border border-red-700/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-red-400">خطا</h1>
                <p className="text-[var(--text-muted)] mb-6">{error}</p>
                <Link href="/" className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] font-semibold rounded-lg transition-colors inline-block">
                    بازگشت به صفحه اصلی
                </Link>
            </div>
        );
    }

    if (!result) return null;

    const isSuccess = result.status === 'success';
    const isOrderUpdateFailed = result.status === 'order_update_failed';
    const isAlreadyProcessing = result.status === 'already_processing';

    // Order update failed — payment verified but order status not updated
    if (isOrderUpdateFailed) {
        return (
            <div className="max-w-md mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-8 text-center border border-amber-700/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-amber-400">پرداخت تأیید شد — نیاز به بررسی</h1>
                <p className="text-[var(--text-muted)] mb-4">پرداخت شما با موفقیت انجام شد، اما ثبت وضعیت سفارش در سیستم با مشکل مواجه شد.</p>
                <p className="text-amber-300 text-sm mb-6">لطفاً کد پیگیری زیر را یادداشت کنید و با پشتیبانی تماس بگیرید.</p>
                {result.refId && (
                    <div className="bg-[var(--bg)] rounded-lg p-4 mb-4 border border-[var(--border)]">
                        <p className="text-sm text-[var(--text-muted)] mb-1">کد پیگیری تراکنش</p>
                        <p className="text-xl text-amber-300 nums">{result.refId}</p>
                    </div>
                )}
                {result.orderId && (
                    <div className="bg-[var(--bg)] rounded-lg p-4 mb-6 border border-[var(--border)]">
                        <p className="text-sm text-[var(--text-muted)] mb-1">شماره سفارش</p>
                        <p className="text-xl text-[var(--accent-hover)] nums">#{result.orderId}</p>
                    </div>
                )}
                <Link href="/" className="block w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors">
                    بازگشت به صفحه اصلی
                </Link>
            </div>
        );
    }

    // Already processing — optimistic response
    if (isAlreadyProcessing) {
        return (
            <div className="max-w-md mx-auto bg-[var(--surface-1)] rounded-xl shadow-lg p-8 text-center border border-[var(--accent-press)]/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-hover)]/20 text-[var(--accent)] flex items-center justify-center">
                    <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-[var(--accent-hover)]">تراکنش در حال پردازش</h1>
                <p className="text-[var(--text-muted)] mb-6">پرداخت شما در حال تأیید است. لطفاً چند لحظه صبر کنید.</p>
                {result.orderId && (
                    <div className="bg-[var(--bg)] rounded-lg p-4 mb-6 border border-[var(--border)]">
                        <p className="text-sm text-[var(--text-muted)] mb-1">شماره سفارش</p>
                        <p className="text-xl text-[var(--accent-hover)] nums">#{result.orderId}</p>
                    </div>
                )}
                <Link href="/" className="block w-full px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] font-semibold rounded-lg transition-colors">
                    بازگشت به صفحه اصلی
                </Link>
            </div>
        );
    }

    // Standard success or failure
    const reasonMessages: Record<string, string> = {
        session_expired: 'نشست پرداخت منقضی شده است.',
        gateway_timeout: 'زمان پاسخگویی درگاه پرداخت به پایان رسید. لطفاً دوباره تلاش کنید.',
        gateway_rejected: 'پرداخت توسط درگاه رد شد. لطفاً دوباره تلاش کنید.',
        gateway_unavailable: 'درگاه پرداخت در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.',
        server_error: 'خطای سرور رخ داده است.',
        cancelled: 'پرداخت توسط شما لغو شد.',
    };

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

            {isSuccess && result.refId && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-4 border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">کد پیگیری تراکنش</p>
                    <p className="text-xl text-[var(--accent-hover)] nums">{result.refId}</p>
                </div>
            )}

            {isSuccess && result.cardNumber && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-4 border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">شماره کارت پرداخت‌کننده</p>
                    <p className="text-lg text-[var(--text)] nums" dir="ltr">{result.cardNumber}</p>
                </div>
            )}

            {result.orderId && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-8 border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">شماره سفارش</p>
                    <p className="text-xl text-[var(--accent-hover)] nums">#{result.orderId}</p>
                </div>
            )}

            {!isSuccess && result.reason && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-8 border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">علت خطا</p>
                    <p className="text-md text-red-300">
                        {reasonMessages[result.reason] || 'خطای ناشناخته'}
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
