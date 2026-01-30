# deca-delay

A lightweight, modern NPM package providing enhanced asynchronous delay utilities for Node.js applications. Perfect for automation scripts, bots, and testing frameworks like Playwright or Puppeteer.

## Features

- **Simple API**: Clean and intuitive - `await delay(1500)` just works
- **Random delays**: Built-in jitter support for retries and backoffs
- **Conditional waiting**: Poll until a condition is met with `delay.until()`
- **Type safe**: Written in TypeScript with full type definitions
- **Zero dependencies**: Lightweight with no runtime dependencies
- **Dual format**: Supports both ESM and CommonJS

## Installation

```bash
# npm
npm install deca-delay

# yarn
yarn add deca-delay

# pnpm
pnpm add deca-delay
```

## Quick Start

```typescript
import { delay } from 'deca-delay';

// Fixed delay
await delay(1000); // Wait 1 second

// Random delay (great for avoiding rate limits)
await delay.random(500, 2000); // Wait 500-2000ms

// Wait for a condition
await delay.until(() => document.querySelector('#loaded') !== null);
```

## API Reference

### `delay(ms: number): Promise<void>`

Creates a Promise that resolves after the specified number of milliseconds.

**Parameters:**
- `ms` - The number of milliseconds to delay (must be non-negative)

**Returns:** A Promise that resolves after the delay

**Throws:** Error if `ms` is not a non-negative number

```typescript
await delay(1000); // Wait 1 second
await delay(0);    // Yields to event loop
```

---

### `delay.random(min: number, max: number): Promise<void>`

Creates a Promise that resolves after a random delay between min and max milliseconds. Useful for introducing jitter in retry logic or avoiding rate limits.

**Parameters:**
- `min` - Minimum delay in milliseconds (inclusive)
- `max` - Maximum delay in milliseconds (inclusive)

**Returns:** A Promise that resolves after a random delay

**Throws:**
- Error if `min` or `max` are not non-negative numbers
- Error if `min` is greater than `max`

```typescript
// Random delay between 500ms and 2 seconds
await delay.random(500, 2000);

// Exact delay (when min === max)
await delay.random(1000, 1000);
```

---

### `delay.until(condition, options?): Promise<void>`

Waits until a condition function returns true, polling at a specified interval. Supports both synchronous and asynchronous condition functions.

**Parameters:**
- `condition` - A function that returns `true` (or `Promise<true>`) when waiting should end
- `options` - Optional configuration object:
  - `interval` - Polling interval in milliseconds (default: `200`)
  - `timeout` - Maximum time to wait in milliseconds (default: `30000`)

**Returns:** A Promise that resolves when the condition is met

**Throws:**
- Error if condition is not a function
- `TimeoutError` if condition is not met within the timeout period

```typescript
// Sync condition
let ready = false;
setTimeout(() => ready = true, 1000);
await delay.until(() => ready);

// Async condition (e.g., with Playwright)
await delay.until(async () => await page.isVisible('#loaded'));

// With custom options
await delay.until(() => data !== null, {
  interval: 100,  // Check every 100ms
  timeout: 5000   // Give up after 5 seconds
});
```

---

### `TimeoutError`

Custom error class thrown when `delay.until()` times out.

**Properties:**
- `timeout` - The timeout value in milliseconds
- `message` - Error message
- `name` - Always `'TimeoutError'`

```typescript
import { delay, TimeoutError } from 'deca-delay';

try {
  await delay.until(() => false, { timeout: 1000 });
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log(`Timed out after ${error.timeout}ms`);
  }
}
```

## TypeScript

deca-delay is written in TypeScript and includes full type definitions.

```typescript
import { delay, TimeoutError } from 'deca-delay';
import type { DelayUntilOptions, Condition } from 'deca-delay';

// Type-safe options
const options: DelayUntilOptions = {
  interval: 100,
  timeout: 5000
};

// Type-safe condition
const isReady: Condition = async () => {
  const response = await fetch('/api/status');
  return response.ok;
};

await delay.until(isReady, options);
```

## Examples

### Playwright/Puppeteer Integration

```typescript
import { delay } from 'deca-delay';
import { chromium } from 'playwright';

async function automateLogin() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://example.com/login');
  
  // Wait for page to be interactive
  await delay.until(async () => await page.isVisible('#login-form'));
  
  // Fill credentials with human-like delays
  await page.fill('#username', 'user@example.com');
  await delay.random(100, 300); // Human-like typing pause
  
  await page.fill('#password', 'password');
  await delay.random(200, 500);
  
  await page.click('#submit');
  
  // Wait for successful login
  await delay.until(
    async () => await page.isVisible('#dashboard'),
    { timeout: 10000 }
  );
  
  console.log('Login successful!');
  await browser.close();
}
```

### Retry with Exponential Backoff

```typescript
import { delay } from 'deca-delay';

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff with jitter
        const baseDelay = Math.pow(2, attempt) * 1000;
        await delay.random(baseDelay, baseDelay * 1.5);
      }
    }
  }
  
  throw lastError;
}

// Usage
const data = await fetchWithRetry(async () => {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) throw new Error('API error');
  return response.json();
});
```

### Polling for API Status

```typescript
import { delay, TimeoutError } from 'deca-delay';

async function waitForJobCompletion(jobId: string): Promise<JobResult> {
  let result: JobResult | null = null;
  
  try {
    await delay.until(
      async () => {
        const response = await fetch(`/api/jobs/${jobId}`);
        const job = await response.json();
        
        if (job.status === 'completed') {
          result = job.result;
          return true;
        }
        
        if (job.status === 'failed') {
          throw new Error(job.error);
        }
        
        return false; // Still processing
      },
      {
        interval: 2000,   // Check every 2 seconds
        timeout: 300000   // 5 minute timeout
      }
    );
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw new Error(`Job ${jobId} did not complete within 5 minutes`);
    }
    throw error;
  }
  
  return result!;
}
```

### Rate Limiting

```typescript
import { delay } from 'deca-delay';

class RateLimiter {
  private lastRequest = 0;
  
  constructor(private minInterval: number) {}
  
  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    
    if (elapsed < this.minInterval) {
      await delay(this.minInterval - elapsed);
    }
    
    this.lastRequest = Date.now();
  }
}

// Usage: Max 10 requests per second
const limiter = new RateLimiter(100);

async function fetchAll(urls: string[]) {
  const results = [];
  
  for (const url of urls) {
    await limiter.throttle();
    results.push(await fetch(url));
  }
  
  return results;
}
```

### Animation Sequencing

```typescript
import { delay } from 'deca-delay';

async function fadeInSequence(elements: HTMLElement[]) {
  for (const element of elements) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.3s';
  }
  
  for (const element of elements) {
    element.style.opacity = '1';
    await delay(150); // Stagger each element
  }
}
```

## Local Development

### Testing with npm link

To test local changes before publishing:

```bash
# Build the package
npm run build

# Create a global link
npm link

# In your test project
npm link deca-delay
```

### Running tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Example consumer

Check out `examples/test-consumer` for a complete example of using deca-delay:

```bash
cd examples/test-consumer
npm install
npm test
```

## Requirements

- Node.js >= 14

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
