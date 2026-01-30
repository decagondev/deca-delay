import { until } from '../src/until';
import { TimeoutError } from '../src/errors';

describe('until (sync conditions)', () => {
  const TIMING_TOLERANCE = 50;

  it('should resolve immediately if condition is already true', async () => {
    const start = Date.now();
    await until(() => true);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(TIMING_TOLERANCE);
  });

  it('should wait until condition becomes true', async () => {
    let ready = false;
    setTimeout(() => {
      ready = true;
    }, 100);

    const start = Date.now();
    await until(() => ready, { interval: 50 });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(100 - TIMING_TOLERANCE);
    expect(ready).toBe(true);
  });

  it('should use default interval of 200ms', async () => {
    let checkCount = 0;
    let ready = false;

    setTimeout(() => {
      ready = true;
    }, 450); // Should be checked about 2-3 times with 200ms interval

    await until(() => {
      checkCount++;
      return ready;
    });

    // With 200ms interval over ~450ms, expect 2-4 checks
    expect(checkCount).toBeGreaterThanOrEqual(2);
    expect(checkCount).toBeLessThanOrEqual(5);
  });

  it('should respect custom interval', async () => {
    let checkCount = 0;
    let ready = false;

    setTimeout(() => {
      ready = true;
    }, 150);

    await until(
      () => {
        checkCount++;
        return ready;
      },
      { interval: 50 }
    );

    // With 50ms interval over ~150ms, expect 3-5 checks
    expect(checkCount).toBeGreaterThanOrEqual(3);
  });

  it('should throw error when condition is not a function', () => {
    // @ts-expect-error Testing invalid input
    expect(() => until('not a function')).toThrow('Condition must be a function');

    // @ts-expect-error Testing invalid input
    expect(() => until(null)).toThrow('Condition must be a function');

    // @ts-expect-error Testing invalid input
    expect(() => until(123)).toThrow('Condition must be a function');
  });

  it('should throw error for invalid interval', () => {
    expect(() => until(() => true, { interval: -100 })).toThrow(
      'Interval must be a non-negative number'
    );

    // @ts-expect-error Testing invalid input
    expect(() => until(() => true, { interval: 'fast' })).toThrow(
      'Interval must be a non-negative number'
    );
  });

  it('should throw error for invalid timeout', () => {
    expect(() => until(() => true, { timeout: -100 })).toThrow(
      'Timeout must be a non-negative number'
    );

    // @ts-expect-error Testing invalid input
    expect(() => until(() => true, { timeout: 'long' })).toThrow(
      'Timeout must be a non-negative number'
    );
  });

  it('should timeout if condition never becomes true', async () => {
    await expect(
      until(() => false, { timeout: 100, interval: 20 })
    ).rejects.toThrow(TimeoutError);
  });

  it('should throw TimeoutError with correct timeout value', async () => {
    const timeout = 100;
    try {
      await until(() => false, { timeout, interval: 20 });
      fail('Should have thrown TimeoutError');
    } catch (error) {
      expect(error).toBeInstanceOf(TimeoutError);
      expect((error as TimeoutError).timeout).toBe(timeout);
      expect((error as TimeoutError).message).toBe(`Condition not met within ${timeout}ms timeout`);
    }
  });

  it('should propagate errors thrown by condition function', async () => {
    const errorMessage = 'Condition check failed';

    await expect(
      until(() => {
        throw new Error(errorMessage);
      })
    ).rejects.toThrow(errorMessage);
  });

  it('should return a Promise', () => {
    const result = until(() => true);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve to undefined', async () => {
    const result = await until(() => true);
    expect(result).toBeUndefined();
  });

  it('should work with zero interval', async () => {
    let checkCount = 0;
    let ready = false;

    // Set ready after a small delay
    setTimeout(() => {
      ready = true;
    }, 50);

    await until(
      () => {
        checkCount++;
        return ready;
      },
      { interval: 0, timeout: 1000 }
    );

    // With 0ms interval, should check multiple times (at least 2)
    // Note: setTimeout has minimum resolution, so exact count varies
    expect(checkCount).toBeGreaterThanOrEqual(2);
    expect(ready).toBe(true);
  });
});

describe('until (async conditions)', () => {
  const TIMING_TOLERANCE = 50;

  it('should resolve immediately if async condition returns true', async () => {
    const start = Date.now();
    await until(async () => true);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(TIMING_TOLERANCE);
  });

  it('should wait until async condition becomes true', async () => {
    let ready = false;
    setTimeout(() => {
      ready = true;
    }, 100);

    const start = Date.now();
    await until(async () => ready, { interval: 50 });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(100 - TIMING_TOLERANCE);
    expect(ready).toBe(true);
  });

  it('should handle async condition that returns Promise', async () => {
    let ready = false;
    setTimeout(() => {
      ready = true;
    }, 100);

    await until(
      () => new Promise<boolean>(resolve => {
        // Simulate async check
        setTimeout(() => resolve(ready), 10);
      }),
      { interval: 50, timeout: 1000 }
    );

    expect(ready).toBe(true);
  });

  it('should propagate errors from async condition', async () => {
    const errorMessage = 'Async condition failed';

    await expect(
      until(async () => {
        throw new Error(errorMessage);
      })
    ).rejects.toThrow(errorMessage);
  });

  it('should propagate rejection from async condition', async () => {
    const errorMessage = 'Promise rejected';

    await expect(
      until(() => Promise.reject(new Error(errorMessage)))
    ).rejects.toThrow(errorMessage);
  });

  it('should timeout with async condition that never returns true', async () => {
    await expect(
      until(async () => false, { timeout: 100, interval: 20 })
    ).rejects.toThrow(TimeoutError);
  });

  it('should work with mixed sync and async behavior', async () => {
    let callCount = 0;
    let ready = false;

    setTimeout(() => {
      ready = true;
    }, 100);

    // Condition alternates between sync-like and truly async
    await until(
      async () => {
        callCount++;
        if (callCount % 2 === 0) {
          // Truly async
          return new Promise<boolean>(resolve => {
            setTimeout(() => resolve(ready), 5);
          });
        }
        // Immediately resolved promise (sync-like)
        return ready;
      },
      { interval: 30, timeout: 1000 }
    );

    expect(ready).toBe(true);
  });

  it('should resolve to undefined with async condition', async () => {
    const result = await until(async () => true);
    expect(result).toBeUndefined();
  });

  it('should work with async condition that takes time to evaluate', async () => {
    let ready = false;
    setTimeout(() => {
      ready = true;
    }, 150);

    const start = Date.now();
    await until(
      async () => {
        // Simulate an async check that takes 20ms
        await new Promise(resolve => setTimeout(resolve, 20));
        return ready;
      },
      { interval: 50, timeout: 1000 }
    );
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(150 - TIMING_TOLERANCE);
    expect(ready).toBe(true);
  });
});
