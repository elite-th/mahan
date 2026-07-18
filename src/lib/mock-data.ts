/**
 * Mock data for the Mahan website — standalone demo mode.
 *
 * No backend, no GraphQL, no external image URLs. All data lives here and
 * all images are inline SVG data URIs (generated procedurally). This lets
 * the site run with `npm run dev` without any .env configuration.
 *
 * To switch back to the real WooCommerce/GraphQL backend, restore the
 * Apollo queries in FeaturedProducts, products/page.tsx, and
 * product/[slug]/page.tsx (git history has the originals).
 */

import type { ProductNode, ClientLogo } from '@/types';

// ---------------------------------------------------------------------------
// SVG placeholder generator — returns a data URI for a product image.
// No raster files, no AI generation. Just a labeled panel.
// ---------------------------------------------------------------------------
function placeholderImage(label: string, hue: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="hsl(${hue}, 15%, 18%)"/>
    <rect x="0" y="0" width="600" height="450" fill="none" stroke="hsl(${hue}, 20%, 30%)" stroke-width="2"/>
    <text x="300" y="225" font-family="sans-serif" font-size="28" font-weight="600" fill="hsl(${hue}, 25%, 65%)" text-anchor="middle" dominant-baseline="middle">${label}</text>
    <text x="300" y="260" font-family="sans-serif" font-size="14" fill="hsl(${hue}, 15%, 45%)" text-anchor="middle" dominant-baseline="middle">تصویر نمونه</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function clientLogoSvg(name: string, hue: number): string {
  const initials = name.slice(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
    <rect width="200" height="80" fill="hsl(${hue}, 10%, 20%)"/>
    <circle cx="40" cy="40" r="20" fill="none" stroke="hsl(${hue}, 30%, 55%)" stroke-width="2"/>
    <text x="40" y="40" font-family="sans-serif" font-size="14" font-weight="700" fill="hsl(${hue}, 30%, 65%)" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <text x="75" y="40" font-family="sans-serif" font-size="13" font-weight="500" fill="hsl(${hue}, 15%, 70%)" text-anchor="start" dominant-baseline="middle">${name}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ---------------------------------------------------------------------------
// Mock products — 8 items, ICT/network equipment
// ---------------------------------------------------------------------------
export const MOCK_PRODUCTS: ProductNode[] = [
  {
    __typename: 'SimpleProduct',
    id: 'mock-1',
    databaseId: 101,
    name: 'سوئیچ سیسکو Catalyst 2960-24TT-L – 24 پورت گیکابیت',
    slug: 'cisco-catalyst-2960-24tt-l',
    description: 'سوئیچ مدیریتی سیسکو با ۲۴ پورت گیگابیت اترنت و دو پورت Uplink SFP. مناسب برای شبکه‌های کوچک و متوسط سازمانی.',
    displayPrice: '۸٬۵۰۰٬۰۰۰ تومان',
    price: '8500000',
    sku: 'WS-C2960-24TT-L',
    image: { sourceUrl: placeholderImage('Cisco 2960', 260), altText: 'سوئیچ سیسکو Catalyst 2960' },
    stockStatus: 'IN_STOCK',
    productCategories: { nodes: [{ name: 'سوئیچ شبکه', slug: 'switch' }] },
    metaData: [{ key: '_usd_price', value: '180' }],
  },
  {
    __typename: 'SimpleProduct',
    id: 'mock-2',
    databaseId: 102,
    name: 'روتر میکروتیک RB4011iGS+RM – 10 پورت گیگابیت',
    slug: 'mikrotik-rb4011igs-rm',
    description: 'روتر قدرتمند میکروتیک با پردازنده 4 هسته‌ای، ۱ گیگابایت RAM و ۱۰ پورت گیگابیت اترنت به همراه یک پورت SFP+.',
    displayPrice: '۶٬۲۰۰٬۰۰۰ تومان',
    price: '6200000',
    sku: 'RB4011iGS+RM',
    image: { sourceUrl: placeholderImage('Mikrotik RB4011', 200), altText: 'روتر میکروتیک RB4011' },
    stockStatus: 'IN_STOCK',
    productCategories: { nodes: [{ name: 'روتر', slug: 'router' }] },
    metaData: [{ key: '_usd_price', value: '130' }],
  },
  {
    __typename: 'SimpleProduct',
    id: 'mock-3',
    databaseId: 103,
    name: 'سرور اچ پی ProLiant DL380 Gen10 – ۲U رک',
    slug: 'hp-proliant-dl380-gen10',
    description: 'سرور سازمانی HP با دو پردازنده Intel Xeon Silver، 64 گیگابایت RAM و فضای ذخیره‌سازی SSD. مناسب برای مجازی‌سازی و دیتاسنتر.',
    displayPrice: '۹۵٬۰۰۰٬۰۰۰ تومان',
    price: '95000000',
    sku: 'P06475-B21',
    image: { sourceUrl: placeholderImage('HP DL380', 210), altText: 'سرور HP ProLiant DL380' },
    stockStatus: 'IN_STOCK',
    productCategories: { nodes: [{ name: 'سرور', slug: 'server' }] },
    metaData: [{ key: '_usd_price', value: '2000' }],
  },
  {
    __typename: 'SimpleProduct',
    id: 'mock-4',
    databaseId: 104,
    name: 'فایروال FortiGate 60F – امنیت شبکه',
    slug: 'fortigate-60f',
    description: 'فایروال نسل جدید FortiGate با توان 10 گیگابیت بر ثانیه، ۱۴ پورت و پشتیبانی از SD-WAN. محافظت یکپارچه برای شبکه‌های کوچک.',
    displayPrice: '۱۲٬۸۰۰٬۰۰۰ تومان',
    price: '12800000',
    sku: 'FG-60F',
    image: { sourceUrl: placeholderImage('FortiGate 60F', 0), altText: 'فایروال FortiGate 60F' },
    stockStatus: 'IN_STOCK',
    productCategories: { nodes: [{ name: 'امنیت شبکه', slug: 'security' }] },
    metaData: [{ key: '_usd_price', value: '270' }],
  },
  {
    __typename: 'SimpleProduct',
    id: 'mock-5',
    databaseId: 105,
    name: 'اکس‌پوینت Aruba AP-515 – وای‌فای 6',
    slug: 'aruba-ap-515',
    description: 'نقطه دسترسی Aruba با پشتیبانی Wi-Fi 6، توان 4.8 گیگابیت بر ثانیه و مدیریت ابری. مناسب برای محیط‌های متراکم.',
    displayPrice: '۷٬۴۰۰٬۰۰۰ تومان',
    price: '7400000',
    sku: 'JW813A',
    image: { sourceUrl: placeholderImage('Aruba AP-515', 280), altText: 'اکس‌پوینت Aruba AP-515' },
    stockStatus: 'IN_STOCK',
    productCategories: { nodes: [{ name: 'تجهیزات بی‌سیم', slug: 'wireless' }] },
    metaData: [{ key: '_usd_price', value: '155' }],
  },
  {
    __typename: 'SimpleProduct',
    id: 'mock-6',
    databaseId: 106,
    name: 'سوئیچ یوبی‌کوئیتی UniFi Switch Pro 24',
    slug: 'ubiquiti-unifi-switch-pro-24',
    description: 'سوئیچ یوبی‌کوئیتی با ۲۴ پورت گیگابیت و ۲ پورت 10G SFP+. مدیریت از طریق کنترلر UniFi.',
    displayPrice: '۹٬۱۰۰٬۰۰۰ تومان',
    price: '9100000',
    sku: 'USW-PRO-24',
    image: { sourceUrl: placeholderImage('UniFi Pro 24', 180), altText: 'سوئیچ UniFi Switch Pro 24' },
    stockStatus: 'OUT_OF_STOCK',
    productCategories: { nodes: [{ name: 'سوئیچ شبکه', slug: 'switch' }] },
    metaData: [{ key: '_usd_price', value: '190' }],
  },
  {
    __typename: 'SimpleProduct',
    id: 'mock-7',
    databaseId: 107,
    name: 'سرور دل PowerEdge R650 – ۱U رک',
    slug: 'dell-poweredge-r650',
    description: 'سرور Dell با پردازنده Intel Xeon Gold، ۱۲۸ گیگابایت RAM و RAID سخت‌افزاری. مناسب برای زیرساخت مجازی‌سازی.',
    displayPrice: '۱۱۰٬۰۰۰٬۰۰۰ تومان',
    price: '110000000',
    sku: 'R650',
    image: { sourceUrl: placeholderImage('Dell R650', 220), altText: 'سرور Dell PowerEdge R650' },
    stockStatus: 'IN_STOCK',
    productCategories: { nodes: [{ name: 'سرور', slug: 'server' }] },
    metaData: [{ key: '_usd_price', value: '2300' }],
  },
  {
    __typename: 'SimpleProduct',
    id: 'mock-8',
    databaseId: 108,
    name: 'روتر جونیپر SRX300 – امنیت + مسیریابی',
    slug: 'juniper-srx300',
    description: 'روتر/فایروال جونیپر با ۸ پورت گیگابیت، توان فایروال 1 گیگابیت بر ثانیه و پشتیبانی از IPsec VPN.',
    displayPrice: '۸٬۹۰۰٬۰۰۰ تومان',
    price: '8900000',
    sku: 'SRX300',
    image: { sourceUrl: placeholderImage('Juniper SRX300', 30), altText: 'روتر جونیپر SRX300' },
    stockStatus: 'IN_STOCK',
    productCategories: { nodes: [{ name: 'روتر', slug: 'router' }] },
    metaData: [{ key: '_usd_price', value: '185' }],
  },
];

// ---------------------------------------------------------------------------
// Mock clients — 6 items with inline SVG logos
// ---------------------------------------------------------------------------
export const MOCK_CLIENTS: ClientLogo[] = [
  { id: 'c1', name: 'سازمان فناوری', logoUrl: clientLogoSvg('سازمان فناوری', 260) },
  { id: 'c2', name: 'بانک توسعه', logoUrl: clientLogoSvg('بانک توسعه', 200) },
  { id: 'c3', name: 'گروه صنعتی پارس', logoUrl: clientLogoSvg('گروه صنعتی پارس', 30) },
  { id: 'c4', name: 'دانشگاه تهران', logoUrl: clientLogoSvg('دانشگاه تهران', 0) },
  { id: 'c5', name: 'شرکت بیمه ایران', logoUrl: clientLogoSvg('بیمه ایران', 280) },
  { id: 'c6', name: 'هلدینگ آریا', logoUrl: clientLogoSvg('هلدینگ آریا', 180) },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getMockProductBySlug(slug: string): ProductNode | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(count: number = 4): ProductNode[] {
  return MOCK_PRODUCTS.slice(0, count);
}
