import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexPath = resolve(distDir, 'index.html');
const notFoundPath = resolve(distDir, '404.html');

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html was not found. Run vite build before creating the Pages fallback.');
}

copyFileSync(indexPath, notFoundPath);
console.log('Created dist/404.html for GitHub Pages SPA routing.');
