import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        // Free public Grants.gov search (no API key) — avoids browser CORS in dev
        '/api/grants.gov': {
          target: 'https://api.grants.gov',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/grants\.gov/, ''),
        },
        // Free USASpending awards API (no key)
        '/api/usaspending': {
          target: 'https://api.usaspending.gov',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/usaspending/, ''),
        },
      },
    },
    preview: {
      proxy: {
        '/api/grants.gov': {
          target: 'https://api.grants.gov',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/grants\.gov/, ''),
        },
        '/api/usaspending': {
          target: 'https://api.usaspending.gov',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/usaspending/, ''),
        },
      },
    },
  };
});
