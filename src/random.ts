import { delay } from './delay';

/**
 * Creates a Promise that resolves after a random delay between min and max milliseconds.
 * Useful for introducing jitter in retry logic or avoiding rate limits.
 *
 * @param min - Minimum delay in milliseconds (inclusive)
 * @param max - Maximum delay in milliseconds (inclusive)
 * @returns A Promise that resolves after a random delay within the specified range
 * @throws Error if min or max are not non-negative numbers
 * @throws Error if min is greater than max
 *
 * @example
 * ```typescript
 * await random(500, 2000); // Wait between 500ms and 2000ms
 * ```
 */
export function random(min: number, max: number): Promise<void> {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Both min and max must be numbers');
  }

  if (min < 0 || max < 0) {
    throw new Error('Both min and max must be non-negative numbers');
  }

  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }

  const randomMs = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(randomMs);
}
