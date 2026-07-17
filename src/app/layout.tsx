import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { COMPANY_NAME, COMPANY_SLOGAN, SITE_URL } from "@/constants";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import ScrollToHash from "@/components/ScrollToHash";

const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  display: 'swap',
  variable: '--font-vazirmatn',
  weight: "100 900",
});

// IBM Plex Sans Arabic — secondary font for Latin text / numerals
// (Google Fonts). Vazirmatn remains the primary self-hosted font.
const plex = IBM_Plex_Sans_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-plex',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: COMPANY_SLOGAN,
    template: `%s | ${COMPANY_SLOGAN}`,
  },
  description: `خرید آنلاین تجهیزات شبکه از ${COMPANY_SLOGAN}؛ سوئیچ سیسکو، روتر، تجهیزات دیتاسنتر و خدمات امنیت شبکه، مجازی‌سازی، SD-WAN و ایمیل سرور با گارانتی و پشتیبانی تخصصی.`,
  keywords: [
    'تجهیزات شبکه', 'سوئیچ سیسکو', 'خرید سوئیچ سیسکو', 'روتر سیسکو',
    'تجهیزات دیتاسنتر', 'امنیت شبکه', 'مجازی‌سازی', 'SD-WAN', 'ایمیل سرور',
    'واردات تجهیزات شبکه', 'راهکار فناوری اطلاعات', 'ICT',
    COMPANY_SLOGAN, COMPANY_NAME,
  ],
  applicationName: COMPANY_SLOGAN,
  authors: [{ name: COMPANY_SLOGAN, url: SITE_URL }],
  creator: COMPANY_SLOGAN,
  publisher: COMPANY_SLOGAN,
  category: 'technology',
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  alternates: {
    canonical: '/',
    languages: { 'fa-IR': '/' },
  },
  openGraph: {
    type: 'website', locale: 'fa_IR', url: SITE_URL, siteName: COMPANY_SLOGAN,
    title: `${COMPANY_NAME} | ${COMPANY_SLOGAN} - تجهیزات شبکه و راهکارهای ICT`,
    description: `خرید آنلاین تجهیزات شبکه از ${COMPANY_SLOGAN}؛ سوئیچ سیسکو، روتر، تجهیزات دیتاسنتر و خدمات تخصصی شبکه با گارانتی.`,
    images: [{ url: '/og-image.png', width: 1344, height: 768, alt: `${COMPANY_SLOGAN} - تجهیزات شبکه و راهکارهای فناوری اطلاعات` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY_NAME} | ${COMPANY_SLOGAN}`,
    description: `خرید آنلاین تجهیزات شبکه؛ سوئیچ سیسکو، روتر و راهکارهای تخصصی ICT.`,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.png' }, { url: '/favicon.png', sizes: 'any' }],
    apple: '/favicon.png',
  },
  manifest: '/manifest.webmanifest',
  other: {
    'geo.region': 'IR-07',
    'geo.placename': 'تهران، شمیرانات، تجریش',
    'language': 'Persian',
    'format-detection': 'telephone=yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c0418',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the CSP nonce set by middleware — Next.js automatically applies it
  // to internal <script> and <style> tags via getScriptNonceFromHeader()
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${plex.variable}`} suppressHydrationWarning data-scroll-behavior="smooth" nonce={nonce}>
      <body className="bg-[#0c0418] text-purple-100">
        {/* Organization + LocalBusiness structured data — applied site-wide */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
        {/* FIX: Moved ApolloWrapper to the root layout to wrap all client-side providers. This resolves a component composition error by establishing a clear boundary between Server and Client Components and ensuring the Apollo Client is available to the entire application. */}
        <ApolloWrapper>
          <div className="flex flex-col min-h-screen">
            <Providers>
              <Header />
              <main className="flex-grow pt-20">{children}</main>
              <Footer />
            </Providers>
          </div>
          {/* Handles cross-page anchor scrolling (e.g. /products → /#contact) */}
          <ScrollToHash />
        </ApolloWrapper>
      </body>
    </html>
  );
}
