import { NavLink } from './types';

export const COMPANY_NAME = "ویرا";
export const COMPANY_SLOGAN = "ویرا شبکه آران";

/** Canonical production origin — single source of truth for the domain. */
export const SITE_URL = 'https://vna-co.ir';

export const NAV_LINKS: NavLink[] = [
  { label: "صفحه اصلی", href: "/#hero" },
  { label: "محصولات", href: "/products" },
  { label: "خدمات", href: "/solutions" }, // URL path kept as /solutions for SEO/bookmark compatibility
  { label: "درباره ما", href: "/#about" },
  { label: "مشتریان ما", href: "/#clients" },
  { label: "سوالات متداول", href: "/#faq" },
  { label: "تماس با ما", href: "/#contact" },
];
