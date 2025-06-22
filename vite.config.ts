import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/_tests_/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'src/_tests_/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
    include: [
      'src/_tests_/**/*.test.{ts,tsx}',
      'src/_tests_/integration/**/*.integration.test.{ts,tsx}',
      'src/_tests_/system/**/*.system.test.{ts,tsx}',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});