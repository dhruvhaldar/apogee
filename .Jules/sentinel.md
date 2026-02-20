## 2024-02-14 - Input Validation in Scientific Calculations
**Vulnerability:** Core physics utility functions (`calculateConsumables`, `calculateMissionCost`, `calculateSolarPanelArea`) accepted negative inputs, leading to nonsensical results (e.g., negative cost or mass).
**Learning:** Even in purely client-side calculators, missing input validation can lead to data integrity issues and confusing UX. It violates the principle of "validate all inputs".
**Prevention:** Implement strict input validation at the lowest level (utility functions) to ensure data integrity, and update UI components to handle these validation errors gracefully.

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
