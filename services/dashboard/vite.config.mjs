import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react(), {
    name: 'synthetic-demo-entry',
    transformIndexHtml: {
      order: 'pre',
      handler(html) { return mode === 'demo' ? html.replace('/src/index.jsx', '/src/demo.jsx') : html; },
    },
  }],
  build: { outDir: 'build' },
}));
