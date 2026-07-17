"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Camera, Briefcase, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, COMPANY_NAME, COMPANY_SLOGAN } from '../constants';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  const renderLink = (href: string, label: string) => {
    // Hash links on non-home pages: use plain <a> so the browser navigates
    // home and the ScrollToHash component handles the in-page jump.
    if (href.startsWith('/#') && pathname !== '/') {
      return (
        <a
          href={href}
          className="group inline-flex items-center gap-2 text-sm text-violet-200/70 hover:text-[#f0abfc] transition-colors duration-300"
        >
          <span className="w-1 h-1 rounded-full bg-[#a855f7]/60 group-hover:bg-[#e879f9] transition-colors" />
          {label}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-sm text-violet-200/70 hover:text-[#f0abfc] transition-colors duration-300"
      >
        <span className="w-1 h-1 rounded-full bg-[#a855f7]/60 group-hover:bg-[#e879f9] transition-colors" />
        {label}
      </Link>
    );
  };

  return (
    <footer className="relative mt-auto bg-[#0c0418] overflow-hidden">
      {/* Subtle top gradient glow */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#d946ef]/60 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60vw] h-40 rounded-full bg-[#a855f7]/15 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* 3-column grid (RTL: first child renders on the right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Column 1 — Brand (right in RTL) */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="ماهان ارتباطات خردمنده"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <div>
                <p className="text-base font-bold text-gradient leading-tight">
                  {COMPANY_NAME}
                </p>
                <p className="text-xs text-violet-300/70 mt-0.5">
                  {COMPANY_SLOGAN}
                </p>
                <p className="text-[11px] text-violet-300/50 mt-1">
                  تجهیزات شبکه و راهکارهای ICT
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-violet-200/70 max-w-xs">
              ارائه‌دهنده تخصصی تجهیزات شبکه، امنیت، مجازی‌سازی و راهکارهای
              فناوری اطلاعات با گارانتی و پشتیبانی حرفه‌ای.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 mt-1">
              {[
                { Icon: Camera, label: 'اینستاگرام' },
                { Icon: Briefcase, label: 'لینکدین' },
                { Icon: Mail, label: 'ایمیل' },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-violet-200/80 hover:text-[#f0abfc] hover:border-[#e879f9]/40 transition-all duration-300 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick links (middle) */}
          <div className="md:px-4">
            <h3 className="text-sm font-bold text-[#f0abfc] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-gradient-to-l from-[#a855f7] to-[#e879f9]" />
              دسترسی سریع
            </h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact (left in RTL) */}
          <div>
            <h3 className="text-sm font-bold text-[#f0abfc] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-gradient-to-l from-[#a855f7] to-[#e879f9]" />
              تماس با ما
            </h3>

            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="tel:02191090702"
                  className="group inline-flex items-center gap-2.5 text-violet-200/80 hover:text-[#f0abfc] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#a855f7] group-hover:text-[#e879f9] transition-colors" />
                  <span className="nums">۰۲۱-۹۱۰۹۰۷۰۲</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:09386473626"
                  className="group inline-flex items-center gap-2.5 text-violet-200/80 hover:text-[#f0abfc] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#a855f7] group-hover:text-[#e879f9] transition-colors" />
                  <span>
                    <span className="nums">۰۹۳۸-۶۴۷-۳۶۲۶</span>{' '}
                    <span className="text-violet-300/50 text-xs">(فروش)</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:09104491267"
                  className="group inline-flex items-center gap-2.5 text-violet-200/80 hover:text-[#f0abfc] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#a855f7] group-hover:text-[#e879f9] transition-colors" />
                  <span>
                    <span className="nums">۰۹۱۰-۴۴۹-۱۲۶۷</span>{' '}
                    <span className="text-violet-300/50 text-xs">(پشتیبانی)</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@mahan-ic.ir"
                  className="group inline-flex items-center gap-2.5 text-violet-200/80 hover:text-[#f0abfc] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#a855f7] group-hover:text-[#e879f9] transition-colors shrink-0" />
                  <span dir="ltr">info@mahan-ic.ir</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-violet-200/70 pt-1">
                <Clock className="w-4 h-4 text-[#a855f7] shrink-0 mt-0.5" />
                <span>شنبه تا پنجشنبه، ۸ الی ۱۶</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — copyright with gradient top border */}
        <div className="relative mt-12 pt-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#2a1450] to-transparent" />
          <p className="text-center text-xs text-violet-300/60">
            © {year} {COMPANY_SLOGAN}. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
