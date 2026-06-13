/**
 * Securely logs errors to the console.
 * In development, this logs the full error object for debugging.
 * In production, this logs only the error message or a generic message to prevent leaking stack traces.
 *
 * @param error The error to log.
 * @param context Ideally the name of the component or function where the error occurred.
 */
export const logError = (error: unknown, context: string = 'App'): void => {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error(`[${context}] Error:`, error);
  } else {
    // In production, avoid logging the full error object which might contain stack traces.
    // Instead, log a sanitized message.
    let message = error instanceof Error ? error.message : 'An unexpected error occurred';
    // Defense-in-depth: Sanitize the message to prevent CRLF injection and terminal escape sequence injection
    // Replace all control characters (0x00-0x1F, 0x7F) with spaces to prevent log forging
    message = message.replace(/[\x00-\x1F\x7F]+/g, ' ');
    // Also sanitize context
    const sanitizedContext = context.replace(/[\x00-\x1F\x7F]+/g, ' ');
    console.error(`[${sanitizedContext}] Error: ${message}`);
  }
};

/**
 * Custom error class for expected user-facing validation failures.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Extracts a user-friendly error message from an unknown error object.
 *
 * @param error The error object.
 * @returns The error message string.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ValidationError) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
