"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, COMPANY_NAME, COMPANY_SLOGAN } from '../constants';

/**
 * Footer — anti-slop redesign (v3).
 *
 * Removed (AI slop):
 *  - Top gradient hairline (`bg-gradient-to-l from-transparent via-orchid to-transparent`)
 *  - Big blurred glow blob (`blur-[100px] bg-violet/15`)
 *  - `text-gradient` on the brand name
 *  - Social icon circles with `.glass` + hover gradient border (placeholders for
 *    Instagram/LinkedIn that don't exist — pure filler)
 *  - Gradient hairline accents next to column headings (`bg-gradient-to-l from-violet to-orchid`)
 *  - Gradient bottom border
 *  - `hover:scale` / `group-hover` color transitions on every link's dot
 *
 * Replaced with: a quiet 3-column footer with solid 1px top border, plain
 * text links, and a single centered copyright line. No glow, no gradients.
 */
const Footer: React.FC = () => {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  const renderLink = (href: string, label: string) => {
    const className = "text-sm text-[#CFC6E0] transition-colors hover:text-[#FBF7FE]";
    if (href.startsWith('/#') && pathname !== '/') {
      return (
        <a href={href} className={className}>
          {label}
        </a>
      );
    }
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <footer className="mt-auto border-t border-[#3A3150] bg-[#110E18]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Column 1 — Brand (right in RTL) */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="ماهان ارتباطات خردمنده"
                width={36}
                height={36}
                className="h-9 w-auto"
              />
              <div>
                <p className="text-sm font-semibold text-[#FBF7FE] leading-tight">
                  {COMPANY_NAME}
                </p>
                <p className="text-xs text-[#9D94B5] mt-0.5">
                  {COMPANY_SLOGAN}
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-[#CFC6E0] max-w-xs">
              واردات و تأمین تخصصی تجهیزات شبکه و زیرساخت ICT
              برای سازمان‌های دولتی و خصوصی.
            </p>
          </div>

          {/* Column 2 — Quick links (middle) */}
          <div className="md:px-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#CFC6E0] mb-4">
              دسترسی سریع
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact (left in RTL) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#CFC6E0] mb-4">
              تماس با ما
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href="tel:02191090702"
                  className="inline-flex items-center gap-2 text-[#CFC6E0] transition-colors hover:text-[#FBF7FE]"
                >
                  <Phone className="h-4 w-4 text-[#9D94B5]" />
                  <span className="nums">۰۲۱-۹۱۰۹۰۷۰۲</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:09386473626"
                  className="inline-flex items-center gap-2 text-[#CFC6E0] transition-colors hover:text-[#FBF7FE]"
                >
                  <Phone className="h-4 w-4 text-[#9D94B5]" />
                  <span>
                    <span className="nums">۰۹۳۸-۶۴۷-۳۶۲۶</span>{' '}
                    <span className="text-[#9D94B5] text-xs">(فروش)</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:09104491267"
                  className="inline-flex items-center gap-2 text-[#CFC6E0] transition-colors hover:text-[#FBF7FE]"
                >
                  <Phone className="h-4 w-4 text-[#9D94B5]" />
                  <span>
                    <span className="nums">۰۹۱۰-۴۴۹-۱۲۶۷</span>{' '}
                    <span className="text-[#9D94B5] text-xs">(پشتیبانی)</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@mahan-ic.ir"
                  className="inline-flex items-center gap-2 text-[#CFC6E0] transition-colors hover:text-[#FBF7FE] break-all"
                >
                  <Mail className="h-4 w-4 text-[#9D94B5] shrink-0" />
                  <span dir="ltr">info@mahan-ic.ir</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-[#CFC6E0] pt-1">
                <Clock className="h-4 w-4 text-[#9D94B5]" />
                <span>شنبه تا پنجشنبه، ۸ الی ۱۶</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — plain, single line */}
        <div className="mt-10 pt-6 border-t border-[#3A3150]">
          <p className="text-center text-xs text-[#9D94B5]">
            © {year} {COMPANY_SLOGAN}. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
