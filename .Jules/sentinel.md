## 2024-02-14 - Input Validation in Scientific Calculations
**Vulnerability:** Core physics utility functions (`calculateConsumables`, `calculateMissionCost`, `calculateSolarPanelArea`) accepted negative inputs, leading to nonsensical results (e.g., negative cost or mass).
**Learning:** Even in purely client-side calculators, missing input validation can lead to data integrity issues and confusing UX. It violates the principle of "validate all inputs".
**Prevention:** Implement strict input validation at the lowest level (utility functions) to ensure data integrity, and update UI components to handle these validation errors gracefully.

## 2026-02-21 - DNS Prefetching Privacy Leak
**Vulnerability:** Default `X-DNS-Prefetch-Control: on` allows browsers to proactively resolve domains found in page content, potentially leaking browsing behavior and internal domain structures via DNS queries without user interaction.
**Learning:** Privacy is a component of security. Default configurations often prioritize performance over privacy. Explicitly disabling features that leak metadata is a key defense-in-depth strategy.
**Prevention:** Explicitly set `X-DNS-Prefetch-Control: off` in `next.config.ts` to disable speculative DNS resolution.

## 2026-02-23 - Centralized Validation Helper Pattern
**Vulnerability:** Input validation logic was duplicated and inconsistent across utility functions, and failed to handle `NaN` or `Infinity`, leading to fragile calculations.
**Learning:** Checking only for `< 0` is insufficient for robust numeric input handling; non-finite numbers must be explicitly rejected to prevent `NaN` propagation.
**Prevention:** Use a centralized helper function (e.g., `validateFinite`) to enforce consistent, strict validation rules (finite, non-negative) across all calculation utilities.

## 2026-03-01 - Secure Client-Side Error Logging
**Vulnerability:** Calculator components were catching exceptions and logging raw error objects using `console.error(e)`. This can expose stack traces and internal implementation details in the browser console.
**Learning:** Error handling logic was duplicated across components, making it hard to enforce security best practices. Relying on default console logging in production is a security bad practice (Information Exposure).
**Prevention:** Created a centralized `logError` utility in `src/utils/logger.ts` that suppresses raw error objects in production environments, logging only the error message. Refactored all components to use this utility.

## 2026-03-05 - DoS Prevention via Strict Input Validation
**Vulnerability:** Calculator inputs lacked length limits and proper state handling for decimals, exposing the application to potential Denial of Service (DoS) via massive string processing and causing UX issues.
**Learning:** Using `number` type for React state in controlled inputs makes it impossible to represent intermediate valid states (like "12.") and complicates length validation. Defense-in-depth requires validating input *before* state updates.
**Prevention:** Implemented a centralized `validateNumericInput` utility with strict length limits (15 chars) and regex pattern matching. Refactored components to use `string` state for precise control and validation.

## 2026-03-06 - Consistent Security Control Application
**Vulnerability:** Several calculator forms (`RocketCalculatorForm`, `LifeSupportCalculatorForm`) bypassed the centralized input validation logic, leaving them vulnerable to DoS and invalid state issues despite the existence of security controls.
**Learning:** The existence of a security utility (`validateNumericInput`) does not guarantee its usage. Legacy or inconsistent code can leave security gaps.
**Prevention:** Audited and refactored all calculator components to enforce the strict `validateNumericInput` pattern, ensuring consistent protection across the application.

## 2026-03-07 - Solar Panel Calculator Input Validation Gap
**Vulnerability:** `SolarPanelCalculatorForm` was using `number` state directly and bypassing the `validateNumericInput` utility, creating a gap in DoS protection and input validation consistency compared to other calculators.
**Learning:** Inconsistent application of security patterns (like input validation) creates weak points. All similar components must adhere to the established security posture.
**Prevention:** Refactored `SolarPanelCalculatorForm` to use `string` state and the centralized `validateNumericInput` utility, ensuring length limits and pattern matching are enforced. Added `step="any"` for better floating-point support.

## 2026-10-25 - Strict Content Security and Permissions Policy
**Vulnerability:** Default Next.js configuration and lenient CSP (allowing `unsafe-eval`) along with a permissive Permissions Policy exposed the application to increased XSS risk and feature abuse potential.
**Learning:** Next.js 16 production builds are compatible with a stricter CSP (removing `unsafe-eval`), allowing for significant security hardening without breaking core functionality.
**Prevention:** Enforced strict CSP, comprehensive `Permissions-Policy`, and disabled `X-Powered-By` in `next.config.ts` to minimize the attack surface and prevent unauthorized feature usage.

## 2026-10-27 - Verification Gap in Security Headers
**Vulnerability:** The existing automated test (`tests/header.spec.ts`) only verified a single security header (`X-DNS-Prefetch-Control`), leaving critical headers like CSP, HSTS, and X-Frame-Options unverified and prone to silent regression.
**Learning:** Security controls without comprehensive verification are fragile. A passing test suite can mask significant security gaps if the tests themselves are incomplete.
**Prevention:** Enhanced the security header test suite to verify the presence and correct values of ALL configured security headers, ensuring regression testing for the entire security posture. Added `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` for improved isolation.

## 2026-10-28 - Incomplete Permissions-Policy Configuration
**Vulnerability:** The `Permissions-Policy` header in `next.config.ts` was missing critical directives (`web-share`, `idle-detection`), leaving the application vulnerable to potential feature abuse. Furthermore, a comment explicitly stated the need for `clipboard-write=(self)` to allow `CopyButton` functionality, but it was not implemented in the actual header value, leading to a discrepancy between intent and reality.
**Learning:** Security configurations must be exhaustive and explicitly deny all unnecessary features. Comments outlining security requirements must be strictly verified against the implemented code. Relying on default browser behavior for unconfigured permissions policies violates the principle of least privilege.
**Prevention:** Ensured the `Permissions-Policy` in `next.config.ts` explicitly includes `web-share=()`, `idle-detection=()`, and `clipboard-write=(self)`. Added corresponding Playwright test assertions in `tests/header.spec.ts` to prevent silent regression and enforce that the implemented policy matches the documented intent.

## 2026-10-29 - Missing Cross-Origin-Embedder-Policy (COEP)
**Vulnerability:** The application was missing the `Cross-Origin-Embedder-Policy` (COEP) header, leaving it vulnerable to cross-origin attacks despite having COOP and CORP headers. Without COEP, the application cannot achieve full cross-origin isolation.
**Learning:** Cross-origin isolation requires a complete set of headers (COOP, CORP, and COEP). Missing any of these headers can leave the application partially exposed and fail to achieve the intended security posture.
**Prevention:** Added `Cross-Origin-Embedder-Policy: require-corp` to `next.config.ts` to enforce strict cross-origin isolation and updated the Playwright test suite to verify its presence.

## 2026-10-30 - Outdated Dependencies With Known Vulnerabilities
**Vulnerability:** The application was using Next.js 16.1.6, which had known vulnerabilities such as HTTP request smuggling, unbounded cache growth, DoS risks, and CSRF bypass.
**Learning:** Outdated frameworks and dependencies frequently contain publicly known security vulnerabilities (CVEs) that attackers can exploit. Regular auditing and patching are crucial.
**Prevention:** Integrate dependency auditing (e.g., `pnpm audit`) into the development workflow and regularly update dependencies to their latest secure versions.

## 2026-03-22 - Outdated Dependencies With Known Vulnerabilities Resolved
**Vulnerability:** The application was using Next.js 16.1.7 and multiple dependencies (e.g., `minimatch`, `ajv`, `flatted`) which had known vulnerabilities, including high-severity ReDoS vulnerabilities.
**Learning:** Outdated frameworks and dependencies frequently contain publicly known security vulnerabilities (CVEs) that attackers can exploit.
**Prevention:** Executed `pnpm audit --fix` to address subdependency vulnerabilities and manually updated Next.js to the latest stable version (16.2.1) to ensure known framework vulnerabilities are patched.

## 2024-03-26 - Outdated Subdependencies With Known Vulnerabilities Resolved
**Vulnerability:** The application was using subdependencies (`picomatch` and `brace-expansion`) which had known vulnerabilities, including high-severity ReDoS vulnerabilities.
**Learning:** Outdated frameworks and dependencies frequently contain publicly known security vulnerabilities (CVEs) that attackers can exploit. Subdependencies can be tricky to update without tools.
**Prevention:** Executed `pnpm audit --fix` to address subdependency vulnerabilities by generating and applying resolution rules under the `pnpm.overrides` field in `package.json`.

## 2026-11-01 - Subdependency Vulnerability Resolution
**Vulnerability:** The `handlebars` (via `ts-jest`) and `brace-expansion` (via `minimatch` in `eslint`) packages had multiple high-severity vulnerabilities, including XSS, prototype pollution, and denial of service.
**Learning:** These are classic examples of transitive dependency vulnerabilities, which can be hard to track manually.
**Prevention:** Utilizing package manager tools like `pnpm audit --fix` easily generated the correct resolution rules under `pnpm.overrides` to strictly use the patched versions. Routine dependency audits using these tools is essential.

## 2024-04-12 - Next.js Denial of Service Vulnerability
**Vulnerability:** Next.js <16.2.3 Denial of Service with Server Components (GHSA-q4gf-8mx6-v5v3).
**Learning:** Core framework dependencies can introduce vulnerabilities. Audits are necessary.
**Prevention:** Use `pnpm audit` proactively to identify and resolve vulnerabilities.
## 2026-04-15 - Explicitly deny programmatic clipboard reading
**Vulnerability:** The `Permissions-Policy` header allowed programmatic clipboard reading by default, potentially exposing sensitive user clipboard data to malicious scripts.
**Learning:** Security configurations must explicitly deny unnecessary permissions to reduce the attack surface. Default browser permissions can be overly permissive.
**Prevention:** Added `clipboard-read=()` to the `Permissions-Policy` in `next.config.ts` to strictly deny read access to the clipboard.
## 2026-04-19 - Prevent Information Disclosure via Error Messages\n**Vulnerability:** Generic JavaScript errors thrown during normal form validation were leaking unhandled stack traces and internal application structure when logged or propagated inappropriately.\n**Learning:** Relying on generic `Error` objects for expected user input validation makes it impossible to securely distinguish between safe, user-facing feedback and sensitive internal system failures.\n**Prevention:** Introduce and enforce a custom `ValidationError` class. Ensure logging utilities and error catch blocks sanitize all generic `Error` instances, only permitting `ValidationError` messages to reach the client UI.

## 2025-05-04 - PostCSS XSS Vulnerability Resolution
**Vulnerability:** `postcss` <8.5.10 had a Cross-Site Scripting (XSS) vulnerability via unescaped `</style>` tags in its CSS Stringify Output.
**Learning:** Using `pnpm audit --fix` automatically generates `>=` version ranges which can sometimes lead to pulling in incompatible major versions breaking the parent packages.
**Prevention:** Added overrides via `pnpm audit --fix`, but manually adjusted the overrides for `postcss` in `package.json` to use a compatible caret range (`^8.5.10`) to prevent breaking changes. Routine dependency audits should accompany manual adjustments to prevent similar crashes.
## 2026-05-09 - Enforce Strict Referrer-Policy
**Vulnerability:** The application was using `strict-origin-when-cross-origin` for its Referrer-Policy, which still leaks the origin URL to cross-origin requests. Since the application does not rely on referrer headers, this unnecessarily increased the attack surface for privacy-related information disclosure.
**Learning:** Default security configurations, even relatively modern ones like `strict-origin-when-cross-origin`, may not be strict enough for applications that do not strictly require them. The principle of least privilege should apply to data sharing via headers.
**Prevention:** Changed the `Referrer-Policy` to `no-referrer` in `next.config.ts` to ensure no referrer information is ever leaked, maximizing user privacy.
## 2025-05-11 - Prevent CRLF Log Injection
**Vulnerability:** The logging utility (`src/utils/logger.ts`) directly outputted user-supplied or application-generated error messages without sanitizing newline characters.
**Learning:** This allowed for potential log forging or CRLF injection if user input were ever reflected directly into an error message, enabling an attacker to create misleading or fake log entries.
**Prevention:** Always strip or sanitize newline characters (`\r`, `\n`) from all dynamically populated variables (like `message` and `context`) before passing them to logging sinks.

## 2026-11-02 - Prevent Invalid Numeric Inputs (Single Dot)
**Vulnerability:** The regular expression used for client-side numeric validation (`/^\d*\.?\d*$/`) allowed a solitary dot (`"."`) to pass validation. When this value was processed by `parseFloat` or `parseInt` in the application logic, it evaluated to `NaN`, leading to unexpected application states or potential crashes downstream.
**Learning:** Regular expressions that use optional quantifiers (`*`, `?`) indiscriminately can create edge cases where non-numeric strings (like a single dot) are incorrectly validated as numbers. Input validation must be strictly constrained to require actual numerical digits.
**Prevention:** Modified the validation regex to `/^(?:\d+(?:\.\d*)?|\.\d+)?$/`. This pattern ensures that if a decimal point is present, it must be accompanied by at least one digit, preventing a solitary dot from passing validation while still allowing empty strings.
