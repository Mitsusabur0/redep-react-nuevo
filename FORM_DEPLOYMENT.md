# Contact form deployment on Hostinger

The application code is prepared to send contact-form messages through the REDEP Chile mailbox:

- SMTP server: `smtp.hostinger.com`
- Primary connection: implicit TLS on port `465`
- Authenticated mailbox and sender: `formularios@redepchile.com`
- Recipient mailbox: `contacto@redepchile.com`
- Reply-To: the validated email entered by the visitor

The React site remains static. A small PHP endpoint is packaged at `public_html/api/contact.php`; it validates the request, verifies Cloudflare Turnstile, applies rate limits, and sends the message over authenticated SMTP. Secrets and writable rate-limit data must remain outside `public_html`.

## What is already completed

- The repository has been migrated from Gmail SMTP to Hostinger SMTP and pins the intended sender and recipient.
- The public endpoint, private-configuration loader, server-side validation, Turnstile verification, rate limiting, duplicate protection, privacy-preserving logs, and build packaging are implemented.
- The repository includes PHP 8.3 configuration, rate-limit, and HTTP integration tests, plus frontend type-check, lint, and production-build checks.
- A credential-free probe confirmed that `smtp.hostinger.com:465` currently supports certificate-verified implicit TLS and `AUTH LOGIN`.
- Public DNS currently has the expected Hostinger MX, SPF, DKIM, and DMARC records for `redepchile.com`.

These code changes exist in this project workspace only; they do not update the Hostinger account or live files. The local `dist` package must be uploaded together with the matching private configuration so the fixed sender and recipient settings remain synchronized.

## What you must provide

These items are external to the repository and cannot be completed in code:

- Access to Hostinger hPanel and its File Manager.
- A working Hostinger Email mailbox for `formularios@redepchile.com` and its current mailbox password. Confirm that it is a real mailbox that can sign in to Hostinger Webmail, not only an alias or forwarder.
- Access to the receiving mailbox `contacto@redepchile.com` so delivery and message headers can be verified.
- A Cloudflare Turnstile production site key and secret key.
- The ability to build the site locally and upload the resulting `dist` contents, or another deployment process that performs those same steps.
- Node.js `20.19.x`, or Node.js `22.12+`.

Never commit, place in a `VITE_` variable, or send through the browser bundle the mailbox password, Turnstile secret, or rate-limit HMAC secret.

## 1. Create the Cloudflare Turnstile widget

1. Sign in to Cloudflare and open **Turnstile**.
2. Create a widget in **Managed** mode.
3. Add both production hostnames:
   - `redepchile.com`
   - `www.redepchile.com`
4. Save the public **site key** and private **secret key** separately.

The site does not need to use Cloudflare DNS or proxying for Turnstile to work. The site key is compiled into the frontend and is public. The secret key belongs only in the private PHP configuration described below.

## 2. Confirm the Hostinger mailbox

1. In hPanel, open **Emails** and confirm that `formularios@redepchile.com` exists as a mailbox.
2. Sign in to Hostinger Webmail using that full email address and its mailbox password.
3. Confirm that `contacto@redepchile.com` exists and can receive mail.
4. Send a normal test message from `formularios@redepchile.com` to `contacto@redepchile.com` and confirm that it arrives.
5. If sender sign-in fails, reset the `formularios@redepchile.com` mailbox password before continuing.
6. Keep the exact working sender password available for the private configuration. This is the `formularios@redepchile.com` Hostinger mailbox password; the website does not need the password for `contacto@redepchile.com`.

## 3. Create the private Hostinger configuration

Use hPanel File Manager's option to access all files for the hosting account. Locate the directory that directly contains `public_html`, then create `contact-form-private` beside it:

```text
domain-directory/
|-- contact-form-private/
|   |-- config.php
|   `-- rate-limits.json     # created automatically after the first well-formed attempt
`-- public_html/
    |-- index.html
    |-- assets/
    |-- .htaccess
    `-- api/
        `-- contact.php
```

Do not put `contact-form-private` or the completed `config.php` inside `public_html`.

1. Upload [server/config.example.php](server/config.example.php) to `contact-form-private` and rename it to `config.php`.
2. Confirm that `allowed_origins` contains:
   - `https://redepchile.com`
   - `https://www.redepchile.com`
3. Confirm that `turnstile.expected_hostnames` contains the same hostnames without `https://`.
4. Replace the placeholder `turnstile.secret` with the private Turnstile secret key.
5. In the `smtp` section, confirm these non-secret settings:

   ```php
   'host' => 'smtp.hostinger.com',
   'port' => 465,
   'encryption' => 'implicit_tls',
   'username' => 'formularios@redepchile.com',
   'from_email' => 'formularios@redepchile.com',
   'to_email' => 'contacto@redepchile.com',
   ```

   Port `465` with `implicit_tls` is the primary production setting: the TLS handshake and certificate verification happen before the SMTP greeting or authentication. If Hostinger Support confirms that port `465` is unavailable for this hosting account, the client also supports this explicit manual fallback:

   ```php
   'port' => 587,
   'encryption' => 'starttls',
   ```

   Change the port and encryption value together. The application never automatically downgrades or retries delivery on port `587` after a port `465` failure; a transport change must be intentional in the private configuration.

6. Replace the placeholder `smtp.password` with the exact mailbox password verified in the previous section.
7. Generate a private HMAC secret of at least 32 random characters. With Node.js installed, run:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

8. Replace the placeholder `rate_limit.hmac_secret` with that generated value.
9. Keep `rate_limit.state_file` as `__DIR__ . '/rate-limits.json'`.
10. Start with permissions `700` for `contact-form-private` and `600` for `config.php`. If Hostinger's PHP worker cannot read or write there, try `750` and `640`; never make the secret file publicly accessible.

The endpoint normally finds the sibling directory from PHP's `DOCUMENT_ROOT`. If this hosting account uses a different layout, configure the server environment variable `CONTACT_FORM_CONFIG` with the absolute path to the private `config.php`. If hPanel does not expose environment-variable configuration, ask Hostinger Support to confirm the PHP `DOCUMENT_ROOT`, `open_basedir`, and a readable/writable private path. Do not solve this by moving secrets into `public_html`.

## 4. Configure and build the frontend

The production build must be created after obtaining the real Turnstile site key.

1. Copy `.env.example` to `.env.production.local`.
2. Set:

   ```env
   VITE_CONTACT_FORM_ENABLED=true
   VITE_TURNSTILE_SITE_KEY=YOUR_REAL_TURNSTILE_SITE_KEY
   ```

3. Install the locked dependencies if necessary:

   ```powershell
   npm ci
   ```

4. Create the production package:

   ```powershell
   npm run build
   ```

5. Confirm that the following exist:
   - `dist/index.html`
   - `dist/.htaccess`
   - `dist/api/contact.php`
   - `dist/api/src/`

The build intentionally fails when the form is enabled without a site key or with a Cloudflare testing key. `.env.production.local` is ignored by Git. It may contain the public site key, but it must never contain either private secret.

If you need to deploy the rest of the site before the external setup is ready, leave `VITE_CONTACT_FORM_ENABLED=false`, rebuild, and deploy that package. Visitors will see the temporary-unavailability notice and the browser will not load Turnstile or submit the form.

## 5. Upload the production package

1. Back up the current files in `public_html` through hPanel.
2. Upload the **contents** of `dist` into `public_html`. Do not upload `dist` as a nested directory.
3. Include hidden files, especially `dist/.htaccess`.
4. Ensure that the complete `dist/api` directory is uploaded, not only `contact.php`.
5. If the previous deployment left `public_html/api/src/GmailSmtpClient.php`, remove that obsolete file after confirming the new `SmtpClient.php` is present. The new endpoint does not use the Gmail-specific client.
6. Select a currently supported PHP 8 release in hPanel. PHP 8.3 is suitable.
7. Confirm that PHP cURL and OpenSSL are enabled.
8. Enable PHP error logging and keep `display_errors` disabled in production.
9. Keep HTTPS forced for both domain variants.
10. Exclude `/api/contact.php` from Hostinger, CDN, or plugin caching.

The packaged `.htaccess` preserves the PHP API and real assets while routing other paths to the React application. It also permits the Cloudflare Turnstile resources in the site's Content Security Policy.

## 6. Verify before announcing the form

Perform these checks from the final HTTPS website:

1. Open `https://redepchile.com/api/contact.php` directly. A JSON response with HTTP `405 Method Not Allowed` is expected for a browser GET. HTTP `500` means the private configuration could not be found, read, or validated; resolve that before testing the form.
2. Open `https://redepchile.com/contacto` and confirm that the form, rather than the temporary-unavailability message, is visible.
3. Confirm that Turnstile loads and completes.
4. Submit one real message using an address you can inspect.
5. Confirm that the page reports success only after delivery is accepted.
6. In the `contacto@redepchile.com` inbox, confirm that the received message has:
   - **From:** `formularios@redepchile.com`
   - **To:** `contacto@redepchile.com`
   - **Reply-To:** the visitor's submitted email
7. View the message's original source or full headers in Webmail and confirm that there are no SPF, DKIM, or DMARC failures.
8. Confirm that `contact-form-private/rate-limits.json` was created and remains outside public access.
9. Check Turnstile Analytics for a successful server-side validation.
10. Repeat the basic test on `https://www.redepchile.com/contacto` if that hostname remains publicly available.

## Troubleshooting

### The endpoint returns HTTP 500

- Confirm that the private directory is beside the actual `public_html` used by this domain.
- Confirm that the uploaded file is named exactly `config.php`, not `config.php.txt`.
- Compare every configuration key with the current [server/config.example.php](server/config.example.php).
- Check private-directory read/write permissions and Hostinger's `open_basedir` restrictions.
- Read the Hostinger PHP error log. Do not enable public error display. The endpoint now writes a safe reason code without logging credentials or form contents:
  - `config_unavailable`: PHP cannot find or read the private `config.php`.
  - `config_inside_public_root`: the configuration was placed inside `public_html`.
  - `config_invalid_format`: the file did not return the expected PHP array.
  - `origins_invalid`, `turnstile_config_invalid`, or `turnstile_test_key_rejected`: the corresponding security settings are invalid.
  - `smtp_config_invalid`: a Hostinger SMTP setting, fixed address, timeout, or password placeholder is invalid.
  - `rate_config_invalid` or `rate_state_path_invalid`: the rate-limit configuration or writable private directory is invalid.

### SMTP authentication or delivery fails

- Sign in to Hostinger Webmail again with `formularios@redepchile.com` and the same password stored in `smtp.password`.
- Confirm the primary settings are `smtp.hostinger.com`, port `465`, and `encryption` set to `implicit_tls`.
- Confirm that `username` and `from_email` are both exactly `formularios@redepchile.com`, and that `to_email` is exactly `contacto@redepchile.com`.
- Update the private configuration whenever the mailbox password is changed.
- Ask Hostinger Support whether outbound SMTP port `465` is available for the hosting account if connection attempts time out.
- From a checkout that has PHP with OpenSSL available, `npm run test:smtp-connectivity` performs a credential-free implicit-TLS probe against port `465`. It verifies the server certificate and advertised `AUTH LOGIN` capability but sends neither a password nor an email.
- Use port `587` with `encryption` set to `starttls` only as a deliberate fallback if port `465` is unavailable. Change both values together and retest; there is no automatic fallback or downgrade between the two modes.

### Turnstile fails

- Confirm that the frontend uses the widget's public site key and PHP uses its matching private secret.
- Confirm both domain variants are allowed in the Turnstile widget.
- Confirm the production build was made after `.env.production.local` was saved.
- Check the browser console, Turnstile Analytics, and PHP error log.

### The form still says it is unavailable

The deployed frontend was built with `VITE_CONTACT_FORM_ENABLED=false`, or an older cached build is being served. Set it to `true`, rebuild, upload the new `dist` contents, and clear the relevant Hostinger/CDN cache.

## Operational notes

- The endpoint never sends an automatic email to a visitor-supplied address, which prevents mail-bomb abuse.
- Visitor input is never accepted as the SMTP sender; it is used only as the validated `Reply-To` value.
- Turnstile tokens and form contents are not written to operational logs.
- The rate-limit file contains keyed hashes and timestamps, not raw IP addresses, email addresses, names, or messages.
- A malformed, oversized, or unwritable rate-limit state fails closed and sends no email.
- Delete `rate-limits.json` only when intentionally resetting all rate limits and idempotency records; PHP recreates it on the next request.
- After changing the mailbox password, immediately update `smtp.password` in the private configuration and retest.
- The repository's offline PHP checks can be rerun with `npm run test:php` on a machine with PHP 8.3 available.
