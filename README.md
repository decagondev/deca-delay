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

## Requirements

- Node.js >= 14

## License

MIT
