/**
 * deca-delay - Enhanced asynchronous delay utilities for Node.js
 *
 * @packageDocumentation
 */

import { delay as baseDelay } from './delay';
import { random } from './random';
import { until } from './until';

// Re-export types for consumers
export type { DelayUntilOptions, Condition, SyncCondition, AsyncCondition } from './types';
export { TimeoutError, ValidationError } from './errors';

/**
 * Interface for the delay function with static methods
 */
export interface DelayFunction {
  /**
   * Creates a Promise that resolves after a specified number of milliseconds.
   *
   * @param ms - The number of milliseconds to delay
   * @returns A Promise that resolves after the specified delay
   *
   * @example
   * ```typescript
   * await delay(1000); // Wait for 1 second
   * ```
   */
  (ms: number): Promise<void>;

  /**
   * Creates a Promise that resolves after a random delay between min and max milliseconds.
   * Useful for introducing jitter in retry logic or avoiding rate limits.
   *
   * @param min - Minimum delay in milliseconds (inclusive)
   * @param max - Maximum delay in milliseconds (inclusive)
   * @returns A Promise that resolves after a random delay within the specified range
   *
   * @example
   * ```typescript
   * await delay.random(500, 2000); // Wait between 500ms and 2000ms
   * ```
   */
  random: typeof random;

  /**
   * Waits until a condition function returns true, polling at a specified interval.
   * Supports both synchronous and asynchronous condition functions.
   *
   * @param condition - A function that returns true (or Promise<true>) when the wait should end
   * @param options - Configuration options for polling behavior
   * @returns A Promise that resolves when the condition is met
   *
   * @example
   * ```typescript
   * // Sync condition
   * await delay.until(() => isReady);
   *
   * // Async condition (e.g., with Playwright)
   * await delay.until(async () => await page.isVisible('#loaded'));
   * ```
   */
  until: typeof until;
}

/**
 * Enhanced delay function with static methods for random delays and conditional waiting.
 *
 * @example
 * ```typescript
 * import { delay } from 'deca-delay';
 *
 * // Fixed delay
 * await delay(1000);
 *
 * // Random delay (jitter for retries)
 * await delay.random(500, 2000);
 *
 * // Wait for condition
 * await delay.until(() => ready === true);
 * ```
 */
export const delay: DelayFunction = Object.assign(baseDelay, {
  random,
  until,
});
