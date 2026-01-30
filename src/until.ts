import type { DelayUntilOptions, SyncCondition } from './types';

/**
 * Default polling interval in milliseconds
 */
const DEFAULT_INTERVAL = 200;

/**
 * Default timeout in milliseconds (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Waits until a condition function returns true, polling at a specified interval.
 * This version supports synchronous condition functions only.
 *
 * @param condition - A function that returns true when the wait should end
 * @param options - Configuration options for polling behavior
 * @returns A Promise that resolves when the condition is met
 * @throws Error if the condition function is not a function
 *
 * @example
 * ```typescript
 * let ready = false;
 * setTimeout(() => ready = true, 1000);
 * await until(() => ready); // Resolves when ready becomes true
 * ```
 */
export function until(
  condition: SyncCondition,
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

    const check = (): void => {
      try {
        const result = condition();

        if (result) {
          resolve();
          return;
        }

        const elapsed = Date.now() - startTime;
        if (elapsed >= timeout) {
          reject(new Error(`Condition not met within ${timeout}ms timeout`));
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
