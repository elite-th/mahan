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

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getItemCount, isHydrated } = useCart();
    const { isLoggedIn, isLoading } = useAuth();
    const pathname = usePathname();
    const cartItemCount = getItemCount();
    // Use 0 for aria-label during SSR to match server-rendered HTML (avoid hydration mismatch)
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

        // Cleanup when component unmounts
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
                className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-500 ease-in-out border-b ${
                    isScrolled || isMenuOpen
                        ? 'glass border-[#2a1450]/60 shadow-[0_8px_30px_-12px_rgba(168,85,247,0.35)]'
                        : 'bg-transparent border-transparent'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    {/* RTL flex: first child appears on the right, last on the left */}
                    <div className="flex items-center justify-between h-full gap-4">
                        {/* Logo + Desktop Nav (grouped on the right in RTL) */}
                        <div className="flex items-center gap-8">
                            <Link
                                href="/"
                                className="relative transition-transform hover:scale-105 shrink-0"
                                aria-label="ماهان ارتباطات خردمنده - خانه"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="ماهان ارتباطات خردمنده"
                                    width={48}
                                    height={48}
                                    className="h-12 w-auto transition-all duration-300"
                                    priority
                                />
                            </Link>

                            {/* Desktop Navigation — inline, no floating pill */}
                            <nav className="hidden lg:flex items-center">
                                <NavLinks />
                            </nav>
                        </div>

                        {/* Actions — far left in RTL */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative group rounded-xl p-2.5 text-violet-200 hover:text-[#f0abfc] hover:bg-[#2a1450]/60 transition-all duration-300"
                                aria-label={`سبد خرید (${displayCartCount} آیتم)`}
                            >
                                <ShoppingCartIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                {isHydrated && cartItemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white rounded-full bg-gradient-to-br from-[#a855f7] to-[#e879f9] flex items-center justify-center shadow-[0_0_10px_rgba(232,121,249,0.6)] border border-[#0c0418] nums">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Auth */}
                            {!isLoading && (
                                isLoggedIn ? (
                                    <UserMenu />
                                ) : (
                                    <div className="hidden lg:flex items-center gap-3">
                                        <Link
                                            href="/login"
                                            className="px-3 py-2 text-sm font-medium text-violet-200/70 hover:text-[#f0abfc] transition-colors"
                                        >
                                            ورود
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="relative px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-l from-[#9333ea] to-[#d946ef] shadow-lg shadow-[#9333ea]/30 transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(217,70,239,0.6)] hover:-translate-y-0.5"
                                        >
                                            ثبت نام
                                        </Link>
                                    </div>
                                )
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2.5 rounded-xl text-violet-200 hover:text-[#f0abfc] hover:bg-[#2a1450]/60 transition-colors relative z-50"
                                aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
                                aria-expanded={isMenuOpen}
                            >
                                <div className="w-6 h-6 flex flex-col justify-center items-center gap-[5px]">
                                    <span className={`block w-6 h-[2px] bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                                    <span className={`block w-6 h-[2px] bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                                    <span className={`block w-6 h-[2px] bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-[#0c0418]/70 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer — full-screen from the right with glass bg */}
            <div
                className={`lg:hidden fixed top-0 right-0 bottom-0 w-[88%] max-w-sm glass border-l border-[#2a1450] z-[70] transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex flex-col h-full pt-24 pb-8 px-5">
                    {/* Brand header in drawer */}
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <Image
                            src="/logo.png"
                            alt="ماهان ارتباطات خردمنده"
                            width={40}
                            height={40}
                            className="h-10 w-auto"
                        />
                        <div>
                            <p className="text-sm font-bold text-gradient leading-tight">ماهان ارتباطات خردمنده</p>
                            <p className="text-[11px] text-violet-300/60">تجهیزات شبکه و راهکارهای ICT</p>
                        </div>
                    </div>

                    <h2 className="text-violet-300/50 text-[11px] font-semibold uppercase tracking-wider mb-3 px-2">
                        منوی اصلی
                    </h2>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <NavLinks mobile />
                    </div>

                    {!isLoading && !isLoggedIn && (
                        <div className="mt-6 space-y-2.5 pt-5 border-t border-[#2a1450]">
                            <Link
                                href="/register"
                                className="flex items-center justify-center w-full py-3 text-sm font-semibold text-white rounded-full bg-gradient-to-l from-[#9333ea] to-[#d946ef] shadow-lg shadow-[#9333ea]/30 transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(217,70,239,0.6)]"
                            >
                                ثبت نام
                            </Link>
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-full py-3 text-sm font-medium text-violet-200 glass rounded-full hover:text-[#f0abfc] transition-colors"
                            >
                                ورود به حساب
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-[11px] text-violet-400/40 nums">Ver 1.0.2</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
