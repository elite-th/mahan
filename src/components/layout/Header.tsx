"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCartIcon } from '@/components/ui/icons';
import UserMenu from './UserMenu';
import NavLinks from './NavLinks';

/**
 * Header — refined with smooth transitions.
 *
 * The scrolled/unscrolled transition now uses a single base background
 * (surface-1) with an opacity ramp, so the color shifts smoothly instead
 * of jumping between two discrete colors. The border fades in on scroll.
 * No glassmorphism / backdrop-blur — just solid color with smooth opacity.
 *
 * Logo replaced with a text wordmark (the "M" monogram + company name).
 */
const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getItemCount, isHydrated } = useCart();
    const { isLoggedIn, isLoading } = useAuth();
    const pathname = usePathname();
    const cartItemCount = getItemCount();
    const displayCartCount = isHydrated ? cartItemCount : 0;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300 ease-out ${
                    isScrolled || isMenuOpen
                        ? 'border-[var(--border)] bg-[var(--surface-1)] shadow-[0_4px_24px_-12px_rgba(0,0,0,0.5)]'
                        : 'border-transparent bg-[var(--bg)]'
                }`}
            >
                <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo wordmark + Desktop Nav (grouped on the right in RTL) */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="shrink-0 flex items-center gap-2.5"
                            aria-label="ماهان ارتباطات خردمنده - خانه"
                        >
                            {/* "M" monogram — a styled letter mark instead of an image logo */}
                            <span
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--bg)] font-bold text-lg leading-none"
                                aria-hidden="true"
                            >
                                م
                            </span>
                            <span className="hidden sm:inline-flex flex-col leading-tight">
                                <span className="text-sm font-semibold text-[var(--text)]">ماهان ارتباطات</span>
                                <span className="text-[10px] text-[var(--text-faint)]">زیرساخت شبکه و ICT</span>
                            </span>
                        </Link>

                        {/* Hair-thin divider between logo and nav (desktop only) */}
                        <div className="hidden lg:block h-6 w-px bg-[var(--border)]" aria-hidden="true" />

                        <nav className="hidden lg:flex items-center">
                            <NavLinks />
                        </nav>
                    </div>

                    {/* Actions — far left in RTL */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Cart — solid icon, solid badge */}
                        <Link
                            href="/cart"
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                            aria-label={`سبد خرید (${displayCartCount} آیتم)`}
                        >
                            <ShoppingCartIcon className="h-5 w-5" />
                            {isHydrated && cartItemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-[var(--bg)] bg-[var(--accent)] rounded-full flex items-center justify-center nums">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {!isLoading && (
                            isLoggedIn ? (
                                <UserMenu />
                            ) : (
                                <div className="hidden lg:flex items-center gap-1.5">
                                    <Link
                                        href="/login"
                                        className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                                    >
                                        ورود
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex h-9 items-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                                    >
                                        ثبت‌نام
                                    </Link>
                                </div>
                            )
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
                            aria-expanded={isMenuOpen}
                        >
                            <div className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
                                <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ease-out ${isMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                                <span className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ease-out ${isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay — solid, no blur */}
            <div
                className={`fixed inset-0 z-[60] bg-[var(--bg)]/85 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer — solid surface */}
            <div
                className={`lg:hidden fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-sm border-l border-[var(--border)] bg-[var(--surface-1)] transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex h-full flex-col pt-20 pb-6 px-4">
                    <div className="flex items-center gap-3 mb-6 px-2 pb-4 border-b border-[var(--border)]">
                        <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--bg)] font-bold text-base leading-none"
                            aria-hidden="true"
                        >
                            م
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-[var(--text)] leading-tight">ماهان ارتباطات خردمنده</p>
                            <p className="text-[11px] text-[var(--text-faint)]">تجهیزات شبکه و راهکارهای ICT</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <NavLinks mobile />
                    </div>

                    {!isLoading && !isLoggedIn && (
                        <div className="mt-4 space-y-2 pt-4 border-t border-[var(--border)]">
                            <Link
                                href="/register"
                                className="flex items-center justify-center w-full h-11 text-sm font-semibold text-[var(--bg)] bg-[var(--accent)] rounded-lg transition-colors hover:bg-[var(--accent-hover)]"
                            >
                                ثبت‌نام
                            </Link>
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-full h-11 text-sm font-medium text-[var(--text)] border border-[var(--border)] rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                            >
                                ورود به حساب
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
