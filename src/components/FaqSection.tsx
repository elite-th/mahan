"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@/components/ui/icons';
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
        <div className="border-b border-white/10 last:border-b-0">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-right py-5 px-5 sm:px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
            >
                <h3 className="text-base sm:text-lg font-medium text-gray-200 leading-relaxed flex-1">
                    {item.question}
                </h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="flex-shrink-0 mr-4"
                >
                    <ChevronDownIcon size={18} className="text-gray-500" />
                </motion.div>
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
                        className="overflow-hidden"
                    >
                        <div className="px-5 sm:px-6 pb-5">
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="relative py-16 sm:py-24 bg-slate-800 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://wordpress.vna-co.ir/wp-content/uploads/2025/09/1f85295a501a06656b090a855b9fc212.jpg')" }}
                />
                <div className="absolute inset-0 bg-slate-900/85" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <motion.div
                    className="text-center mb-10 sm:mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-sky-400 mb-4">
                        سوالات متداول
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        پاسخ به برخی از رایج‌ترین سوالات شما. اگر پاسخ خود را نیافتید، با ما تماس بگیرید.
                    </p>
                </motion.div>

                {/* Single column list */}
                <motion.div
                    className="max-w-3xl mx-auto bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden"
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

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <a
                        href="#contact"
                        className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded"
                    >
                        سوال دیگری دارید؟ با ما تماس بگیرید ←
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FaqSection;
