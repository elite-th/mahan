"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Navigation items                                                   */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { href: '/account', label: 'داشبورد', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'سفارش‌ها', icon: ShoppingBag, exact: false },
  { href: '/account/profile', label: 'پروفایل', icon: User, exact: false },
] as const;

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Auth guard — redirect to login when unauthenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Redirecting
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const avatarLetter = user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-slate-900 text-gray-100 flex flex-col lg:flex-row">
      {/* ===== Desktop sidebar (right side in RTL) ===== */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-slate-800/70 border-e border-slate-700/60">
        {/* Avatar & name */}
        <div className="flex flex-col items-center gap-3 pt-8 pb-6 px-4 border-b border-slate-700/60">
          <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-300 text-2xl font-bold select-none">
            {avatarLetter}
          </div>
          <p className="text-base font-semibold text-gray-100 text-center leading-snug">
            {user?.displayName || 'کاربر عزیز'}
          </p>
          <p className="text-xs text-gray-500 text-center truncate max-w-full">
            {user?.email}
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                  ${
                    active
                      ? 'bg-sky-500/15 text-sky-400'
                      : 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-200'
                  }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-3 border-t border-slate-700/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* ===== Main content area ===== */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-slate-800 border-b border-slate-700/60 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 text-sm font-bold select-none">
              {avatarLetter}
            </div>
            <span className="text-sm font-semibold text-gray-200 truncate max-w-[160px]">
              {user?.displayName || 'کاربر عزیز'}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-gray-400 hover:bg-slate-700/50 hover:text-gray-200 transition-colors"
            aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-20 top-[57px]">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="relative bg-slate-800 border-b border-slate-700/60 py-3 px-4 space-y-1 shadow-lg">
              {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                      ${
                        active
                          ? 'bg-sky-500/15 text-sky-400'
                          : 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-200'
                      }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>خروج</span>
              </button>
            </nav>
          </div>
        )}

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* ===== Mobile bottom tab bar ===== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-800 border-t border-slate-700/60">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors duration-200
                  ${
                    active
                      ? 'text-sky-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-red-400/70 hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
