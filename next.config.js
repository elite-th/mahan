/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  poweredByHeader: false,

  // Product images are served from the WordPress media library.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'wordpress.vna-co.ir' },
      { protocol: 'https', hostname: 'vna-co.ir' },
    ],
  },

  // isomorphic-dompurify pulls in jsdom, which loads a bundled CSS file
  // (`browser/default-stylesheet.css`) via a runtime path. Webpack rewrites
  // file paths inside node_modules, breaking that lookup and throwing
  // ENOENT on the server. Keeping it external makes Node load it directly.
  serverExternalPackages: ['isomorphic-dompurify'],

  trailingSlash: true,
};

export default nextConfig;
