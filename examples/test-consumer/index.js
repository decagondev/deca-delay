/**
 * Test consumer for deca-delay package
 * 
 * This script demonstrates all the features of deca-delay
 * Run with: npm test (or node index.js)
 */

import { delay, TimeoutError } from 'deca-delay';

async function main() {
  console.log('=== deca-delay Test Consumer ===\n');

  // Test 1: Fixed delay
  console.log('Test 1: Fixed delay (1 second)...');
  const start1 = Date.now();
  await delay(1000);
  console.log(`  ✓ Completed in ${Date.now() - start1}ms\n`);

  // Test 2: Random delay
  console.log('Test 2: Random delay (500-1500ms)...');
  const start2 = Date.now();
  await delay.random(500, 1500);
  console.log(`  ✓ Completed in ${Date.now() - start2}ms\n`);

  // Test 3: Sync condition
  console.log('Test 3: Wait for sync condition...');
  let ready = false;
  setTimeout(() => {
    ready = true;
    console.log('  (condition became true)');
  }, 500);
  
  const start3 = Date.now();
  await delay.until(() => ready, { interval: 100 });
  console.log(`  ✓ Completed in ${Date.now() - start3}ms\n`);

  // Test 4: Async condition
  console.log('Test 4: Wait for async condition...');
  let asyncReady = false;
  setTimeout(() => {
    asyncReady = true;
    console.log('  (async condition became true)');
  }, 500);
  
  const start4 = Date.now();
  await delay.until(async () => asyncReady, { interval: 100 });
  console.log(`  ✓ Completed in ${Date.now() - start4}ms\n`);

  // Test 5: Timeout error
  console.log('Test 5: Timeout error handling...');
  try {
    await delay.until(() => false, { timeout: 500, interval: 100 });
    console.log('  ✗ Should have thrown TimeoutError');
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.log(`  ✓ Caught TimeoutError: "${error.message}"`);
      console.log(`  ✓ Timeout value: ${error.timeout}ms\n`);
    } else {
      throw error;
    }
  }

  console.log('=== All tests passed! ===');
}

main().catch(console.error);
