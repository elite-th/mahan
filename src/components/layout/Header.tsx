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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${isScrolled || isMenuOpen
                    ? 'h-[90px] bg-slate-900/95 border-slate-700/40 shadow-lg shadow-black/20'
                    : 'h-[110px] bg-transparent border-transparent'
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full">

                        {/* Logo */}
                        <div className="flex items-center justify-start z-50">
                            <Link href="/" className="relative transition-transform hover:scale-105">
                                <Image src="/logo.gif" alt="ویرا شبکه آران" width={120} height={90} className="h-[75px] sm:h-[90px] w-auto transition-all duration-300" priority />
                            </Link>
                        </div>

                        {/* Desktop Navigation - Centered */}
                        <nav className={`hidden lg:flex items-center rounded-full bg-slate-900/90 border border-white/10 shadow-lg shadow-lg transition-all hover:bg-slate-900/95 hover:border-white/20 mx-auto duration-300 ${isScrolled ? 'px-8 py-2' : 'px-12 py-3'}`}>
                            <NavLinks />
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 sm:gap-4 z-50 col-start-3">
                            <Link
                href="/cart"
                className={`relative group rounded-xl text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 ${isScrolled ? 'p-2' : 'p-3'}`}
                aria-label={`سبد خرید (${displayCartCount} آیتم)`}
              >
                <ShoppingCartIcon className={`group-hover:scale-110 transition-transform duration-300 ${isScrolled ? 'w-6 h-6' : 'w-7 h-7'}`} />
                {isHydrated && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              {!isLoading && (
                isLoggedIn ? (
                  <UserMenu />
                ) : (
                  <div className="hidden lg:flex items-center gap-4">
                    <Link href="/login" className={`text-base font-semibold text-gray-300 hover:text-white transition-colors hover:bg-slate-800/30 rounded-lg ${isScrolled ? 'px-3 py-1.5' : 'px-4 py-2'}`}>
                      ورود
                    </Link>
                    <Link
                      href="/register"
                      className={`text-base font-semibold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled ? 'px-4 py-2' : 'px-6 py-3'}`}
                    >
                      ثبت نام
                    </Link>
                  </div>
                )
              )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors relative z-50"
                                aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
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
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 shadow-lg z-[70] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full pt-28 pb-8 px-6">
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-6 px-2">منوی اصلی</h2>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <NavLinks mobile />
                    </div>

                    {!isLoading && !isLoggedIn && (
                        <div className="mt-6 space-y-3 pt-6 border-t border-slate-800">
                            <Link href="/login" className="flex items-center justify-center w-full py-3.5 text-gray-300 bg-slate-800/50 hover:bg-slate-800 rounded-xl font-medium border border-slate-700/50 transition-colors">
                                ورود به حساب
                            </Link>
                            <Link href="/register" className="flex items-center justify-center w-full py-3.5 text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl font-medium shadow-lg transition-colors">
                                ثبت نام
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-600 font-mono">Ver 1.0.2</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
