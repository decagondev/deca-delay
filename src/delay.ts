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
export function delay(ms: number): Promise<void> {
  if (typeof ms !== 'number' || ms < 0) {
    throw new Error('Delay must be a non-negative number');
  }

  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
