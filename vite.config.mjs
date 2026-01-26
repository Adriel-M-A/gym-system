import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./renderer"),
    },
  },
  base: './', // Important for Electron to load assets correctly in production
  root: path.join(__dirname, 'renderer'),
  publicDir: 'public',
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
