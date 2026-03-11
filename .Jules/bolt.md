## 2025-03-10 - Refactored Curried Input Handlers
**Learning:** Returning a curried function in an event handler (e.g., `const handleInputChange = (setter) => (e) => setter(e.target.value)`) creates a new function closure on every single render cycle.
**Action:** Replace inline/curried event handlers with explicitly defined handler functions (e.g., `handleIspChange`, `handleCrewChange`) to prevent creating dynamic function closures on render and reduce garbage collection overhead.

## 2025-03-10 - Avoid `transition-all` with Expensive CSS Effects
**Learning:** Using Tailwind's `transition-all` forces the browser to check and potentially animate every single CSS property on state change (e.g., hover, focus). When combined with expensive effects like `backdrop-blur`, this can cause massive layout thrashing and severe performance drops during simple interactions.
**Action:** Use `transition` (which scopes to a safe, performant list like opacity, transform, colors) or specifically target the property (e.g., `transition-colors`, `transition-opacity`) instead of `transition-all`, especially on large container components.
## 2025-03-10 - Memoize Intl.NumberFormat.format() calls
**Learning:** While initializing `new Intl.NumberFormat()` is a known performance bottleneck that should be cached outside the component, calling `.format()` multiple times directly inside JSX on every keystroke can still cause redundant operations and performance overhead for frequently re-rendered components.
**Action:** Use `useMemo` hooks to memoize formatted string results and prevent redundant `.format()` calls when calculation results have not changed.
