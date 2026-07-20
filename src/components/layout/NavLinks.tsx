"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/constants';

interface NavLinksProps {
    mobile?: boolean;
}

/**
 * Active-link logic (unchanged from v2).
 */
function isLinkActive(href: string, pathname: string): boolean {
    const linkPath = href.split('#')[0];
    const hash = href.includes('#') ? href.split('#')[1] : null;

    if (linkPath === '/') {
        if (hash && hash !== 'hero') return false;
        return pathname === '/';
    }

    return pathname === linkPath || pathname.startsWith(linkPath + '/');
}

/**
 * NavLinks — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - `text-gradient` on active link
 *  - Animated underline that grows from right on hover (CSS transition trick)
 *  - 4px violet dot indicator below active link
 *  - `.glass` cards for mobile items
 *  - `.border-gradient` on active mobile item
 *  - `group-hover:translate-x-[-4px]` slide on mobile items
 *
 * Replaced with:
 *  - Desktop: active link = solid accent color + 2px bottom border. Hover =
 *    color brightens only. No animated underline, no dot.
 *  - Mobile: plain list of text links with a left border-tick on active.
 *    No card chrome, no gradient borders.
 */
const NavLinks: React.FC<NavLinksProps> = ({ mobile = false }) => {
    const pathname = usePathname();

    if (mobile) {
        return (
            <nav className="flex flex-col w-full" aria-label="منوی اصلی">
                {NAV_LINKS.map((link) => {
                    const isActive = isLinkActive(link.href, pathname);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`border-r-2 py-3 px-4 text-base transition-colors ${
                                isActive
                                    ? 'border-[#8E3BFF] text-[#FBF7FE] bg-[#2D253E]'
                                    : 'border-transparent text-[#CFC6E0] hover:text-[#FBF7FE] hover:bg-[#2D253E]'
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        );
    }

    return (
        <nav className="flex items-center gap-1" aria-label="منوی اصلی">
            {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href, pathname);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                                ? 'border-[#8E3BFF] text-[#FBF7FE]'
                                : 'border-transparent text-[#CFC6E0] hover:text-[#FBF7FE]'
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default React.memo(NavLinks);
