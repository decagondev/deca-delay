import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point
  entry: ['src/index.ts'],

  // Output formats: ESM and CommonJS
  format: ['esm', 'cjs'],

  // Generate TypeScript declaration files
  dts: true,

  // Generate source maps for debugging
  sourcemap: true,

  // Clean output directory before build
  clean: true,

  // Target Node.js 14+
  target: 'es2020',

  // Minify output for smaller bundle size
  minify: false,

  // Split code for better tree-shaking
  splitting: false,

  // Don't bundle external dependencies (we have none)
  external: [],

  // Output directory
  outDir: 'dist',

  // Entry file names
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
});
