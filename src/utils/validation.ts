/**
 * Security: Validation utilities to prevent DoS attacks and ensure data integrity.
 *
 * Limiting input length prevents:
 * 1. Denial of Service (DoS): Processing excessively long strings (e.g., 1MB) can block the main thread.
 * 2. Unexpected Behavior: JavaScript numbers lose precision beyond ~15 digits (Number.MAX_SAFE_INTEGER is 2^53 - 1).
 * 3. Buffer Overflows: Although rare in JS, limiting input size is a defense-in-depth practice.
 */

// Maximum length for numeric input strings (enough for 100 trillion + decimal + precision)
export const MAX_INPUT_LENGTH = 15;

// Regex for positive numbers (integer or float).
// ^\d* matches any number of digits at the start.
// \.? matches an optional decimal point.
// \d*$ matches any number of digits after the decimal point.
// This allows: "123", "123.", ".123", "123.456", and "" (empty string).
// It disallows: "-", "-123", "1.2.3", "abc".
const POSITIVE_NUMBER_REGEX = /^\d*\.?\d*$/;

/**
 * Validates a numeric input string against security constraints.
 * Checks for maximum length and valid numeric format.
 *
 * @param value The input string to validate.
 * @returns true if the input is valid, false otherwise.
 */
export function validateNumericInput(value: string): boolean {
  // Prevent DoS by checking length first (cheap operation)
  if (value.length > MAX_INPUT_LENGTH) {
    return false;
  }

  // Ensure only valid numeric characters are present
  if (!POSITIVE_NUMBER_REGEX.test(value)) {
    return false;
  }

  return true;
}
