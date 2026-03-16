## 2025-03-10 - Refactored Curried Input Handlers
**Learning:** Returning a curried function in an event handler (e.g., `const handleInputChange = (setter) => (e) => setter(e.target.value)`) creates a new function closure on every single render cycle.
**Action:** Replace inline/curried event handlers with explicitly defined handler functions (e.g., `handleIspChange`, `handleCrewChange`) to prevent creating dynamic function closures on render and reduce garbage collection overhead.

## 2025-03-10 - Avoid `transition-all` with Expensive CSS Effects
**Learning:** Using Tailwind's `transition-all` forces the browser to check and potentially animate every single CSS property on state change (e.g., hover, focus). When combined with expensive effects like `backdrop-blur`, this can cause massive layout thrashing and severe performance drops during simple interactions.
**Action:** Use `transition` (which scopes to a safe, performant list like opacity, transform, colors) or specifically target the property (e.g., `transition-colors`, `transition-opacity`) instead of `transition-all`, especially on large container components.
## 2025-03-10 - Memoize Intl.NumberFormat.format() calls
**Learning:** While initializing `new Intl.NumberFormat()` is a known performance bottleneck that should be cached outside the component, calling `.format()` multiple times directly inside JSX on every keystroke can still cause redundant operations and performance overhead for frequently re-rendered components.
**Action:** Use `useMemo` hooks to memoize formatted string results and prevent redundant `.format()` calls when calculation results have not changed.

## 2025-03-15 - Optimize Low-Opacity Background Image Quality
**Learning:** Next.js `next/image` components default to a quality of `75`. For background textures or hero images that are rendered with low opacity (e.g., `opacity-30`) or strong blur, this default quality generates unnecessarily large WebP/AVIF files since visual compression artifacts are completely masked by the CSS effects.
**Action:** When adding or maintaining `next/image` components used purely for background textures or heavily filtered decorations, aggressively lower the `quality` prop (e.g., to `40`) to significantly reduce the bandwidth cost of the critical LCP payload.

## 2026-03-16 - Next.js Image Component Quality Optimization Pitfall
**Learning:** Explicitly lowering the `quality` prop (e.g., to `40`) on `next/image` components used for low-opacity background textures or heavily blurred decorations can significantly reduce the LCP payload size. However, if that specific quality isn't explicitly configured in `next.config.ts`'s `images.qualities` array, Next.js will return a 400 Bad Request error. This completely breaks the image rendering and defeats the optimization.
**Action:** When using a non-standard `quality` value (default is 75) in a `next/image` component to improve bandwidth cost, ALWAYS ensure that specific quality value (e.g., `40`) is added to the `images.qualities` array in `next.config.ts`. Also consider adding optimized formats like `['image/avif', 'image/webp']` to the `images.formats` configuration for maximum savings.
