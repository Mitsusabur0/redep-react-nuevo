import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const githubPagesBase = '/redep-react-nuevo/';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? githubPagesBase : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
