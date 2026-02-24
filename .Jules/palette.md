## 2025-05-23 - [A11y] Missing Form Label Associations
**Learning:** Found multiple calculator components relying on visual proximity (divs) for labels instead of programmatic association (htmlFor/id). This breaks screen reader support.
**Action:** Always verify form inputs have explicit label associations or aria-labels, even in custom UI components.

## 2025-05-24 - [UX] Contextual Guidance for Technical Inputs
**Learning:** Users engaging with technical domains (like rocketry) benefit immensely from inline "typical values" (e.g., Isp ranges) directly in the UI, reducing the need to look up reference data.
**Action:** When designing for specialized fields, always include a brief "cheat sheet" or range hint near the input field.

## 2025-05-24 - [A11y] Helper Text Association
**Learning:** Technical inputs often have helper text (ranges, examples) that is visually close but programmatically disconnected. Screen reader users miss this crucial context.
**Action:** Use `aria-describedby` to link inputs to their helper text, and use `peer-focus` to visually highlight the help text when the user is focused on the input.

## 2025-05-24 - [UX] Keyboard Submission for Calculators
**Learning:** Users expect to submit forms by pressing "Enter", especially in calculator-like interfaces where speed matters. Relying solely on `onClick` handlers breaks this expectation.
**Action:** Always wrap inputs and submit buttons in a semantic `<form>` element with an `onSubmit` handler to enable native keyboard submission.

## 2025-05-25 - [UX] Consistent Contextual Guidance
**Learning:** Inconsistent application of helper text (present in some calculators, missing in others like Solar Panel) creates a disjointed experience. Users rely on these "cheat sheets" for unfamiliar metrics like Watts.
**Action:** Audit all similar input fields across the application to ensure consistent presence of helper text with typical values, reinforced by `aria-describedby`.

## 2025-05-26 - [A11y] Dynamic Result Announcements
**Learning:** Calculator results that appear dynamically without page reload are invisible to screen readers unless explicitly announced.
**Action:** Wrap result containers in `aria-live="polite"` and `aria-atomic="true"` to ensure users are notified when a calculation completes.

## 2025-05-27 - [UX] Reusable Copy Result Pattern
**Learning:** In data-heavy applications (like mission planning), users frequently need to transfer calculation results to other tools. Manually selecting and copying text is error-prone and tedious.
**Action:** Implement a reusable `CopyButton` component for all result displays, providing immediate visual feedback (checkmark) and accessible announcements to streamline the workflow.
