import { delay, TimeoutError } from '../src/index';
import type { DelayUntilOptions } from '../src/index';

describe('deca-delay public API', () => {
  const TIMING_TOLERANCE = 50;

  describe('delay()', () => {
    it('should be a function', () => {
      expect(typeof delay).toBe('function');
    });

    it('should delay for specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(100 - TIMING_TOLERANCE);
    });
  });

  describe('delay.random()', () => {
    it('should be a function', () => {
      expect(typeof delay.random).toBe('function');
    });

    it('should delay within specified range', async () => {
      const start = Date.now();
      await delay.random(100, 200);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(100 - TIMING_TOLERANCE);
      expect(elapsed).toBeLessThan(200 + TIMING_TOLERANCE * 2);
    });
  });

  describe('delay.until()', () => {
    it('should be a function', () => {
      expect(typeof delay.until).toBe('function');
    });

    it('should wait for sync condition', async () => {
      let ready = false;
      setTimeout(() => {
        ready = true;
      }, 100);

      await delay.until(() => ready, { interval: 30 });
      expect(ready).toBe(true);
    });

    it('should wait for async condition', async () => {
      let ready = false;
      setTimeout(() => {
        ready = true;
      }, 100);

      await delay.until(async () => ready, { interval: 30 });
      expect(ready).toBe(true);
    });

    it('should throw TimeoutError on timeout', async () => {
      await expect(
        delay.until(() => false, { timeout: 100, interval: 20 })
      ).rejects.toThrow(TimeoutError);
    });
  });

  describe('Combined usage', () => {
    it('should work with delay followed by until', async () => {
      let ready = false;

      // Start a delay, then set ready
      delay(100).then(() => {
        ready = true;
      });

      // Wait for ready to be true
      await delay.until(() => ready, { interval: 30, timeout: 500 });
      expect(ready).toBe(true);
    });

    it('should work with random delay in retry pattern', async () => {
      let attempts = 0;
      const maxAttempts = 3;

      const simulateOperation = async (): Promise<boolean> => {
        attempts++;
        // Succeed on third attempt
        return attempts >= maxAttempts;
      };

      // Retry with random backoff
      while (attempts < maxAttempts) {
        const success = await simulateOperation();
        if (success) break;
        await delay.random(10, 30); // Small random backoff
      }

      expect(attempts).toBe(maxAttempts);
    });

    it('should work with until for polling', async () => {
      let counter = 0;
      const targetValue = 5;

      // Increment counter every 20ms
      const intervalId = setInterval(() => {
        counter++;
      }, 20);

      try {
        await delay.until(() => counter >= targetValue, {
          interval: 10,
          timeout: 500,
        });

        expect(counter).toBeGreaterThanOrEqual(targetValue);
      } finally {
        clearInterval(intervalId);
      }
    });
  });

  describe('Type exports', () => {
    it('should allow using DelayUntilOptions type', () => {
      const options: DelayUntilOptions = {
        interval: 100,
        timeout: 5000,
      };

      expect(options.interval).toBe(100);
      expect(options.timeout).toBe(5000);
    });
  });
});
