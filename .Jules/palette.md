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

## 2026-04-20 - [UX] Axe Region Violations on Skip-To-Content Links
**Learning:** Skip-to-content links that are placed directly in the `<body>` outside of any landmark region (e.g., `<header>`, `<main>`, `<nav>`) will trigger Axe-core's "region" violation ("Ensure all page content is contained by landmarks").
**Action:** Always wrap application-level elements like skip links inside a semantically appropriate landmark, such as a hidden `<header>` or `<nav>` (e.g., `<header className="sr-only focus-within:not-sr-only">`), to ensure they are discoverable in the accessibility tree and comply with landmark rules.

## 2026-04-25 - [UX] Smooth Scrolling for Skip-to-Content Links
**Learning:** When keyboard users or screen reader users who navigate visually activate a "skip-to-content" link, an instantaneous layout jump can be disorienting and cause them to lose their spatial awareness of the page's structure.
**Action:** Apply `scroll-behavior: smooth` to the `html` element globally. This ensures that anchor links (like skip links) trigger a smooth scroll transition, helping users visually track the movement down the page and better understand the spatial relationship between the header and main content.

## 2026-04-26 - [UX] Auto-select Pre-filled Data Entry
**Learning:** Forms with pre-filled default values (e.g. `1000`) designed for quick testing become cumbersome when a user clicks or tabs into them. By default, the cursor is placed at the end of the text, requiring the user to manually backspace or select the text before typing their intended value, adding unnecessary friction.
**Action:** Use `onFocus={(e) => e.target.select()}` on inputs with default numeric values. This classic calculator UX pattern instantly highlights the existing value upon focus, enabling the user's first keystroke to automatically clear the field and begin fresh data entry.

## 2026-05-10 - [UX] CSS Specificity and Focus on Reusable Components
**Learning:** When passing dynamic `className` props (e.g., `text-cyan-400 focus:ring-cyan-400`) into a reusable UI component that has its own base styles (e.g., `text-gray-400`), Tailwind's CSS precedence rules might cause the base style to unintentionally win out, ignoring the passed colors. Additionally, using `focus:ring` on buttons causes an unwanted persistent focus ring after a mouse click, which is visually jarring and breaks the distinction between keyboard focus and active mouse clicks.
**Action:** When class-merging libraries (like `tailwind-merge`) are unavailable or disallowed, use Tailwind's `!` important modifier (e.g., `!text-cyan-400`) on passed props to guarantee the intended theme override. Always prefer `focus-visible:` over `focus:` for button focus rings to ensure they only appear during keyboard navigation.

## 2026-05-18 - [UX] Keyboard Focus Parity for Contextual Hints
**Learning:** Contextual hints, such as `<kbd> ↵ Enter</kbd>` instructions on form submit buttons, are often styled to only appear on mouse hover (e.g., via `group-hover:opacity-100`). This leaves sighted keyboard-only users without the same affordances, breaking accessibility parity.
**Action:** Whenever applying hover-based visibility classes (`group-hover:opacity-100`) to contextual hints inside interactive elements, always pair them with an equivalent focus-visible class (`group-focus-visible:opacity-100`). This ensures the hint becomes visible when a user navigates to the element using the `Tab` key.

## 2026-05-20 - [UX] Visual Feedback Parity for Semantic Containers
**Learning:** Calculator Cards used `focus-within` styles to highlight the active container for keyboard users, providing excellent spatial awareness. However, this state was entirely absent for mouse hover, creating a disjointed experience where mouse users received no interactive feedback before clicking.
**Action:** Always ensure visual feedback parity for interactive semantic containers. If a container highlights upon receiving focus (`focus-within`), it should mirror those visual cues on hover (`hover:border-white/40 hover:bg-white/[0.12] hover:shadow-2xl`) to provide a consistent, intuitive experience regardless of input method.

## 2026-05-25 - [UX] Prevent Stale Results in Manual Submission Forms
**Learning:** In forms that require manual submission (e.g., clicking a "Calculate" button), changing input fields leaves the previously calculated result visible on screen. This creates a confusing UX mismatch where the displayed result is stale and does not accurately reflect the current input values.
**Action:** Always clear the result state (e.g., `setResult(null)`) within the `onChange` handlers of the associated input fields. This forces the UI to return to its empty state, prompting the user to recalculate and guaranteeing that data display always matches input intent.

## 2026-05-30 - [UX] Prevent Numeric Input Scroll Hijacking
**Learning:** Browsers natively allow `<input type="number">` values to be changed via the mouse scroll wheel when the input is focused or hovered. In long forms or dashboard-style grids with many number inputs, this often results in accidental data changes when users are simply trying to scroll down the page, leading to frustrating and unnoticed errors.
**Action:** Always add `onWheel={(e) => (e.target as HTMLInputElement).blur()}` to `<input type="number">` elements. This intercepts the scroll event and removes focus from the input, safely passing the scroll intent back to the window and preventing accidental value modification.

## 2026-05-31 - [UX] Prevent Tooltip Mis-triggers with Nested Tailwind Groups
**Learning:** When a parent container uses the `group` class (e.g., to reveal a child button on hover), and the child button also uses the `group` class for its own internal hover states (like a tooltip), hovering the parent will prematurely trigger the child's tooltip. This creates a confusing experience where a tooltip appears far away from the user's cursor.
**Action:** Use named groups (e.g., `group/button` and `group-hover/button:opacity-100`) for interactive elements that contain tooltips when they might be placed inside other `group` containers. This isolates the hover state and ensures tooltips only appear when intended.
