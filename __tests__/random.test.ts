import { random } from '../src/random';

describe('random', () => {
  const TIMING_TOLERANCE = 50; // ms tolerance for timing tests

  it('should resolve within the specified range', async () => {
    const min = 100;
    const max = 200;
    const start = Date.now();
    await random(min, max);
    const elapsed = Date.now() - start;

    // Should be at least min (with some tolerance for timing)
    expect(elapsed).toBeGreaterThanOrEqual(min - TIMING_TOLERANCE);
    // Should be at most max (with some tolerance)
    expect(elapsed).toBeLessThan(max + TIMING_TOLERANCE * 2);
  });

  it('should work when min equals max', async () => {
    const value = 100;
    const start = Date.now();
    await random(value, value);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(value - TIMING_TOLERANCE);
    expect(elapsed).toBeLessThan(value + TIMING_TOLERANCE * 2);
  });

  it('should return a Promise', () => {
    const result = random(10, 20);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve to undefined', async () => {
    const result = await random(10, 20);
    expect(result).toBeUndefined();
  });

  it('should throw error when min > max', () => {
    expect(() => random(200, 100)).toThrow('min must be less than or equal to max');
  });

  it('should throw error for negative min', () => {
    expect(() => random(-100, 200)).toThrow('Both min and max must be non-negative numbers');
  });

  it('should throw error for negative max', () => {
    expect(() => random(100, -200)).toThrow('Both min and max must be non-negative numbers');
  });

  it('should throw error for non-number min', () => {
    // @ts-expect-error Testing invalid input
    expect(() => random('100', 200)).toThrow('Both min and max must be numbers');
  });

  it('should throw error for non-number max', () => {
    // @ts-expect-error Testing invalid input
    expect(() => random(100, '200')).toThrow('Both min and max must be numbers');
  });

  it('should handle zero values', async () => {
    const start = Date.now();
    await random(0, 0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(TIMING_TOLERANCE);
  });

  it('should produce values across the range over multiple calls', async () => {
    // Run multiple times to verify randomness produces varied results
    const results: number[] = [];
    const min = 50;
    const max = 100;

    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      await random(min, max);
      results.push(Date.now() - start);
    }

    // All results should be within range (with tolerance)
    results.forEach(elapsed => {
      expect(elapsed).toBeGreaterThanOrEqual(min - TIMING_TOLERANCE);
      expect(elapsed).toBeLessThan(max + TIMING_TOLERANCE * 2);
    });
  });
});
