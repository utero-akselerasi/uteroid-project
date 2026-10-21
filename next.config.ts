import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits .next/standalone with a minimal server.js + only the traced
  // node_modules, so the Docker runtime stage needs no npm install.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.youtube-nocookie.com",
      },
      {
        protocol: "https",
        hostname: "player.vimeo.com",
      },
      {
        // Signed article/OG images from CMS Artikel storage. The URLs carry
        // a token and expire after 3600s, so next/image must be allowed to
        // fetch them but must not be asked to cache them for longer.
        protocol: "https",
        hostname: "supabase.carubra.com",
      },
    ],
    // Keep the optimizer's cache under the signed-URL lifetime.
    minimumCacheTTL: 300,
  },
  allowedDevOrigins: ['127.0.0.1'],
  async redirects() {
    return [
      // Redirect old short slugs to new full-name-based route slugs
      { source: '/work/garageplug', destination: '/work/garageplug-indonesia', permanent: true },
      { source: '/work/mcc', destination: '/work/malang-creative-center', permanent: true },
      { source: '/work/stamford', destination: '/work/stamford-indonesia-fc', permanent: true },
      { source: '/work/chatten', destination: '/work/chatten-cafe', permanent: true },
      { source: '/work/sfi', destination: '/work/startup-for-industry-sfi', permanent: true },
      { source: '/work/jmt', destination: '/work/jmt-juaranya-makan-terenak', permanent: true },
      { source: '/work/lacamino', destination: '/work/lacamino-cigar', permanent: true },
      { source: '/work/techlink', destination: '/work/techlink-summit-2024', permanent: true },
      { source: '/work/proxon', destination: '/work/pt-proxima-omnia-strategy-proxon', permanent: true },
      { source: '/work/kiyona', destination: '/work/kiyona-beauty', permanent: true },
      { source: '/work/uwg', destination: '/work/universitas-widyagama', permanent: true },
      { source: '/work/rohani', destination: '/work/keripik-tempe-rohani-malang', permanent: true },
      { source: '/work/gsm-1922', destination: '/work/kopi-1922', permanent: true },
      { source: '/work/boop', destination: '/work/boop-premium-pet-food', permanent: true },
      { source: '/work/maitri', destination: '/work/maitri-coffee-and-social-hub', permanent: true },
      { source: '/work/satu-titik', destination: '/work/satu-titik-coffee', permanent: true },
      { source: '/work/wismari', destination: '/work/wismari-sign-system', permanent: true },
      { source: '/work/logo-73-indonesia', destination: '/work/73-tahun-indonesia-merdeka', permanent: true },
      { source: '/work/latobas-cigar', destination: '/work/la-tobas-cigar', permanent: true },
    ];
  },
};

export default nextConfig;
