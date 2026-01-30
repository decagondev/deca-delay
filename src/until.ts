import { TimeoutError } from './errors';
import type { Condition, DelayUntilOptions } from './types';

/**
 * Default polling interval in milliseconds
 */
const DEFAULT_INTERVAL = 200;

/**
 * Default timeout in milliseconds (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Checks if a value is a Promise-like object
 */
function isPromiseLike(value: unknown): value is Promise<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'then' in value &&
    typeof (value as { then: unknown }).then === 'function'
  );
}

/**
 * Waits until a condition function returns true, polling at a specified interval.
 * Supports both synchronous and asynchronous condition functions.
 *
 * @param condition - A function that returns true (or Promise<true>) when the wait should end
 * @param options - Configuration options for polling behavior
 * @returns A Promise that resolves when the condition is met
 * @throws Error if the condition function is not a function
 * @throws TimeoutError if the condition is not met within the timeout period
 *
 * @example
 * ```typescript
 * // Sync condition
 * let ready = false;
 * setTimeout(() => ready = true, 1000);
 * await until(() => ready);
 *
 * // Async condition (e.g., with Playwright)
 * await until(async () => await page.isVisible('#loaded'));
 * ```
 */
export function until(
  condition: Condition,
  options: DelayUntilOptions = {}
): Promise<void> {
  if (typeof condition !== 'function') {
    throw new Error('Condition must be a function');
  }

  const interval = options.interval ?? DEFAULT_INTERVAL;
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;

  if (typeof interval !== 'number' || interval < 0) {
    throw new Error('Interval must be a non-negative number');
  }

  if (typeof timeout !== 'number' || timeout < 0) {
    throw new Error('Timeout must be a non-negative number');
  }

  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    const check = async (): Promise<void> => {
      try {
        const result = condition();

        // Handle both sync and async conditions using Promise.resolve
        const resolvedResult = isPromiseLike(result)
          ? await result
          : result;

        if (resolvedResult) {
          resolve();
          return;
        }

        const elapsed = Date.now() - startTime;
        if (elapsed >= timeout) {
          reject(new TimeoutError(timeout));
          return;
        }

        setTimeout(check, interval);
      } catch (error) {
        reject(error);
      }
    };

    // Start checking immediately
    check();
  });
}
