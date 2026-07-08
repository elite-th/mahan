"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ChevronDownIcon } from '@/components/ui/icons';

const UserMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const avatarLetter = user.displayName?.charAt(0) || user.email?.charAt(0) || '?';

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/30 text-gray-200 transition-all duration-300 group"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-lg group-hover:shadow-lg transition-shadow">
                    {avatarLetter}
                </div>
                <span className="hidden sm:inline-block font-semibold text-base max-w-[120px] truncate">{user.displayName}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-3 w-56 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg py-2 z-50 overflow-hidden animation-fade-in origin-top-left">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                        <p className="text-sm text-gray-400">خوش آمدید،</p>
                        <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                    </div>
                    <Link href="/account" onClick={() => setIsOpen(false)} className="block w-full text-right px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">داشبورد</Link>
                    <Link href="/account/orders" onClick={() => setIsOpen(false)} className="block w-full text-right px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">سفارش‌های من</Link>
                    <Link href="/account/profile" onClick={() => setIsOpen(false)} className="block w-full text-right px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">پروفایل</Link>
                    <div className="h-px bg-slate-700/50 mx-4 my-1"></div>
                    <button onClick={async () => { await logout(); setIsOpen(false); }} className="block w-full text-right px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">خروج</button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
