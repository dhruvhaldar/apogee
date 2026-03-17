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

## 2025-05-28 - [UX] Input Unit Suffixes
**Learning:** Technical inputs with external unit labels (e.g., "Mass (kg)") can be ambiguous or overlooked. Placing units directly inside the input field as a suffix reinforces context and prevents errors.
**Action:** Use a relative wrapper with an absolute-positioned suffix for units, and hide browser-default spinners to prevent visual clutter and overlap.

## 2025-05-29 - [A11y] Visible Keyboard Focus States on Primary Actions
**Learning:** Submit buttons within calculator forms lacked clear `focus-visible` styles. Keyboard users tabbing through the form couldn't easily determine when the primary action (Calculate) was focused, leading to potential accidental submissions or confusion.
**Action:** Always ensure interactive elements, especially primary action buttons, have distinct `focus-visible` states. Use `focus-visible:ring` with a context-appropriate color to match the component's theme.

## 2025-05-30 - [UX] Input Currency Prefixes and Tailwind `peer`
**Learning:** When adding inline currency prefixes (e.g., "$") to inputs, placing the prefix element *after* the input in the DOM is crucial for Tailwind's `peer-focus` utility to work. If placed before, the prefix cannot react to the input's focus state.
**Action:** Always structure relative input wrappers with the `<input className="peer ...">` first, followed by the absolute positioned prefix/suffix div using `peer-focus:text-color` to visually link them during interaction. Ensure the input has adequate padding (e.g., `pl-7` for a prefix) to prevent text overlap.

## 2025-05-31 - [UX] HTML5 Validation for Float Inputs
**Learning:** Float numeric inputs without `step="any"` will trigger native HTML5 validation errors ("Please enter a valid value") when users input decimals, completely blocking form submission.
**Action:** Always add `step="any"` to numeric inputs that represent floating-point measurements (e.g., kilograms, seconds, altitudes) to ensure users aren't incorrectly blocked by the browser.

## 2025-06-01 - [A11y] Tailwind `peer-focus` and Input Helper Text Alignment
**Learning:** Tailwind's `peer-focus` relies on the CSS general sibling combinator (`~`), meaning it only targets elements that are true siblings of the `peer`. When an `<input className="peer">` is wrapped in a `div.relative` to support unit adornments, any helper text placed outside that wrapper will fail to receive focus styles. Moving the `<p>` inside the wrapper fixes this but causes issues with adornment vertical centering if `inset-y-0` is used.
**Action:** Always place the helper text `<p>` inside the relative wrapper so it's a sibling of the input, and use explicit absolute top positioning (e.g., `top-2.5`) for the unit adornment instead of `inset-y-0 flex items-center` to avoid the adornment centering vertically across both the input and the helper text.

## 2025-06-02 - [A11y] Form Fields Missing Required Indicator
**Learning:** Calculator form fields lacked the `required` attribute. Without it, users could submit empty values, leading to unexpected application errors (`NaN` values causing component crashes or generic JS alerts) instead of native, accessible browser validation. Screen readers also did not announce the inputs as required.
**Action:** Always add the `required` attribute to all input fields that are strictly necessary for form submission. This enables HTML5 native validation and implicitly sets `aria-required="true"`.

## 2026-03-07 - [A11y/UX] Semantic Regions and Thematic Consistency
**Learning:** Card components representing distinct calculators lacked semantic structure (using generic `div` tags) and failed to visually reinforce their themes. This led to a disjointed visual hierarchy and poor screen reader navigation.
**Action:** Always wrap distinct sections in semantic tags (e.g., `<section>`) and use `aria-labelledby` linked to the section title (via `useId`) to create clear landmarks for assistive technologies. Additionally, allow title colors to be customized to match the theme of the component's interactive elements for better visual cohesion.

## 2026-03-09 - Input Focus Visibility on Dark Backgrounds
**Learning:** Relying solely on a 1px border color change (`focus:border-<color>`) on a dark/black background can lead to poor visibility of the focus indicator, making it difficult for keyboard users to navigate forms. The contrast between a thin border and a dark background is often insufficient for clear visual feedback.
**Action:** Always combine border color changes with a focus ring (`focus:ring-2 focus:ring-<color>/40`) to create a more prominent, glowing focus state that is clearly visible against dark backgrounds. Additionally, adding a subtle hover state (`hover:border-white/40`) improves the overall interactive feel of the inputs.

## 2026-03-09 - [A11y/UX] Contextual Focus on Container Elements
**Learning:** While individual inputs have focus states, large form regions (like Calculator Cards) can feel disconnected when a user is actively engaging with them. Additionally, screen readers announce the `aria-labelledby` title when entering a semantic region, but miss the helpful contextual description text visually available below it.
**Action:** Use `aria-describedby` on the semantic container (e.g., `<section>`) linked to its descriptive `<p>` tag to provide immediate context to screen reader users upon entering the region. Pair this with Tailwind's `focus-within` on the container to slightly elevate and highlight the entire card when any of its child inputs receive focus, creating a stronger visual connection between the user's action and the active tool block.

## 2026-03-09 - [UX/A11y] Mobile Touch Discoverability for Contextual Actions
**Learning:** Relying purely on `group-hover:opacity-100` to hide contextual actions (like Copy buttons) until hovered makes those features completely undiscoverable on mobile/touch devices, which lack a hover state. Users shouldn't have to guess where actions are.
**Action:** Always ensure critical contextual actions are visible by default on touch interfaces (e.g., `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`), or provide a persistent visual cue that doesn't rely solely on mouse hover.

## 2026-03-12 - [UX/A11y] Visual Required Field Indicators
**Learning:** While form inputs correctly use the HTML5 `required` attribute (which natively handles validation and screen reader announcements), sighted users have no visual indication that a field is mandatory until they attempt to submit and encounter an error. This violates the principle of predictable UX.
**Action:** Always pair the `required` attribute on inputs with a visual indicator (like a red asterisk `<span className="text-red-500">*</span>`) in the associated label. Crucially, hide this visual indicator from screen readers using `aria-hidden="true"` to prevent redundant "star" or "asterisk" announcements, since the input itself is already marked as required.

## 2026-03-13 - [A11y] Dynamic Aria-Label Announcements
**Learning:** Relying solely on dynamically updating the `aria-label` of an already-focused button (like a Copy button changing from 'Copy' to 'Copied') is unreliable for screen readers (like VoiceOver/NVDA), as they do not automatically announce attribute changes on focused native elements. This leaves visually impaired users without feedback.
**Action:** Always pair dynamic label changes on interactive elements with a dedicated, visually hidden `aria-live` region (e.g., `<span aria-live="polite" className="sr-only">...</span>`) to ensure the state change is reliably announced.

## 2026-03-14 - [A11y] Semantic Landmarks for Static Information Cards
**Learning:** Static informational cards placed alongside a grid of interactive semantic regions (like calculator components using `<section aria-labelledby="...">`) will be skipped or harder to discover by screen reader users navigating via landmarks if left as generic `<div>` tags.
**Action:** Always wrap informational cards in explicit semantic landmark roles (e.g., `<aside>`) and link them to their visible heading using `aria-labelledby` to ensure consistent discoverability within the document outline alongside interactive regions.

## 2026-03-15 - [A11y] Conditionally Rendered Aria-Live Regions
**Learning:** Placing `aria-live` on an element that is conditionally rendered (e.g., `{result && <div aria-live="polite">...</div>}`) often causes screen readers to ignore the update because the region itself wasn't present in the accessibility tree when the mutation occurred.
**Action:** Always place `aria-live` attributes on a persistent, unconditionally rendered wrapper element in the DOM, and conditionally render the dynamic content *inside* it.

## 2026-03-16 - [UX] Calculator Empty States
**Learning:** Reserving empty space (`min-h`) for conditionally rendered dynamic results successfully prevents layout shift, but leaving it completely blank creates visual dead zones that make the UI feel incomplete before interaction.
**Action:** Always provide subtle, descriptive empty states (e.g., dashed borders, "Ready to calculate") within reserved dynamic areas to clarify their purpose and improve visual balance prior to user interaction. Ensure the wrapper uses `flex flex-col` and the empty state uses `flex-grow` to seamlessly fill the required space.

## 2026-03-17 - [A11y] Text Contrast on Dark Backgrounds
**Learning:** Using `text-gray-500` (which is `#6b7280`) on a dark theme (like `#000` or `bg-white/10`) results in poor contrast ratios (~3.2:1) that fail WCAG AA minimum contrast requirements (4.5:1 for normal text). This makes secondary or "empty state" text unreadable for visually impaired users.
**Action:** Avoid using `text-gray-500` for text on very dark backgrounds. Instead, use a lighter shade like `text-gray-400` (`#9ca3af`), which achieves a passing contrast ratio (>5.0:1) while still maintaining the desired subdued visual hierarchy.
