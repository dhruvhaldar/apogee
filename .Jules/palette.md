## 2026-03-17 - [UX] HTML5 Inline Validation Feedback
**Learning:** While form inputs correctly use the HTML5 `required` attribute (which handles validation), users only discover they missed a field when they attempt to submit the form and the browser's native popup appears. This creates a delayed, high-friction error state. Sighted users benefit from immediate, inline visual feedback when an active input is invalid.
**Action:** Always provide immediate inline validation feedback using Tailwind's `focus:invalid` pseudo-classes (e.g., `focus:invalid:border-red-500 focus:invalid:ring-red-500/40`) on required inputs. This leverages the browser's native invalid state to instantly highlight empty required fields in red as the user interacts with them, preventing delayed submission errors without complex React state.

## 2026-03-19 - [UX] Keyboard Shortcut Affordance for Forms
**Learning:** Forms implicitly support the "Enter" key for submission, but sighted users often default to using the mouse to click the submit button if no visual affordance is present, breaking their typing flow.
**Action:** Add a visually subtle, screen-reader-hidden `<kbd>` hint (e.g., "↵ Enter") to primary form submit buttons. This educates users about available keyboard shortcuts and encourages a more seamless, accessible keyboard-driven interaction without cluttering the accessible name of the button.

## 2026-03-22 - [UX] Alert Icons in Error Messages
**Learning:** Depending entirely on color (e.g., red borders, red background text) to convey an error state violates WCAG 1.4.1 (Use of Color). Colorblind users or individuals using high-contrast modes may not perceive the error context correctly.
**Action:** Always pair visual error states with a distinct, contextually relevant icon (e.g., an alert circle SVG with `aria-hidden="true"`) to guarantee that error states are easily perceived by all users, establishing a more accessible and polished UI.

## 2026-04-05 - [UX] Keyboard Inaccessible Native Tooltips
**Learning:** Native browser `title` attributes act as tooltips but are typically only revealed on mouse hover. This renders them undiscoverable for sighted keyboard-only users who navigate via the `Tab` key, breaking WCAG guidelines for equal affordance.
**Action:** Avoid relying on native `title` attributes for tooltips on interactive elements. Instead, use custom inline tooltips styled with Tailwind (e.g., `opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100`) to ensure the tooltip is reliably exposed for both mouse hover and keyboard focus states.

## 2026-04-10 - [UX] Overriding Visible Labels with aria-label
**Learning:** Adding an `aria-label` to an `<input>` that already has a visible linked `<label>` completely overrides the visible text for screen reader users. If the `aria-label` does not contain the exact text of the visible label, it violates WCAG 2.5.3 (Label in Name), creating confusion between sighted and non-sighted users. Additionally, adding `aria-label="Required"` to a visual asterisk alongside an input with the native `required` attribute causes screen readers to redundantly announce "required" twice.
**Action:** Never use `aria-label` on inputs that already have a dedicated `<label>` element. Rely on the native label, inline visual adornments (like units), and `aria-describedby` hints for context. Always mark purely visual "Required" asterisks with `aria-hidden="true"` on their outer wrapper to let the input's native `required` attribute handle screen reader announcements cleanly.
