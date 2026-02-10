## 2025-05-23 - [A11y] Missing Form Label Associations
**Learning:** Found multiple calculator components relying on visual proximity (divs) for labels instead of programmatic association (htmlFor/id). This breaks screen reader support.
**Action:** Always verify form inputs have explicit label associations or aria-labels, even in custom UI components.
