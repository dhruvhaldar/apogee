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
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error(`[${context}] Error: ${message}`);
  }
};

/**
 * Extracts a user-friendly error message from an unknown error object.
 *
 * @param error The error object.
 * @returns The error message string.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
