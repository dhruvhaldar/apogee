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
