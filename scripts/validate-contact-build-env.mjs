import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const environment = loadEnv('production', projectRoot, '');
const formEnabled = environment.VITE_CONTACT_FORM_ENABLED === 'true';
const siteKey = environment.VITE_TURNSTILE_SITE_KEY?.trim() ?? '';
const isCloudflareTestKey = /^[123]x0{20}/.test(siteKey);
const testKeyExplicitlyAllowed = process.env.ALLOW_TURNSTILE_TEST_KEY === 'true';

if (!formEnabled) {
  console.warn('Building with the contact form disabled; submissions and Turnstile will not be available.');
} else if (!siteKey) {
  throw new Error('VITE_TURNSTILE_SITE_KEY is required for a production build.');
} else if (isCloudflareTestKey && !testKeyExplicitlyAllowed) {
  throw new Error(
    'A Cloudflare Turnstile testing site key cannot be used for a production build. ' +
      'Use a real key, or set ALLOW_TURNSTILE_TEST_KEY=true only for local verification.',
  );
} else if (isCloudflareTestKey) {
  console.warn('Building with a Cloudflare testing site key; do not deploy this dist directory.');
}
