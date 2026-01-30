/**
 * Error thrown when a delay.until operation times out
 */
export class TimeoutError extends Error {
  /**
   * The timeout duration in milliseconds
   */
  public readonly timeout: number;

  /**
   * Creates a new TimeoutError
   * @param timeout - The timeout duration in milliseconds
   * @param message - Optional custom message
   */
  constructor(timeout: number, message?: string) {
    super(message ?? `Condition not met within ${timeout}ms timeout`);
    this.name = 'TimeoutError';
    this.timeout = timeout;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }
}

/**
 * Error thrown when invalid arguments are provided
 */
export class ValidationError extends Error {
  /**
   * Creates a new ValidationError
   * @param message - Description of the validation failure
   */
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}
