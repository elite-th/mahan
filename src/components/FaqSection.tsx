"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowLeft } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/seo';

// FAQ content lives in src/lib/seo.ts so it can be shared with the
// server-side FAQPage structured data (JSON-LD) for Google rich results.
const faqData = FAQ_ITEMS;

const FaqItem: React.FC<{
    item: { question: string; answer: string };
    index: number;
    isOpen: boolean;
    onClick: () => void;
}> = ({ item, index, isOpen, onClick }) => {
    return (
        <div
            className={`relative rounded-2xl transition-all duration-300 ${
                isOpen
                    ? 'glow-ring border-gradient'
                    : 'glass hover:border-[#c084fc]/30'
            }`}
        >
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between gap-4 text-right p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e879f9] rounded-2xl"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
            >
                <span className="flex items-start gap-3 flex-1">
                    <span
                        className={`mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold nums transition-colors ${
                            isOpen
                                ? 'bg-gradient-to-br from-[#9333ea] to-[#d946ef] text-white'
                                : 'bg-[#2a1450] text-[#c084fc] border border-[#c084fc]/20'
                        }`}
                        aria-hidden="true"
                    >
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm sm:text-base font-medium text-purple-50 leading-relaxed">
                        {item.question}
                    </h3>
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        isOpen
                            ? 'bg-gradient-to-br from-[#9333ea] to-[#d946ef] text-white'
                            : 'bg-[#1f0e36] text-[#e879f9] border border-[#c084fc]/20'
                    }`}
                    aria-hidden="true"
                >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={`faq-answer-${index}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        className="overflow-hidden"
                    >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                            <div className="pr-10 sm:pr-11">
                                <div className="h-px w-full bg-gradient-to-l from-transparent via-[#c084fc]/30 to-transparent mb-4" />
                                <p className="text-purple-100/70 text-sm sm:text-[15px] leading-7">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="aurora relative py-16 sm:py-24 bg-[#160826] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Sidebar: heading + intro + CTA */}
                    <motion.aside
                        className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-24 lg:self-start"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#e879f9]" aria-hidden="true" />
                            <span className="text-xs font-medium text-[#f0abfc] tracking-wide">
                                سوالات متداول
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-gradient leading-tight mb-4">
                            پاسخ پرسش‌های
                            <br />
                            رایج شما
                        </h2>
                        <p className="text-purple-100/60 text-sm sm:text-base leading-7 mb-8 max-w-md">
                            پاسخ به برخی از رایج‌ترین سوالات شما درباره ماهان ارتباطات خردمنده. اگر پاسخ پرسش خود را نیافتید، با ما تماس بگیرید.
                        </p>

                        {/* CTA pill */}
                        <a
                            href="#contact"
                            className="group inline-flex items-center gap-2 px-5 py-3 rounded-full glass hover:border-[#c084fc]/40 transition-all focus-visible:ring-2 focus-visible:ring-[#e879f9] focus-visible:outline-none"
                        >
                            <span className="text-sm font-medium text-purple-50">
                                سوال دیگری دارید؟ با ما تماس بگیرید
                            </span>
                            <ArrowLeft
                                className="w-4 h-4 text-[#e879f9] transition-transform group-hover:-translate-x-1"
                                aria-hidden="true"
                            />
                        </a>

                        {/* Mini stat */}
                        <div className="hidden lg:flex items-center gap-3 mt-10 pt-8 border-t border-[#c084fc]/10">
                            <div className="flex -space-x-2 -space-x-reverse">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea] to-[#d946ef] border-2 border-[#160826] flex items-center justify-center text-[10px] font-bold text-white"
                                    >
                                        {['✓', '★', '⚡'][i]}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-purple-100/60 leading-relaxed">
                                <span className="text-purple-50 font-semibold nums">+۱۰۰۰</span> مشتری
                                <br />
                                راضی از پاسخگویی ما
                            </p>
                        </div>
                    </motion.aside>

                    {/* Accordion column */}
                    <motion.div
                        className="lg:col-span-8 xl:col-span-8 space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {faqData.map((item, index) => (
                            <FaqItem
                                key={index}
                                item={item}
                                index={index}
                                isOpen={openIndex === index}
                                onClick={() => handleToggle(index)}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
