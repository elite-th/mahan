"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, COMPANY_NAME } from '../constants';

const Footer: React.FC = () => {
  const pathname = usePathname();

  // To ensure symmetry, we'll find the "Products" link and place it in the middle.
  const productsLink = NAV_LINKS.find(link => link.href === '/products');
  const otherLinks = NAV_LINKS.filter(link => link.href !== '/products');

  // Split the remaining links into two halves for symmetrical placement
  const middleIndex = Math.ceil(otherLinks.length / 2);
  const firstHalf = otherLinks.slice(0, middleIndex);
  const secondHalf = otherLinks.slice(middleIndex);

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Footer">
          <ul className="flex justify-center items-center flex-wrap gap-x-6 gap-y-3 text-gray-300">
            {firstHalf.map((link) => (
              <li key={link.href}>
                {link.href.startsWith('/#') && pathname !== '/' ? (
                  <a
                    href={link.href}
                    className="text-base hover:text-sky-400 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="text-base hover:text-sky-400 transition-colors duration-300">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

            {productsLink && (
              <li key={productsLink.href}>
                <Link href={productsLink.href} className="text-base text-sky-300 pb-1 border-b-2 border-sky-500 hover:border-sky-400 transition-colors duration-300">
                  {productsLink.label}
                </Link>
              </li>
            )}

            {secondHalf.map((link) => (
              <li key={link.href}>
                {link.href.startsWith('/#') && pathname !== '/' ? (
                  <a
                    href={link.href}
                    className="text-base hover:text-sky-400 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="text-base hover:text-sky-400 transition-colors duration-300">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Phone numbers */}
        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-6 text-sm">
          <a
            href="tel:02191090702"
            className="inline-flex items-center gap-1.5 text-gray-300 hover:text-sky-400 transition-colors nums"
          >
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            ۰۲۱-۹۱۰۹۰۷۰۲
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="tel:09386473626"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-sky-400 transition-colors nums"
          >
            ۰۹۳۸-۶۴۷-۳۶۲۶ (فروش)
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="tel:09104491267"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-sky-400 transition-colors nums"
          >
            ۰۹۱۰-۴۴۹-۱۲۶۷ (پشتیبانی)
          </a>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <a
            referrerPolicy="origin"
            target="_blank"
            rel="noopener noreferrer"
            href="https://trustseal.enamad.ir/?id=530371&Code=0WOusqNH4Zhz3zApHjSbtsXev7ONDoSV"
          >
            <Image
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=530371&Code=0WOusqNH4Zhz3zApHjSbtsXev7ONDoSV"
              alt="نماد اعتماد الکترونیکی (اینماد) ویرا شبکه آران"
              width={120}
              height={120}
              loading="lazy"
              className="cursor-pointer"
              unoptimized
            />
          </a>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {COMPANY_NAME}. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
