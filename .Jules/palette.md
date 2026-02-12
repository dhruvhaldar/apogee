## 2025-05-23 - [A11y] Missing Form Label Associations
**Learning:** Found multiple calculator components relying on visual proximity (divs) for labels instead of programmatic association (htmlFor/id). This breaks screen reader support.
**Action:** Always verify form inputs have explicit label associations or aria-labels, even in custom UI components.

## 2025-05-24 - [UX] Contextual Guidance for Technical Inputs
**Learning:** Users engaging with technical domains (like rocketry) benefit immensely from inline "typical values" (e.g., Isp ranges) directly in the UI, reducing the need to look up reference data.
**Action:** When designing for specialized fields, always include a brief "cheat sheet" or range hint near the input field.
