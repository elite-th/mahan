"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/seo';

const faqData = FAQ_ITEMS;

/**
 * FaqItem — single expandable row.
 *
 * Removed (AI slop):
 *  - `.glow-ring` + `.border-gradient` on the open state
 *  - `.glass` on the closed state with `hover:border-orchid/30`
 *  - Numbered badge "01", "02" with gradient fill `from-violet to-orchid`
 *  - Gradient icon circle for the Plus/Minus toggle
 *  - `motion.span` rotate animation on the toggle icon
 *  - framer-motion `AnimatePresence` height animation on the answer
 *  - Gradient hairline divider above the answer (`bg-gradient-to-l from-transparent via-violet to-transparent`)
 *  - `motion.aside` / `motion.div` entrance animations (opacity + x/y)
 *  - `.glass` pill eyebrow "سوالات متداول" with HelpCircle icon
 *  - `text-gradient` on the H2
 *  - `.glass` CTA pill with sliding arrow
 *  - Fake "+۱۰۰۰ مشتری راضی" mini-stat with emoji avatars (✓/★/⚡) in
 *    gradient circles — entirely fabricated social proof
 *
 * Replaced with:
 *  - A two-column layout: heading + contact link on the right (RTL),
 *    a plain accordion list on the left. No entrance animations.
 *  - Each FAQ item is a row separated by 1px borders (no card chrome).
 *    The Plus/Minus icon is a plain icon (no circle, no gradient).
 *    The answer expands inline using a CSS grid-rows transition (no JS
 *    height measurement, no framer-motion).
 */
const FaqItem: React.FC<{
    item: { question: string; answer: string };
    index: number;
    isOpen: boolean;
    onClick: () => void;
}> = ({ item, index, isOpen, onClick }) => {
    return (
        <div className="border-b border-[#2a2640]">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between gap-4 text-right py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] rounded"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
            >
                <span className="text-sm sm:text-base font-medium text-[#f0edf7] leading-relaxed flex-1">
                    {item.question}
                </span>
                <span className="shrink-0 text-[#b4aecb]" aria-hidden="true">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
            </button>
            {/* CSS grid-rows transition: 0fr → 1fr. No JS height measurement. */}
            <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className="grid transition-[grid-template-rows] duration-200 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <p className="pb-4 text-sm text-[#b4aecb] leading-7">
                        {item.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="border-b border-[#2a2640] bg-[#0c0a14] py-20 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
                    {/* Sidebar: heading + contact link (right in RTL) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
                        <h2 className="text-3xl font-semibold leading-tight text-[#f0edf7] sm:text-4xl">
                            سوالات متداول
                        </h2>
                        <p className="mt-4 text-sm text-[#b4aecb] leading-7 max-w-md">
                            پاسخ به برخی از رایج‌ترین سوالات. اگر پاسخ خود را نیافتید، با ما تماس بگیرید.
                        </p>
                        <a
                            href="#contact"
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#a78bfa] transition-colors hover:text-[#c4b5fd]"
                        >
                            سوال دیگری دارید؟ تماس بگیرید
                            <span aria-hidden="true">←</span>
                        </a>
                    </aside>

                    {/* Accordion (left in RTL) */}
                    <div className="lg:col-span-8 border-t border-[#2a2640]">
                        {faqData.map((item, index) => (
                            <FaqItem
                                key={index}
                                item={item}
                                index={index}
                                isOpen={openIndex === index}
                                onClick={() => handleToggle(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
