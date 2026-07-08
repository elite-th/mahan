/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  poweredByHeader: false,

  // NOTE: The www → non-www redirect is handled in src/middleware.ts (NOT here).
  //
  // WHY: When defined in next.config.js `redirects()`, Next.js strips the
  // trailing slash during the www → non-www redirect, which then triggers
  // ANOTHER redirect from `trailingSlash: true` to re-append the slash.
  // This creates a 3-hop redirect chain:
  //   www.x.com/p/slug/ → x.com/p/slug → x.com/p/slug/ → 200
  // Torob (and some other crawlers) treat 3+ redirects as TooManyRedirects
  // and fail to index product pages.
  //
  // Moving the redirect to middleware lets us preserve the trailing slash
  // in a single hop: www.x.com/p/slug/ → x.com/p/slug/ → 200.

  // isomorphic-dompurify pulls in jsdom, which loads a bundled CSS file
  // (`browser/default-stylesheet.css`) via a runtime path. Webpack rewrites
  // file paths inside node_modules, breaking that lookup and throwing
  // ENOENT on the server. Keeping it external makes Node load it directly.
  serverExternalPackages: ['isomorphic-dompurify'],

  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trustseal.enamad.ir',
      },
      {
        protocol: 'http',
        hostname: 'vira.local',
      },
      {
        protocol: 'https',
        hostname: 'vira.local',
      },
      {
        protocol: 'http',
        hostname: 'new.vna-co.ir',
      },
      {
        protocol: 'https',
        hostname: 'new.vna-co.ir',
      },
      {
        protocol: 'http',
        hostname: 'wordpress.vna-co.ir',
      },
      {
        protocol: 'https',
        hostname: 'wordpress.vna-co.ir',
      },
      {
        protocol: 'http',
        hostname: 'vna-co.ir',
      },
      {
        protocol: 'https',
        hostname: 'vna-co.ir',
      },
      // Allow all subdomains of common image CDNs
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: '**.woocommerce.com',
      },
    ],
  },
};

export default nextConfig;