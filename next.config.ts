import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/uk-passport-photo",
        destination: "/tool/uk-passport-photo",
        permanent: true,
      },
      {
        source: "/passport-renewal-photo-online",
        destination: "/tool/passport-renewal-photo-online",
        permanent: true,
      },
      {
        source: "/uk-baby-passport-photo",
        destination: "/tool/uk-baby-passport-photo",
        permanent: true,
      },
      {
        source: "/uk-driving-licence-photo",
        destination: "/tool/uk-driving-licence-photo",
        permanent: true,
      },
      {
        source: "/driving-licence-photo",
        destination: "/tool/uk-driving-licence-photo",
        permanent: true,
      },
      {
        source: "/us-visa-photo",
        destination: "/tool/us-visa-photo-tool",
        permanent: true,
      },
      {
        source: "/us-visa-photo-tool",
        destination: "/tool/us-visa-photo-tool",
        permanent: true,
      },
      {
        source: "/schengen-visa-photo",
        destination: "/tool/schengen-visa-photo",
        permanent: true,
      },
      {
        source: "/indian-passport-photo",
        destination: "/tool/indian-passport-photo-maker",
        permanent: true,
      },
      {
        source: "/indian-passport-photo-maker",
        destination: "/tool/indian-passport-photo-maker",
        permanent: true,
      },
      {
        source: "/digital-passport-photo",
        destination: "/tool/digital-passport-photo",
        permanent: true,
      },
      {
        source: "/photo-size-35x45mm",
        destination: "/tool/photo-size-35x45mm",
        permanent: true,
      },
      {
        source: "/image-to-passport-size-converter",
        destination: "/tool/image-to-passport-size-converter",
        permanent: true,
      },
      {
        source: "/passport-photo-at-home",
        destination: "/tool/passport-photo-at-home",
        permanent: true,
      },
      {
        source: "/passport-photo-tool",
        destination: "/tool/passport-photo-tool",
        permanent: true,
      },
      {
        source: "/online-id-photo-maker",
        destination: "/tool/online-id-photo-maker",
        permanent: true,
      },
      {
        source: "/order-passport-photos-online",
        destination: "/tool/order-passport-photos-online",
        permanent: true,
      },
      {
        source: "/passport-size-photo-online",
        destination: "/passport-size-photo-maker",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/pixpassport.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icon.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/apple-icon.jpg",
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

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
