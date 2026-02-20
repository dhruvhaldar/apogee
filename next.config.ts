import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false, // Prevents exposing X-Powered-By: Next.js
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            // Refined CSP: removed 'unsafe-eval' from script-src
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.transparenttextures.com; font-src 'self' data:; connect-src 'self';"
          },
          {
            key: 'Permissions-Policy',
            // Comprehensive list of disabled features for defense-in-depth
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), autoplay=(), clipboard-read=(), clipboard-write=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), screen-wake-lock=()'
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
