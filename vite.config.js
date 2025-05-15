
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: './',
  base: './',
  server: {
    host: "::",
    port: 8080,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}));
