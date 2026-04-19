import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Enable modern formats
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
