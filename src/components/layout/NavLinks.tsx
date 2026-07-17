"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/constants';

interface NavLinksProps {
    mobile?: boolean;
}

/**
 * Determine if a nav link should be highlighted as "active".
 *
 * - Hash links (e.g. /#hero): Only the PRIMARY home link (/#hero) is active
 *   when on the home page. Other hash links (/#about, /#faq, etc.) are NOT
 *   highlighted — they all resolve to pathname "/" which would make every
 *   hash link active simultaneously.
 * - Path links (e.g. /products): Active on exact match or when the current
 *   path starts with the link path + "/" (handles nested routes).
 */
function isLinkActive(href: string, pathname: string): boolean {
    const linkPath = href.split('#')[0];
    const hash = href.includes('#') ? href.split('#')[1] : null;

    if (linkPath === '/') {
        // Hash link on the home page — only highlight the primary link (#hero)
        if (hash && hash !== 'hero') return false;
        return pathname === '/';
    }

    // Regular path link — exact match or nested route
    return pathname === linkPath || pathname.startsWith(linkPath + '/');
}

const NavLinks: React.FC<NavLinksProps> = ({ mobile = false }) => {
    const pathname = usePathname();

    if (mobile) {
        return (
            <div className="flex flex-col gap-2.5 w-full">
                {NAV_LINKS.map((link, index) => {
                    const isActive = isLinkActive(link.href, pathname);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative rounded-2xl px-5 py-4 text-base font-medium transition-all duration-300 group overflow-hidden ${
                                isActive
                                    ? 'border-gradient text-[#f0abfc]'
                                    : 'glass text-violet-200 hover:text-[#f0abfc]'
                            }`}
                            style={{ transitionDelay: `${index * 40}ms` }}
                        >
                            <span className="relative z-10 flex items-center justify-between">
                                {link.label}
                                {isActive && (
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#e879f9] shadow-[0_0_10px_rgba(232,121,249,0.7)]" />
                                )}
                            </span>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href, pathname);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`group relative py-2 text-sm font-medium transition-colors duration-300 ${
                            isActive
                                ? 'text-gradient'
                                : 'text-violet-200/80 hover:text-[#f0abfc]'
                        }`}
                    >
                        {link.label}

                        {/* Animated underline — grows from the right (RTL) */}
                        <span
                            className={`absolute -bottom-0.5 right-0 h-[2px] rounded-full bg-gradient-to-l from-[#a855f7] to-[#e879f9] transition-all duration-300 ${
                                isActive
                                    ? 'w-full opacity-100'
                                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                            }`}
                        />

                        {/* Active dot indicator */}
                        <span
                            className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#e879f9] shadow-[0_0_8px_rgba(232,121,249,0.8)] transition-opacity duration-300 ${
                                isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    </Link>
                );
            })}
        </div>
    );
};

// Wrap with React.memo to prevent unnecessary re-renders when parent state (e.g. scroll) changes
export default React.memo(NavLinks);
