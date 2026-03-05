## 2025-02-11 - Localize Static Assets
**Learning:** External assets (images, fonts) introduce network latency, DNS lookups, and reliability risks. Hosting them in `public/` is a low-effort, high-impact optimization.
**Action:** Scan for external URLs in CSS/Tailwind classes and move them to `public/`.

## 2025-02-11 - Tailwind Arbitrary Values & Turbopack
**Learning:** Tailwind arbitrary values with URLs (e.g., `bg-[url('/...')]`) can cause module resolution errors with Turbopack.
**Action:** Use inline styles for background images when using Turbopack or if you encounter build errors.

## 2025-02-12 - Form State Isolation
**Learning:** Calculators wrapped in components with expensive CSS (e.g., `backdrop-blur`) re-render unnecessarily on every keystroke if state is not isolated.
**Action:** Extract form state into a child component to prevent parent/wrapper re-renders.

## 2025-02-12 - Form State Isolation (Solar Panel Calculator)
**Learning:** Extracting form state from `SolarPanelCalculator` to `SolarPanelCalculatorForm` successfully isolated re-renders, preventing the expensive `backdrop-blur` container from repainting on every keystroke.
**Action:** Always check for stateful inputs inside expensive UI wrappers and extract them to dedicated client components.

## 2025-02-12 - Jest Node Environment Limitation
**Learning:** Jest is configured with `testEnvironment: 'node'`, preventing unit testing of React components (DOM access).
**Action:** Use Playwright for component testing or update Jest config to use `jsdom` if unit tests are required.

## 2025-02-20 - Server Components for Wrappers
**Learning:** Wrapper components (like `RocketCalculator`) that only render structure and static text should not be Client Components (`'use client'`). Converting them to Server Components reduces the JS bundle size and hydration cost, as their static content is sent as HTML.
**Action:** Audit component tree to remove unnecessary `'use client'` directives from parents that don't use hooks or event handlers.

## 2025-02-21 - Mathematical Constant Precomputation
**Learning:** Precomputing constants (e.g., `sqrt(GM)`) and simplifying algebraic expressions in hot paths (replacing `pow(r, 3)` with `r * sqrt(r)`) yielded an 84% performance improvement in orbital period calculations.
**Action:** Review utility functions for repeated constant calculations and algebraic simplifications, especially in physics formulas.

## 2025-02-22 - Code Splitting via Dynamic Imports in Server Components
**Learning:** Using `next/dynamic` to import Client Components into Server Components allows splitting the client-side bundle. This is particularly effective for components initially "below the fold" or secondary to the main user journey, even when `ssr: true` is used (preserving SEO/HTML content).
**Action:** Audit "below the fold" interactive components and use `dynamic` imports with a skeleton fallback to reduce the initial JavaScript bundle size.

## 2025-02-23 - Prioritized Code Splitting
**Learning:** Even components visible "above the fold" on large screens (like secondary calculators in a grid) benefit from dynamic imports if they are not the primary LCP element. This reduces the main bundle size and prioritizes hydration of the most critical interactive element.
**Action:** Audit component tree for secondary interactive elements and apply `next/dynamic` with `ssr: true` and skeleton loading states.

## 2025-02-24 - Optimized Background Images
**Learning:** Replacing inline CSS background images with `next/image` (using `fill` and `priority`) enables automatic format optimization (WebP/AVIF) and responsive resizing, significantly reducing payload size and improving LCP compared to raw static assets.
**Action:** Audit CSS `background-image` usage for large assets and replace with `next/image` components where possible.

## 2025-02-24 - Unused Next.js Google Fonts
**Learning:** Removing unused `next/font/google` imports (e.g., Geist) when the application relies on system fonts prevents Next.js from injecting redundant `@font-face` styles and preload tags, reducing HTML payload and network requests to improve FCP/LCP.
**Action:** Audit `layout.tsx` for unused `next/font/google` imports and font variable injections, and remove them if system fonts are the primary styling.

## 2025-02-24 - Precomputing Unit Conversions
**Learning:** Unit conversions (like `/ 1000` for meters to kilometers, or `/ 60` for seconds to minutes) applied at the end of hot-path physics calculations add unnecessary runtime division operations.
**Action:** Precompute combined constants (e.g., `(2 * PI / sqrt(GM)) / 60`) outside the function scope to eliminate unit conversion math during runtime calculation execution.

## 2025-03-05 - Domain-Scale Physics Computations
**Learning:** Converting inputs to standard base units (e.g. km to meters) on every function call adds redundant operations if the output is also expected in scaled units (km/s).
**Action:** Pre-scale all physical constants into the domain's input/output unit scale (e.g. Kilometers) to avoid runtime scaling multiplications.

## 2025-03-05 - Intl.NumberFormat Caching
**Learning:** Calling `.toLocaleString()` on numbers internally recreates the `Intl.NumberFormat` instance on every invocation. This is a known performance bottleneck in JS engines, making it roughly 35x slower than calling `.format()` on a cached `Intl.NumberFormat` instance.
**Action:** When repeatedly formatting numbers (e.g., in React renders or loops), instantiate `new Intl.NumberFormat` once outside the component/loop scope and reuse it.
