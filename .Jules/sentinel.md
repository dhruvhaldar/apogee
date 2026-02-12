## 2024-02-14 - Input Validation in Scientific Calculations
**Vulnerability:** Core physics utility functions (`calculateConsumables`, `calculateMissionCost`, `calculateSolarPanelArea`) accepted negative inputs, leading to nonsensical results (e.g., negative cost or mass).
**Learning:** Even in purely client-side calculators, missing input validation can lead to data integrity issues and confusing UX. It violates the principle of "validate all inputs".
**Prevention:** Implement strict input validation at the lowest level (utility functions) to ensure data integrity, and update UI components to handle these validation errors gracefully.
