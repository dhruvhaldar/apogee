import { validateNumericInput, MAX_INPUT_LENGTH } from './validation';

describe('validateNumericInput', () => {
  it('should return true for valid integer strings', () => {
    expect(validateNumericInput('123')).toBe(true);
    expect(validateNumericInput('0')).toBe(true);
  });

  it('should return true for valid float strings', () => {
    expect(validateNumericInput('123.456')).toBe(true);
    expect(validateNumericInput('.456')).toBe(true);
    expect(validateNumericInput('123.')).toBe(true);
  });

  it('should return true for empty string (clearing input)', () => {
    expect(validateNumericInput('')).toBe(true);
  });

  it('should return false for negative numbers (enforcing min=0)', () => {
    expect(validateNumericInput('-123')).toBe(false);
    expect(validateNumericInput('-123.456')).toBe(false);
  });

  it('should return false for non-numeric strings', () => {
    expect(validateNumericInput('abc')).toBe(false);
    expect(validateNumericInput('12a')).toBe(false);
  });

  it('should return false for inputs exceeding max length', () => {
    const longString = '1'.repeat(MAX_INPUT_LENGTH + 1);
    expect(validateNumericInput(longString)).toBe(false);
  });

  it('should return true for inputs exactly at max length', () => {
    const maxString = '1'.repeat(MAX_INPUT_LENGTH);
    expect(validateNumericInput(maxString)).toBe(true);
  });
});
