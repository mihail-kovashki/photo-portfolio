import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Disable runtime image optimization since all photos are already pre-scaled
    // (display: 2048px, thumb: 600px) and compressed offline during ingestion.
    // This avoids consuming Vercel's free-tier limit of 1,000 image optimizations/mo.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      }
    ],
  },
  // Aggressive immutable caching for static photography assets
  async headers() {
    return [
      {
        source: "/photos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
