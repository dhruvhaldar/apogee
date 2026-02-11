## 2025-02-11 - Localize Static Assets
**Learning:** External assets (images, fonts) introduce network latency, DNS lookups, and reliability risks. Hosting them in `public/` is a low-effort, high-impact optimization.
**Action:** Scan for external URLs in CSS/Tailwind classes and move them to `public/`.

## 2025-02-11 - Tailwind Arbitrary Values & Turbopack
**Learning:** Tailwind arbitrary values with URLs (e.g., `bg-[url('/...')]`) can cause module resolution errors with Turbopack.
**Action:** Use inline styles for background images when using Turbopack or if you encounter build errors.
