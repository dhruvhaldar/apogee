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
            // Disable DNS prefetching to protect user privacy (prevent leaking visited domains via DNS queries)
            value: 'off'
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
          },
          {
            key: 'Permissions-Policy',
            // Comprehensive list of disabled features for defense-in-depth
            // Enable clipboard-write=(self) to allow CopyButton functionality
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), autoplay=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), screen-wake-lock=(), display-capture=(), serial=(), hid=()'
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
