## 2025-02-11 - Localize Static Assets
**Learning:** External assets (images, fonts) introduce network latency, DNS lookups, and reliability risks. Hosting them in `public/` is a low-effort, high-impact optimization.
**Action:** Scan for external URLs in CSS/Tailwind classes and move them to `public/`.

## 2025-02-11 - Tailwind Arbitrary Values & Turbopack
**Learning:** Tailwind arbitrary values with URLs (e.g., `bg-[url('/...')]`) can cause module resolution errors with Turbopack.
**Action:** Use inline styles for background images when using Turbopack or if you encounter build errors.

## 2025-02-12 - State Isolation for Calculator Wrappers
**Learning:** Calculator components used a wrapper (`CalculatorCard`) that re-rendered on every keystroke because the state was in the parent component. This caused unnecessary VDOM diffing for the static wrapper.
**Action:** Isolate stateful logic into a child component (e.g., `RocketContent`) so the parent wrapper remains static and never re-renders.
