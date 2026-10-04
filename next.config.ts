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
};

export default nextConfig;
