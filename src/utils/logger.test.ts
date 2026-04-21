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
  });
});
