# deca-delay Test Consumer

This is a test project to verify that deca-delay works correctly when used as a dependency.

## Setup

1. First, build the main package:
   ```bash
   cd ../..
   npm run build
   ```

2. Install dependencies in this project:
   ```bash
   npm install
   ```

3. Run the tests:
   ```bash
   npm test
   ```

## Alternative: Using npm link

You can also test using `npm link`:

```bash
# In the deca-delay root directory
npm link

# In this directory
npm link deca-delay
npm test
```

## What it tests

- Fixed delay (`delay(ms)`)
- Random delay (`delay.random(min, max)`)
- Sync condition (`delay.until(() => condition)`)
- Async condition (`delay.until(async () => condition)`)
- Timeout error handling (`TimeoutError`)
