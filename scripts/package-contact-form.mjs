import { cp, copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const serverRoot = join(projectRoot, 'server');
const distRoot = join(projectRoot, 'dist');

await mkdir(distRoot, { recursive: true });
await cp(join(serverRoot, 'api'), join(distRoot, 'api'), {
  recursive: true,
  force: true,
});
await copyFile(join(serverRoot, 'public-root.htaccess'), join(distRoot, '.htaccess'));

console.log('Packaged the contact API and Hostinger .htaccess into dist.');

