## 2025-05-23 - [A11y] Missing Form Label Associations
**Learning:** Found multiple calculator components relying on visual proximity (divs) for labels instead of programmatic association (htmlFor/id). This breaks screen reader support.
**Action:** Always verify form inputs have explicit label associations or aria-labels, even in custom UI components.

## 2025-05-24 - [UX] Contextual Guidance for Technical Inputs
**Learning:** Users engaging with technical domains (like rocketry) benefit immensely from inline "typical values" (e.g., Isp ranges) directly in the UI, reducing the need to look up reference data.
**Action:** When designing for specialized fields, always include a brief "cheat sheet" or range hint near the input field.

## 2025-05-24 - [A11y] Helper Text Association
**Learning:** Technical inputs often have helper text (ranges, examples) that is visually close but programmatically disconnected. Screen reader users miss this crucial context.
**Action:** Use `aria-describedby` to link inputs to their helper text, and use `peer-focus` to visually highlight the help text when the user is focused on the input.

## 2026-02-18 - [UX/A11y] Native Form Behavior
**Learning:** Calculator components implemented as `div` wrappers miss out on native browser behaviors like "Enter to submit". This forces users to switch from keyboard to mouse unnecessarily.
**Action:** Always wrap input groups in a semantic `<form>` element with an `onSubmit` handler, even for client-side calculations, to enable natural keyboard workflows.
