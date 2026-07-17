"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Loader2, AlertCircle, RotateCcw, CheckCircle, Clock, MessageSquare } from 'lucide-react';

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

    const phones = [
        { href: 'tel:02191090702', label: '021-91090702', sub: 'دفتر مرکزی' },
        { href: 'tel:09386473626', label: '0938-647-3626', sub: 'واحد فروش' },
        { href: 'tel:09104491267', label: '0910-449-1267', sub: 'پشتیبانی' },
    ];

    return (
        <section id="contact" className="aurora relative py-16 sm:py-24 bg-[#0c0418] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <motion.div
                    className="text-center mb-12 sm:mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#e879f9]" aria-hidden="true" />
                        <span className="text-xs font-medium text-[#f0abfc] tracking-wide">تماس با ما</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-gradient mb-4">
                        با ما در ارتباط باشید
                    </h2>
                    <p className="text-purple-100/60 text-sm sm:text-base max-w-2xl mx-auto leading-7">
                        برای مشاوره تخصصی، دریافت قیمت یا هرگونه سوال، تیم ماهان ارتباطات خردمنده آماده پاسخگویی به شماست.
                    </p>
                </motion.div>

                {/* Side-by-side: info panel + form */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {/* LEFT (visual right in RTL): Contact info panel */}
                    <motion.div
                        className="border-gradient p-6 sm:p-8 flex flex-col"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-purple-50 mb-1">اطلاعات تماس</h3>
                        <p className="text-purple-100/50 text-xs sm:text-sm mb-6">
                            راه‌های ارتباطی مستقیم با ماهان ارتباطات خردمنده
                        </p>

                        {/* Phones */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2.5 mb-3">
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#9333ea] to-[#d946ef] text-white shadow-lg shadow-[#9333ea]/20">
                                    <Phone className="w-4 h-4" aria-hidden="true" />
                                </span>
                                <span className="text-xs font-medium text-purple-100/70 tracking-wide">تلفن تماس</span>
                            </div>
                            <div className="space-y-1.5 pr-12">
                                {phones.map((phone) => (
                                    <a
                                        key={phone.href}
                                        href={phone.href}
                                        className="group flex items-baseline gap-2 text-purple-50 hover:text-[#e879f9] transition-colors focus-visible:ring-2 focus-visible:ring-[#e879f9] focus-visible:outline-none rounded"
                                        dir="ltr"
                                    >
                                        <span className="font-semibold nums text-sm sm:text-base">{phone.label}</span>
                                        <span className="text-[11px] text-purple-100/40 group-hover:text-[#e879f9]/60 transition-colors">
                                            ({phone.sub})
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-l from-transparent via-[#c084fc]/20 to-transparent mb-6" />

                        {/* Email */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2.5 mb-3">
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#9333ea] to-[#d946ef] text-white shadow-lg shadow-[#9333ea]/20">
                                    <Mail className="w-4 h-4" aria-hidden="true" />
                                </span>
                                <span className="text-xs font-medium text-purple-100/70 tracking-wide">ایمیل</span>
                            </div>
                            <a
                                href="mailto:info@mahan-ic.ir"
                                className="block pr-12 text-purple-50 hover:text-[#e879f9] transition-colors font-medium nums focus-visible:ring-2 focus-visible:ring-[#e879f9] focus-visible:outline-none rounded w-fit"
                                dir="ltr"
                            >
                                info@mahan-ic.ir
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-l from-transparent via-[#c084fc]/20 to-transparent mb-6" />

                        {/* Address */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2.5 mb-3">
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#9333ea] to-[#d946ef] text-white shadow-lg shadow-[#9333ea]/20">
                                    <MapPin className="w-4 h-4" aria-hidden="true" />
                                </span>
                                <span className="text-xs font-medium text-purple-100/70 tracking-wide">آدرس</span>
                            </div>
                            <p className="pr-12 text-purple-50/80 text-sm leading-7">
                                استان تهران، شهرستان شمیرانات، بخش مرکزی، شهر تجریش، محله ازگل، خیابان گلچین جنوبی، کوچه لاله، پلاک ۳
                            </p>
                        </div>

                        {/* Working hours + open/closed indicator */}
                        <div className="mt-auto pt-6">
                            <div className="glass rounded-xl p-4">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <Clock className="w-4 h-4 text-[#c084fc]" aria-hidden="true" />
                                    <span className="text-xs font-medium text-purple-100/70">ساعات پاسخگویی</span>
                                </div>
                                <p className="text-purple-50 text-sm font-medium mb-3">
                                    شنبه تا پنجشنبه — <span className="nums">۸ الی ۱۶</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`relative flex h-2.5 w-2.5 ${
                                            currentlyOpen ? '' : ''
                                        }`}
                                        aria-hidden="true"
                                    >
                                        {currentlyOpen && (
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        )}
                                        <span
                                            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                                currentlyOpen ? 'bg-emerald-400' : 'bg-gray-500'
                                            }`}
                                        />
                                    </span>
                                    <span
                                        className={`text-sm font-semibold ${
                                            currentlyOpen ? 'text-emerald-400' : 'text-gray-400'
                                        }`}
                                    >
                                        {currentlyOpen ? 'هم‌اکنون باز است' : 'در حال حاضر تعطیل'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT (visual left in RTL): Form */}
                    <motion.div
                        className="glass rounded-2xl overflow-hidden flex flex-col"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="h-1 bg-gradient-to-l from-[#9333ea] via-[#d946ef] to-[#e879f9]" aria-hidden="true" />

                        <div className="p-6 sm:p-8 flex-1 flex flex-col">
                            <div aria-live="polite" className="flex-1">
                                {isSubmitted && !submitError ? (
                                    <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9333ea]/20 to-[#d946ef]/20 border border-[#c084fc]/30 flex items-center justify-center mx-auto mb-5">
                                            <CheckCircle className="w-8 h-8 text-emerald-400" />
                                        </div>
                                        <p className="font-semibold text-purple-50 mb-1 text-lg">پیام شما ارسال شد</p>
                                        <p className="text-sm text-purple-100/60 mb-6">
                                            به زودی با شما تماس خواهیم گرفت.
                                        </p>
                                        <button
                                            onClick={handleResetForm}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:border-[#c084fc]/40 transition-all text-sm text-purple-50 focus-visible:ring-2 focus-visible:ring-[#e879f9] focus-visible:outline-none"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            ارسال پیام جدید
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                        <div className="mb-2">
                                            <h3 className="text-lg sm:text-xl font-bold text-purple-50">فرم تماس</h3>
                                            <p className="text-purple-100/50 text-xs sm:text-sm">
                                                پیام خود را برای ما ارسال کنید
                                            </p>
                                        </div>

                                        {submitError && (
                                            <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-2.5">
                                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-red-300">{submitError}</p>
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

                                        <div className="grid sm:grid-cols-2 gap-4">
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
                                                    className="peer w-full pt-6 pb-2 px-4 glass rounded-xl text-purple-50 text-sm placeholder-transparent focus-visible:ring-2 focus-visible:ring-[#c084fc]/60 focus-visible:border-[#c084fc]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <label
                                                    htmlFor="name"
                                                    className={`absolute right-4 transition-all duration-200 pointer-events-none ${
                                                        formData.name || focusedField === 'name'
                                                            ? 'top-2 text-xs'
                                                            : 'top-4 text-sm text-purple-100/40'
                                                    } ${
                                                        focusedField === 'name'
                                                            ? 'text-[#e879f9]'
                                                            : formData.name
                                                                ? 'text-purple-100/50'
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
                                                    className="peer w-full pt-6 pb-2 px-4 glass rounded-xl text-purple-50 text-sm placeholder-transparent focus-visible:ring-2 focus-visible:ring-[#c084fc]/60 focus-visible:border-[#c084fc]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <label
                                                    htmlFor="email"
                                                    className={`absolute right-4 transition-all duration-200 pointer-events-none ${
                                                        formData.email || focusedField === 'email'
                                                            ? 'top-2 text-xs'
                                                            : 'top-4 text-sm text-purple-100/40'
                                                    } ${
                                                        focusedField === 'email'
                                                            ? 'text-[#e879f9]'
                                                            : formData.email
                                                                ? 'text-purple-100/50'
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
                                                className="peer w-full pt-6 pb-2 px-4 glass rounded-xl text-purple-50 text-sm placeholder-transparent focus-visible:ring-2 focus-visible:ring-[#c084fc]/60 focus-visible:border-[#c084fc]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                            />
                                            <label
                                                htmlFor="message"
                                                className={`absolute right-4 transition-all duration-200 pointer-events-none ${
                                                    formData.message || focusedField === 'message'
                                                        ? 'top-2 text-xs'
                                                        : 'top-5 text-sm text-purple-100/40'
                                                } ${
                                                    focusedField === 'message'
                                                        ? 'text-[#e879f9]'
                                                        : formData.message
                                                            ? 'text-purple-100/50'
                                                            : ''
                                                }`}
                                            >
                                                پیام
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-l from-[#9333ea] to-[#d946ef] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.6)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#e879f9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0418]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    در حال ارسال...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                                    ارسال پیام
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
