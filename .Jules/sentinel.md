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
