import { logError, getErrorMessage, ValidationError } from './logger';

describe('Logger Utility', () => {
  const originalEnv = process.env.NODE_ENV;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });

  describe('getErrorMessage', () => {
    it('should return the error message for ValidationError objects', () => {
      const error = new ValidationError('Test validation error');
      expect(getErrorMessage(error)).toBe('Test validation error');
    });

    it('should return a generic message for generic Error objects', () => {
      const error = new Error('Test error');
      expect(getErrorMessage(error)).toBe('An unexpected error occurred');
    });

    it('should return a generic message for non-Error objects', () => {
      expect(getErrorMessage('something went wrong')).toBe('An unexpected error occurred');
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
      expect(getErrorMessage({})).toBe('An unexpected error occurred');
    });
  });

  describe('logError', () => {
    it('should log full error in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Dev error');
      logError(error, 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith('[TestContext] Error:', error);
    });

    it('should log only message in production for Error objects', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Prod error');
      logError(error, 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith('[TestContext] Error: Prod error');
    });

    it('should log generic message in production for non-Error objects', () => {
      process.env.NODE_ENV = 'production';
      logError('weird error', 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith('[TestContext] Error: An unexpected error occurred');
    });

    it('should sanitize newlines in error messages to prevent CRLF injection in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Line 1\nLine 2\r\nLine 3');
      logError(error, 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith('[TestContext] Error: Line 1 Line 2 Line 3');
    });

    it('should sanitize newlines in context to prevent CRLF injection in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Test error');
      logError(error, 'Test\nContext\r\n');

      expect(consoleSpy).toHaveBeenCalledWith('[Test Context ] Error: Test error');
    });
  });
});
