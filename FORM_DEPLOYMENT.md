# Secure contact form deployment

The React frontend remains static. The production build also contains a small PHP endpoint at `api/contact.php`. Gmail, Turnstile, and rate-limit secrets must stay outside `public_html`.

## 1. Create the Cloudflare Turnstile widget

1. Sign in to Cloudflare and open **Turnstile**.
2. Create a widget using **Managed** mode.
3. Add every hostname that can display the production form, such as `example.cl` and `www.example.cl`.
4. Save the public **site key** and private **secret key** separately.
5. Do not add the Turnstile secret to any `.env` file whose name begins with `VITE_`.

## 2. Prepare Gmail

1. Enable 2-Step Verification on `redepchile@gmail.com`.
2. Create a Google App Password specifically for the REDEP website.
3. Save the generated 16-character App Password. Do not use the account's normal password.
4. The implementation authenticates to `smtp.gmail.com` using STARTTLS on port 587. The Gmail account is both the fixed sender and recipient; the visitor's validated address is used only as `Reply-To`.

## 3. Configure the public build

1. Copy `.env.example` to `.env.production.local`.
2. Keep `VITE_CONTACT_FORM_ENABLED=false` while Gmail, Turnstile, or the private Hostinger configuration is unavailable. The built site will show a temporary-unavailability notice and will not load Turnstile or attempt submissions.
3. When every external service is ready, set `VITE_CONTACT_FORM_ENABLED=true`.
4. Replace the testing value of `VITE_TURNSTILE_SITE_KEY` with the production Turnstile site key. The site key is public.
5. Run `npm ci` if dependencies are not installed.
6. Run `npm run build`.
7. Confirm that `dist/api/contact.php` and `dist/.htaccess` exist.

When the form is enabled, the build stops if the site key is missing or is one of Cloudflare's public testing keys. The Turnstile secret and Gmail App Password are deliberately not part of this build.

## 4. Create the private Hostinger configuration

The expected Hostinger layout is:

```text
domain-directory/
├── contact-form-private/
│   ├── config.php
│   └── rate-limits.json       # created automatically on first request
└── public_html/
    ├── index.html
    ├── assets/
    └── api/contact.php
```

1. In hPanel File Manager, choose **Access all files of your web hosting**.
2. Find the directory containing `public_html`.
3. Create `contact-form-private` beside `public_html`, not inside it.
4. Upload `server/config.example.php` into that private directory and rename it to `config.php`.
5. Replace both example origins and hostnames with the real production values. Origins include `https://`; hostnames do not.
6. Insert the Turnstile secret.
7. Insert the Gmail App Password. Spaces in Google's displayed App Password are accepted, although removing them is preferable.
8. Generate at least 32 random characters for `hmac_secret`. For example, from this project on a machine with Node.js:

   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

9. Keep `state_file` pointing to `__DIR__ . '/rate-limits.json'`.
10. Give the private directory only the access needed by the hosting account and PHP. Start with directory permission `700` and configuration permission `600`; if Hostinger's PHP worker cannot read/write them, use `750` and `640` rather than making them public.

If Hostinger uses a document-root layout where the parent of `public_html` is not writable, set the `CONTACT_FORM_CONFIG` server environment variable to the absolute private `config.php` path. Never move the completed configuration into `public_html`.

## 5. Upload and configure Hostinger

1. Back up the current website files.
2. Upload the **contents** of `dist` to `public_html`; do not upload `dist` as a nested folder.
3. Select a current supported PHP 8 version in hPanel.
4. Confirm that the PHP cURL and OpenSSL extensions are enabled.
5. Enable PHP error logging and keep `display_errors` disabled in production.
6. Force HTTPS using Hostinger's SSL/HTTPS setting.
7. Do not enable a cache rule for `/api/contact.php`.

The packaged root `.htaccess` includes a Content Security Policy that allows the existing inline standalone applications, Google Fonts, and Cloudflare Turnstile while blocking plugins/objects and unapproved external script, frame, connection, and form targets. If Hostinger's Apache configuration rejects a directive, inspect the PHP/Apache error log before changing the policy.

## 6. Production verification

1. Open the contact page over its final HTTPS hostname.
2. Confirm that Turnstile completes and enables the submit button.
3. Submit one real test message.
4. Confirm that the page shows success only after the request returns successfully.
5. Confirm that the message appears in `redepchile@gmail.com`, has `redepchile@gmail.com` as its sender, and uses the visitor's address for **Reply-To**.
6. Confirm that `contact-form-private/rate-limits.json` was created and is not publicly reachable.
7. Check Turnstile Analytics for a successful Siteverify validation.
8. Check Hostinger's PHP error log if the endpoint returns an error. Logs intentionally omit names, email addresses, messages, IP addresses, tokens, and passwords.

## Operational notes

- Changing the main Google Account password revokes existing App Passwords. Generate a replacement and update the private configuration afterward.
- A malformed, oversized, or unwritable rate-limit state fails closed: the endpoint sends no email.
- Delete `rate-limits.json` only when intentionally resetting every rate limit and idempotency record. PHP will recreate it on the next request.
- Turnstile tokens are verified server-side and are never logged.
- The server rejects Cloudflare testing secrets unless a deliberately test-only configuration opts into them.
- The endpoint sends no automatic response to visitor-provided addresses, preventing mail-bomb abuse.
