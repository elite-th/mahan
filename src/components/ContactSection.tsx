"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2, AlertCircle, RotateCcw, CheckCircle, Clock } from 'lucide-react';

const isOpenNow = (): boolean => {
    try {
        const now = new Date();
        const tehranTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));
        const day = tehranTime.getDay();
        const hour = tehranTime.getHours();
        const isWorkingDay = day === 6 || (day >= 0 && day <= 4);
        const isWorkingHour = hour >= 8 && hour < 16;
        return isWorkingDay && isWorkingHour;
    } catch {
        return false;
    }
};

/**
 * ContactSection — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - `.aurora` ambient background blobs
 *  - framer-motion `motion.div` entrance animations (opacity + x/y)
 *  - `.glass` pill eyebrow "تماس با ما" with MessageSquare icon
 *  - `text-gradient` on the H2
 *  - `.border-gradient` on the info panel
 *  - Gradient icon circles `bg-gradient-to-br from-violet to-orchid` for
 *    Phone/Mail/MapPin (3x)
 *  - Gradient hairline dividers between info blocks (`bg-gradient-to-l`)
 *  - `.glass` working-hours sub-card
 *  - `animate-ping` open/closed indicator dot
 *  - `.glass` form card with gradient top bar (`from-violet via-orchid to-orchid`)
 *  - Floating-label inputs with `.glass` background + violet focus ring
 *  - Gradient submit button `from-violet to-orchid`
 *  - `.glass` "ارسال پیام جدید" reset button
 *  - Gradient success-state icon container
 *
 * Replaced with:
 *  - A two-column layout: info (right in RTL) + form (left in RTL).
 *  - Solid surfaces, 1px borders, plain icons (no gradient circles).
 *  - Open/closed indicator: a steady colored dot (no ping animation).
 *  - Standard labeled inputs (no floating-label choreography).
 *  - Solid accent submit button.
 *
 * ALL form logic, state, handlers, and the /api/contact fetch are IDENTICAL.
 */
const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

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
        <section id="contact" className="border-b border-[#262430] bg-[#0b0a0f] py-20 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 max-w-2xl">
                    <h2 className="text-3xl font-semibold leading-tight text-[#ece9f2] sm:text-4xl">
                        تماس با ما
                    </h2>
                    <p className="mt-4 text-sm text-[#a8a3b8] leading-7">
                        برای مشاوره تخصصی، دریافت قیمت یا هرگونه سوال، تیم ماهان ارتباطات خردمنده آماده پاسخگویی به شماست.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl">
                    {/* Info panel (right in RTL) */}
                    <div className="border border-[#262430] rounded-lg p-6 sm:p-8 flex flex-col">
                        <h3 className="text-base font-semibold text-[#ece9f2] mb-6">اطلاعات تماس</h3>

                        {/* Phones */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Phone className="w-4 h-4 text-[#6b6680]" aria-hidden="true" />
                                <span className="text-xs font-medium uppercase tracking-wider text-[#6b6680]">تلفن تماس</span>
                            </div>
                            <div className="space-y-1.5 pl-6">
                                {phones.map((phone) => (
                                    <a
                                        key={phone.href}
                                        href={phone.href}
                                        className="block text-[#ece9f2] transition-colors hover:text-[#a78bfa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] rounded"
                                        dir="ltr"
                                    >
                                        <span className="font-medium nums text-sm">{phone.label}</span>
                                        <span className="text-[11px] text-[#6b6680] mr-2">({phone.sub})</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-[#262430] mb-6" />

                        {/* Email */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Mail className="w-4 h-4 text-[#6b6680]" aria-hidden="true" />
                                <span className="text-xs font-medium uppercase tracking-wider text-[#6b6680]">ایمیل</span>
                            </div>
                            <a
                                href="mailto:info@mahan-ic.ir"
                                className="block pl-6 text-[#ece9f2] transition-colors hover:text-[#a78bfa] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] rounded w-fit"
                                dir="ltr"
                            >
                                info@mahan-ic.ir
                            </a>
                        </div>

                        <div className="h-px bg-[#262430] mb-6" />

                        {/* Address */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-[#6b6680]" aria-hidden="true" />
                                <span className="text-xs font-medium uppercase tracking-wider text-[#6b6680]">آدرس</span>
                            </div>
                            <p className="pl-6 text-sm text-[#a8a3b8] leading-7">
                                استان تهران، شهرستان شمیرانات، بخش مرکزی، شهر تجریش، محله ازگل، خیابان گلچین جنوبی، کوچه لاله، پلاک ۳
                            </p>
                        </div>

                        {/* Working hours — steady dot, no ping */}
                        <div className="mt-auto pt-6 border-t border-[#262430]">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-[#6b6680]" aria-hidden="true" />
                                <span className="text-xs font-medium uppercase tracking-wider text-[#6b6680]">ساعات پاسخگویی</span>
                            </div>
                            <p className="text-sm text-[#ece9f2] mb-2">
                                شنبه تا پنجشنبه — <span className="nums">۸ الی ۱۶</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-block h-2 w-2 rounded-full ${currentlyOpen ? 'bg-emerald-400' : 'bg-[#6b6680]'}`}
                                    aria-hidden="true"
                                />
                                <span className={`text-sm font-medium ${currentlyOpen ? 'text-emerald-400' : 'text-[#6b6680]'}`}>
                                    {currentlyOpen ? 'هم‌اکنون باز است' : 'در حال حاضر تعطیل'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form (left in RTL) */}
                    <div className="border border-[#262430] rounded-lg p-6 sm:p-8 flex flex-col">
                        <div aria-live="polite" className="flex-1">
                            {isSubmitted && !submitError ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                    <CheckCircle className="w-10 h-10 text-emerald-400 mb-4" />
                                    <p className="font-semibold text-[#ece9f2] mb-1">پیام شما ارسال شد</p>
                                    <p className="text-sm text-[#a8a3b8] mb-6">به زودی با شما تماس خواهیم گرفت.</p>
                                    <button
                                        onClick={handleResetForm}
                                        className="text-sm text-[#a78bfa] transition-colors hover:text-[#c4b5fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] rounded"
                                    >
                                        ارسال پیام جدید
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                    <div className="mb-2">
                                        <h3 className="text-base font-semibold text-[#ece9f2]">فرم تماس</h3>
                                        <p className="text-xs text-[#6b6680] mt-1">پیام خود را برای ما ارسال کنید</p>
                                    </div>

                                    {submitError && (
                                        <div className="p-3 bg-red-950/40 border border-red-900 rounded-md flex items-start gap-2.5">
                                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
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

                                    {/* Standard labeled inputs (no floating labels) */}
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-medium text-[#a8a3b8] mb-1.5">
                                            نام
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            minLength={2}
                                            disabled={isSubmitting}
                                            className="w-full px-3 py-2.5 bg-[#131218] border border-[#262430] rounded-md text-sm text-[#ece9f2] transition-colors placeholder:text-[#6b6680] focus:border-[#a78bfa] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="نام و نام خانوادگی"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-xs font-medium text-[#a8a3b8] mb-1.5">
                                            ایمیل
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full px-3 py-2.5 bg-[#131218] border border-[#262430] rounded-md text-sm text-[#ece9f2] transition-colors placeholder:text-[#6b6680] focus:border-[#a78bfa] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="you@example.com"
                                            dir="ltr"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-xs font-medium text-[#a8a3b8] mb-1.5">
                                            پیام
                                        </label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            minLength={10}
                                            disabled={isSubmitting}
                                            className="w-full px-3 py-2.5 bg-[#131218] border border-[#262430] rounded-md text-sm text-[#ece9f2] transition-colors placeholder:text-[#6b6680] focus:border-[#a78bfa] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                            placeholder="پیام خود را اینجا بنویسید..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#a78bfa] text-[#0b0a0f] text-sm font-semibold rounded-md transition-colors hover:bg-[#c4b5fd] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
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
        </section>
    );
};

export default ContactSection;
