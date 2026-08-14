<?php

declare(strict_types=1);

/**
 * Copy this file to the directory beside public_html:
 *
 *   contact-form-private/config.php
 *
 * Never place the completed file in public_html, dist, or Git.
 */
return [
    'allowed_origins' => [
        'https://redepchile.com',
        'https://www.redepchile.com',
    ],

    'turnstile' => [
        'secret' => 'replace-with-the-cloudflare-turnstile-secret',
        'expected_hostnames' => [
            'redepchile.com',
            'www.redepchile.com',
        ],
        'expected_action' => 'contact',
        'timeout_seconds' => 10,
    ],

    'smtp' => [
        'host' => 'smtp.hostinger.com',
        'port' => 465,
        'encryption' => 'implicit_tls',
        'username' => 'contacto@redepchile.com',
        'password' => 'replace-with-the-hostinger-mailbox-password',
        'from_email' => 'contacto@redepchile.com',
        'from_name' => 'REDEP Chile - Formulario web',
        'to_email' => 'redepchile@gmail.com',
        'timeout_seconds' => 15,
    ],

    'rate_limit' => [
        'state_file' => __DIR__ . '/rate-limits.json',
        'hmac_secret' => 'replace-with-at-least-32-random-characters',
        'max_state_bytes' => 1048576,

        // Coarse protection before calling Cloudflare or the SMTP server.
        'global_attempts' => ['limit' => 100, 'window_seconds' => 300],
        'ip_attempts' => ['limit' => 10, 'window_seconds' => 900],

        // Limits applied after a valid Turnstile result and before SMTP.
        'ip_deliveries' => ['limit' => 5, 'window_seconds' => 3600],
        'email_deliveries' => ['limit' => 3, 'window_seconds' => 3600],
        'global_deliveries' => ['limit' => 50, 'window_seconds' => 86400],
        'duplicate_messages' => ['limit' => 1, 'window_seconds' => 86400],
    ],
];
