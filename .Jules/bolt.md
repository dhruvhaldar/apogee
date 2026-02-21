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
