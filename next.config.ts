import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaiminmodiphotography.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com",   pathname: "/**" },
      // Supabase storage — replace YOUR_PROJECT_REF with your actual project ref
      { protocol: "https", hostname: "*.supabase.co",          pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "*.supabase.in",          pathname: "/storage/v1/object/public/**" },
    ],
    formats: ["image/avif", "image/webp"],
    // Improve LCP (Largest Contentful Paint) — Core Web Vital
    minimumCacheTTL: 3600,
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256],
  },

  // HTTP headers for security + performance (helps Core Web Vitals → SEO)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          {
            key:   "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|gif|woff2|woff|ttf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Canonical redirect hint for crawlers
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
        ],
      },
    ];
  },

  // Canonical redirect: non-www → www (or vice versa, whichever you use)
  async redirects() {
    const isWww = SITE_URL.includes("www.");
    if (isWww) {
      return [
        {
          source:      "/:path*",
          has:         [{ type: "host", value: SITE_URL.replace("https://www.", "") }],
          destination: `${SITE_URL}/:path*`,
          permanent:   true,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
