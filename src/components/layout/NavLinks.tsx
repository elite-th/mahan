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
            <div className="flex flex-col space-y-2 w-full">
                {NAV_LINKS.map((link, index) => {
                    const isActive = isLinkActive(link.href, pathname);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative px-6 py-4 text-lg font-medium transition-all duration-300 rounded-xl border flex items-center justify-between group overflow-hidden ${isActive
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-lg'
                                : 'text-gray-300 border-slate-700/30 hover:border-slate-600 hover:bg-slate-800/50'
                                }`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <span className="relative z-10 group-hover:translate-x-[-4px] transition-transform duration-300">{link.label}</span>
                            {isActive && <div className="w-2 h-2 rounded-full bg-sky-400 shadow-lg"></div>}
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 lg:gap-10">
            {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href, pathname);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`group relative py-3 text-base font-semibold transition-colors duration-300 ${isActive ? 'text-sky-400' : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        {link.label}
                        <span className={`absolute bottom-0 right-0 h-[2px] bg-sky-500 rounded-full transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'
                            }`}></span>
                    </Link>
                );
            })}
        </div>
    );
};

// Wrap with React.memo to prevent unnecessary re-renders when parent state (e.g. scroll) changes
export default React.memo(NavLinks);
