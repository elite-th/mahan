"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCartIcon } from '@/components/ui/icons';
import UserMenu from './UserMenu';
import NavLinks from './NavLinks';

/**
 * Header — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - `.glass` backdrop-blur on scroll → replaced with solid `bg` + 1px border
 *  - Colored shadow `shadow-[#9333ea]/35`
 *  - Gradient cart badge `from-violet to-orchid` + glow shadow
 *  - Gradient register button `from-violet to-orchid` + colored hover shadow
 *  - `hover:-translate-y-0.5` lift on register button
 *  - `hover:scale-105` on logo
 *  - `group-hover:scale-110` on cart icon
 *  - `.glass` on mobile drawer
 *  - `text-gradient` on the brand name in the drawer
 *  - "Ver 1.0.2" version string (template leftover)
 *
 * Kept: all hooks, all behavior, all accessibility, the mobile drawer pattern.
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
        window.addEventListener('scroll', handleScroll);
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
                className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors duration-150 ${
                    isScrolled || isMenuOpen
                        ? 'border-[#262430] bg-[#0b0a0f]'
                        : 'border-transparent bg-[#0b0a0f]'
                }`}
            >
                <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo + Desktop Nav (grouped on the right in RTL) */}
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="shrink-0"
                            aria-label="ماهان ارتباطات خردمنده - خانه"
                        >
                            <Image
                                src="/logo.png"
                                alt="ماهان ارتباطات خردمنده"
                                width={36}
                                height={36}
                                className="h-9 w-auto"
                                priority
                            />
                        </Link>

                        <nav className="hidden lg:flex items-center">
                            <NavLinks />
                        </nav>
                    </div>

                    {/* Actions — far left in RTL */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Cart — solid icon, solid badge */}
                        <Link
                            href="/cart"
                            className="relative rounded-md p-2 text-[#a8a3b8] transition-colors hover:bg-[#1b1923] hover:text-[#ece9f2]"
                            aria-label={`سبد خرید (${displayCartCount} آیتم)`}
                        >
                            <ShoppingCartIcon className="h-5 w-5" />
                            {isHydrated && cartItemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-[#0b0a0f] bg-[#a78bfa] rounded-full flex items-center justify-center nums">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {!isLoading && (
                            isLoggedIn ? (
                                <UserMenu />
                            ) : (
                                <div className="hidden lg:flex items-center gap-1">
                                    <Link
                                        href="/login"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-[#a8a3b8] transition-colors hover:bg-[#1b1923] hover:text-[#ece9f2]"
                                    >
                                        ورود
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-[#a78bfa] px-4 py-2 text-sm font-semibold text-[#0b0a0f] transition-colors hover:bg-[#c4b5fd]"
                                    >
                                        ثبت‌نام
                                    </Link>
                                </div>
                            )
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden rounded-md p-2 text-[#a8a3b8] transition-colors hover:bg-[#1b1923] hover:text-[#ece9f2]"
                            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
                            aria-expanded={isMenuOpen}
                        >
                            <div className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
                                <span className={`block h-0.5 w-5 bg-current transition-transform duration-150 ${isMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                                <span className={`block h-0.5 w-5 bg-current transition-opacity duration-150 ${isMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block h-0.5 w-5 bg-current transition-transform duration-150 ${isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay — solid, no blur */}
            <div
                className={`fixed inset-0 z-[60] bg-[#0b0a0f]/80 lg:hidden transition-opacity duration-200 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer — solid surface */}
            <div
                className={`lg:hidden fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-sm border-l border-[#262430] bg-[#0b0a0f] transition-transform duration-200 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex h-full flex-col pt-20 pb-6 px-4">
                    <div className="flex items-center gap-3 mb-6 px-2 pb-4 border-b border-[#262430]">
                        <Image
                            src="/logo.png"
                            alt="ماهان ارتباطات خردمنده"
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                        />
                        <div>
                            <p className="text-sm font-semibold text-[#ece9f2] leading-tight">ماهان ارتباطات خردمنده</p>
                            <p className="text-[11px] text-[#6b6680]">تجهیزات شبکه و راهکارهای ICT</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <NavLinks mobile />
                    </div>

                    {!isLoading && !isLoggedIn && (
                        <div className="mt-4 space-y-2 pt-4 border-t border-[#262430]">
                            <Link
                                href="/register"
                                className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-[#0b0a0f] bg-[#a78bfa] rounded-md transition-colors hover:bg-[#c4b5fd]"
                            >
                                ثبت‌نام
                            </Link>
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-[#ece9f2] border border-[#262430] rounded-md transition-colors hover:bg-[#1b1923]"
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
