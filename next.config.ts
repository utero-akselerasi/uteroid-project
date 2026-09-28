import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
