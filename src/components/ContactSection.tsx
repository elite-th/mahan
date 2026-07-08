"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2, AlertCircle, RotateCcw, CheckCircle, Clock } from 'lucide-react';

const isOpenNow = (): boolean => {
    try {
        const now = new Date();
        const tehranTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));
        const day = tehranTime.getDay();
        const hour = tehranTime.getHours();
        // 6 = Saturday, 0-4 = Sunday-Thursday (Persian work week)
        const isWorkingDay = day === 6 || (day >= 0 && day <= 4);
        const isWorkingHour = hour >= 8 && hour < 16;
        return isWorkingDay && isWorkingHour;
    } catch {
        return false;
    }
};

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                const errorMessage = data.error || 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.';
                setSubmitError(errorMessage);
                return;
            }

            setIsSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch {
            setSubmitError('خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setSubmitError(null);
    };

    const handleResetForm = () => {
        setIsSubmitted(false);
        setSubmitError(null);
    };

    const currentlyOpen = isOpenNow();

    return (
        <section id="contact" className="py-16 sm:py-24 bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-sky-400 mb-4">
                        تماس با ما
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        برای مشاوره، دریافت قیمت یا هرگونه سوال با ما در ارتباط باشید.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Unified contact info card — single panel with all info */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8 mb-8">
                        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                            {/* Phones */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Phone className="w-4 h-4 text-sky-400" />
                                    <span className="text-xs text-gray-500 tracking-wide">تلفن تماس</span>
                                </div>
                                <div className="space-y-2">
                                    <a
                                        href="tel:02191090702"
                                        className="block text-gray-200 hover:text-sky-400 transition-colors font-semibold nums focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded"
                                    >
                                        021-91090702
                                    </a>
                                    <a
                                        href="tel:09386473626"
                                        className="block text-gray-300 hover:text-sky-400 transition-colors text-sm nums focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded"
                                    >
                                        0938-647-3626 (فروش)
                                    </a>
                                    <a
                                        href="tel:09104491267"
                                        className="block text-gray-400 hover:text-sky-400 transition-colors text-sm nums focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded"
                                    >
                                        0910-449-1267 (پشتیبانی)
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Mail className="w-4 h-4 text-sky-400" />
                                    <span className="text-xs text-gray-500 tracking-wide">ایمیل</span>
                                </div>
                                <a
                                    href="mailto:info@vna-co.ir"
                                    className="text-gray-200 hover:text-sky-400 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded"
                                    dir="ltr"
                                >
                                    info@vna-co.ir
                                </a>
                            </div>

                            {/* Address */}
                            <div className="sm:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-sky-400" />
                                    <span className="text-xs text-gray-500 tracking-wide">آدرس</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    استان تهران، شهرستان شمیرانات، بخش مرکزی، شهر تجریش، محله ازگل، خیابان گلچین جنوبی، کوچه لاله، پلاک ۳
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        <span>شنبه تا پنجشنبه — ۸ الی ۱۶</span>
                                    </div>
                                    <span className={`w-1.5 h-1.5 rounded-full ${currentlyOpen ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                                    <span className={currentlyOpen ? 'text-emerald-400' : 'text-gray-600'}>
                                        {currentlyOpen ? 'باز' : 'تعطیل'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="h-0.5 bg-sky-400" aria-hidden="true" />

                        <div className="p-6 sm:p-8">
                            <div aria-live="polite">
                                {isSubmitted && !submitError ? (
                                    <div className="text-center py-10">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <p className="font-semibold text-white mb-1">پیام شما ارسال شد</p>
                                        <p className="text-sm text-gray-400 mb-5">به زودی با شما تماس خواهیم گرفت.</p>
                                        <button
                                            onClick={handleResetForm}
                                            className="text-sm text-sky-400 hover:text-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded"
                                        >
                                            ارسال پیام جدید
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                        {submitError && (
                                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5">
                                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-red-400">{submitError}</p>
                                                    <button
                                                        type="button"
                                                        onClick={handleRetry}
                                                        className="mt-1.5 text-xs text-red-300 hover:text-red-200 transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <RotateCcw className="w-3 h-3" />
                                                        تلاش مجدد
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid sm:grid-cols-2 gap-5">
                                            {/* Name — floating label */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder=" "
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('name')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    minLength={2}
                                                    disabled={isSubmitting}
                                                    className="peer w-full pt-6 pb-2 px-4 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 text-sm placeholder-transparent focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:border-sky-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <label
                                                    htmlFor="name"
                                                    className={`absolute right-4 transition-all duration-200 pointer-events-none ${
                                                        formData.name || focusedField === 'name'
                                                            ? 'top-2 text-xs'
                                                            : 'top-4 text-sm text-gray-500'
                                                    } ${
                                                        focusedField === 'name'
                                                            ? 'text-sky-400'
                                                            : formData.name
                                                                ? 'text-gray-400'
                                                                : ''
                                                    }`}
                                                >
                                                    نام
                                                </label>
                                            </div>

                                            {/* Email — floating label */}
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder=" "
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    disabled={isSubmitting}
                                                    className="peer w-full pt-6 pb-2 px-4 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 text-sm placeholder-transparent focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:border-sky-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <label
                                                    htmlFor="email"
                                                    className={`absolute right-4 transition-all duration-200 pointer-events-none ${
                                                        formData.email || focusedField === 'email'
                                                            ? 'top-2 text-xs'
                                                            : 'top-4 text-sm text-gray-500'
                                                    } ${
                                                        focusedField === 'email'
                                                            ? 'text-sky-400'
                                                            : formData.email
                                                                ? 'text-gray-400'
                                                                : ''
                                                    }`}
                                                >
                                                    ایمیل
                                                </label>
                                            </div>
                                        </div>

                                        {/* Message — floating label */}
                                        <div className="relative">
                                            <textarea
                                                name="message"
                                                id="message"
                                                rows={5}
                                                placeholder=" "
                                                value={formData.message}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                minLength={10}
                                                disabled={isSubmitting}
                                                className="peer w-full pt-6 pb-2 px-4 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 text-sm placeholder-transparent focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:border-sky-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                            />
                                            <label
                                                htmlFor="message"
                                                className={`absolute right-4 transition-all duration-200 pointer-events-none ${
                                                    formData.message || focusedField === 'message'
                                                        ? 'top-2 text-xs'
                                                        : 'top-5 text-sm text-gray-500'
                                                } ${
                                                    focusedField === 'message'
                                                        ? 'text-sky-400'
                                                        : formData.message
                                                            ? 'text-gray-400'
                                                            : ''
                                                }`}
                                            >
                                                پیام
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    در حال ارسال...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    ارسال پیام
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
