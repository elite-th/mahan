"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToHash — Handles cross-page anchor navigation (e.g. clicking "تماس با ما"
 * → /#contact while on /products).
 *
 * PROBLEM: When navigating from another page to /#contact, the target section
 * (#contact) does not exist yet on the current page. The browser's native
 * anchor-scroll fires before Next.js finishes mounting the home page, so the
 * scroll is lost and the user lands at the top.
 *
 * SOLUTION: After the route changes to "/", if a hash is present, retry the
 * scroll once the target element exists in the DOM. Uses requestAnimationFrame
 * polling with a timeout fallback.
 */
export default function ScrollToHash() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = window.location.hash.slice(1); // strip '#'
        if (!hash) return;

        let cancelled = false;
        let attempts = 0;
        const MAX_ATTEMPTS = 30; // ~1.5s at 50ms intervals

        const tryScroll = () => {
            if (cancelled) return;
            const el = document.getElementById(hash);
            attempts++;

            if (el) {
                // scroll-padding-top in globals.css handles the fixed-header offset
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }

            if (attempts < MAX_ATTEMPTS) {
                setTimeout(tryScroll, 50);
            }
        };

        // Small delay to let the new page's DOM settle after navigation
        const timer = setTimeout(tryScroll, 100);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [pathname]);

    return null;
}
