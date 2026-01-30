import { delay } from '../src/delay';

describe('delay', () => {
  const TIMING_TOLERANCE = 50; // ms tolerance for timing tests

  it('should resolve after specified milliseconds', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(100 - TIMING_TOLERANCE);
    expect(elapsed).toBeLessThan(100 + TIMING_TOLERANCE * 2);
  });

  it('should handle zero milliseconds', async () => {
    const start = Date.now();
    await delay(0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(TIMING_TOLERANCE);
  });

  it('should return a Promise', () => {
    const result = delay(10);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve to undefined', async () => {
    const result = await delay(10);
    expect(result).toBeUndefined();
  });

  it('should throw error for negative values', async () => {
    expect(() => delay(-100)).toThrow('Delay must be a non-negative number');
  });

  it('should throw error for non-number values', async () => {
    // @ts-expect-error Testing invalid input
    expect(() => delay('100')).toThrow('Delay must be a non-negative number');

    // @ts-expect-error Testing invalid input
    expect(() => delay(null)).toThrow('Delay must be a non-negative number');

    // @ts-expect-error Testing invalid input
    expect(() => delay(undefined)).toThrow('Delay must be a non-negative number');
  });

  it('should work with longer delays', async () => {
    const start = Date.now();
    await delay(200);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(200 - TIMING_TOLERANCE);
    expect(elapsed).toBeLessThan(200 + TIMING_TOLERANCE * 2);
  });
});
