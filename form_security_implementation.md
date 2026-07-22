# Form security implementation log

This document records the contact-form security implementation in chronological order. It intentionally contains no production credentials or secret values.

## Changes

1. Created this implementation log before making any application changes.
2. Inspected the Vite/React contact page, router, build configuration, and current `public`/`dist` layout. Confirmed that the form was a client-only mock and that Vite currently builds only static assets.
3. Chose a deployment layout in which `dist/api/contact.php` is public, while `contact-form-private/config.php` and the writable rate-limit state live beside `public_html`. This keeps Gmail, Turnstile, and hashing secrets out of both the browser bundle and the public web root.
4. Chose a bounded JSON rate-limit store guarded by PHP `flock()` rather than MySQL. The state will contain only keyed hashes, timestamps, counters, and idempotency records—not raw IP addresses, email addresses, names, or message contents.
5. Chose direct authenticated Gmail SMTP over STARTTLS on port 587, using a Google App Password stored only in the private configuration. This avoids PHP `mail()` and removes the need to install a PHP package on Hostinger.
6. Added the PHP request handler and supporting classes under `server/api`. The handler accepts only same-origin JSON `POST` requests with a 16 KiB ceiling, validates every field and subject server-side, limits link-heavy messages, verifies a UUID request identifier and form age, and returns structured Spanish JSON responses.
7. Added a honeypot path that silently suppresses likely bot submissions without sending email.
8. Added mandatory Cloudflare Siteverify validation using PHP cURL. Validation includes the visitor IP, a request idempotency key, the configured production hostname allowlist, and the fixed `contact` action.
9. Added the private file rate limiter with exclusive locks, bounded state size, automatic expiry pruning, HMAC-keyed IP/email/message identifiers, coarse request limits, delivery limits, duplicate-message suppression, and 24-hour idempotency records. Storage failures fail closed.
10. Added a Gmail-only SMTP client that authenticates with an App Password, upgrades to verified TLS, uses a fixed Gmail `From` and recipient, places only the validated visitor email in `Reply-To`, and sends a UTF-8 plain-text message. No visitor input is accepted as an SMTP envelope address or arbitrary header.
11. Added privacy-preserving operational logging. It records event categories and short hashes of request IDs but never form contents, raw IP/email values, Turnstile tokens, or credentials.
12. Replaced the React form mock with a real same-origin request to `/api/contact.php`, including a 35-second timeout, stable idempotency ID for safe retry, the honeypot, client field limits, and accessible loading/error/success states. Form data is retained after failure and success is displayed only after the server confirms delivery.
13. Added an explicitly rendered Turnstile component suitable for the React SPA. It handles successful, failed, expired, and timed-out challenges, never creates a conventional response field, and resets consumed tokens after submission failures.
14. Added `.env.example` containing Cloudflare's public always-pass testing site key. Production builds require the real public site key; the secret is never a Vite variable.
15. Added a non-secret private PHP configuration template for the production origins/hostnames, Turnstile secret, Gmail App Password, SMTP addresses, rate-limit HMAC secret, and adjustable rate rules.
16. Added a packaging script so `npm run build` copies the PHP endpoint and Hostinger `.htaccess` rules into `dist` after Vite finishes.
17. Added Apache rules for React Router fallback, real-file/API preservation, directory-index protection, and baseline browser security headers. The API adds stricter no-store and framing headers.
18. Added `FORM_DEPLOYMENT.md` with the complete Cloudflare, Google, build, private-directory, Hostinger, permissions, and production verification procedure.
19. Adjusted the loading indicator to the `Loader2` icon exported by the project's installed Lucide version after the initial TypeScript verification identified the version mismatch.
20. Separated SMTP delivery failure handling from post-delivery rate-state finalization. Once Gmail has accepted a message, a later state-file error is logged but no false failure is returned to the visitor, avoiding duplicate retry prompts.
21. Increased the browser request timeout to 35 seconds so the configured Turnstile and SMTP timeouts have sufficient end-to-end headroom.
22. Made a failed Turnstile script load removable and retryable rather than leaving an unusable script element cached in the page.
23. Added a dependency-free PHP rate-limiter test covering idempotent retries, duplicate-message blocking, per-IP attempt limits, per-email delivery limits, and verification that raw IP, email, and message values never enter the state file.
24. Added production guardrails that stop builds using a missing or Cloudflare testing site key and reject Cloudflare testing secrets on the server unless an explicitly test-only configuration opts in. This prevents an accidentally deployable CAPTCHA bypass configuration.
25. Added a dependency-free HTTP integration test that starts an isolated PHP server and verifies method rejection, origin rejection, malformed JSON handling, non-revealing honeypot suppression, private state creation, and absence of raw request identifiers in that state.
26. Removed the existing but unused `@supabase/supabase-js` dependency after the production dependency audit traced a high-severity `ws` advisory to that unused tree. Regenerated the lockfile metadata and confirmed the production dependency audit now reports zero vulnerabilities.
27. Added a production Content Security Policy to the packaged root `.htaccess`. It permits the existing inline standalone tools, Google Fonts, and Cloudflare Turnstile while restricting all other script, frame, connection, object, base, and form destinations.
28. Added Git ignore rules for any local private contact configuration, private deployment directory, and rate-limit state file, then linked the deployment guide and ordered security log from the project README.
29. Verified that the production build guard rejects a missing Turnstile site key. Verified the build separately with Cloudflare's test site key using the explicit local-test override; this generated build is for verification only and must be rebuilt with the real production site key before upload.
30. Parsed and linted every PHP source and test file with PHP 8.3.32. No PHP syntax errors were found.
31. Ran the PHP rate-limiter test successfully, covering HMAC privacy, locking-backed state transitions, idempotency, duplicate blocking, and per-IP/per-email limits.
32. Ran the isolated PHP HTTP integration test successfully, covering `POST` enforcement, same-origin enforcement, malformed JSON rejection, honeypot suppression, and private state behavior.
33. Ran TypeScript checking, ESLint, the Vite production build, API packaging, source-to-`dist` hash comparison, and whitespace validation successfully.
34. Reinstalled dependencies from the committed lockfile after the development server was stopped and confirmed the workspace build uses the locked Vite, React plugin, and Rollup versions.
35. Ran `npm audit --omit=dev` successfully with zero production dependency vulnerabilities. The full audit still reports advisories in development-only build/lint packages, which are not included in the deployed static site.
36. Updated the form's privacy notice so it accurately discloses that Google and Cloudflare act as external technology providers for delivery and anti-spam protection, while retaining the data-use limitation and warning against submitting sensitive clinical information.
37. Added a build-time `VITE_CONTACT_FORM_ENABLED` switch that defaults to disabled. In this temporary state, the contact page displays a clear Spanish availability notice, does not render Cloudflare Turnstile, and cannot initiate a form submission.
38. Updated the production build guard so a disabled-form build does not require a Turnstile site key, while retaining strict real-key validation whenever the form is enabled.
39. Updated the deployment guide and environment template with the exact activation sequence for enabling the form later.
