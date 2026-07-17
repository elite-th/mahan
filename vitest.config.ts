import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest configuration for unit/integration tests.
 *
 * Tests live next to source files as `*.test.ts(x)` or under `src/__tests__/`.
 * The jsdom environment enables React Testing Library (DOM APIs).
 *
 * CSS is stubbed out (css.postcss = {}) so Vite doesn't try to load the
 * project's Tailwind PostCSS config, which uses a string-plugin format that
 * Vite doesn't understand. Unit tests don't need real CSS anyway.
 */
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {},
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e', 'tests/e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/app/**/layout.tsx',
        'src/app/**/loading.tsx',
        'src/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

