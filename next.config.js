/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  poweredByHeader: false,

  // Mock mode: disable next/image optimization so data-URI SVGs and any
  // inline placeholder images pass through without hostname configuration.
  // Re-enable optimization + configure remotePatterns when switching back
  // to the real WooCommerce backend (product images served from
  // wordpress.mahan-ic.ir).
  images: {
    unoptimized: true,
  },

  // isomorphic-dompurify pulls in jsdom, which loads a bundled CSS file
  // (`browser/default-stylesheet.css`) via a runtime path. Webpack rewrites
  // file paths inside node_modules, breaking that lookup and throwing
  // ENOENT on the server. Keeping it external makes Node load it directly.
  serverExternalPackages: ['isomorphic-dompurify'],

  trailingSlash: true,
};

export default nextConfig;
