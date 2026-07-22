<?php

declare(strict_types=1);

use Redep\Contact\RateLimiter;
use Redep\Contact\RateLimitException;

require dirname(__DIR__) . '/api/src/Http.php';
require dirname(__DIR__) . '/api/src/RateLimiter.php';

function assertSameValue(mixed $expected, mixed $actual, string $description): void
{
    if ($expected !== $actual) {
        throw new RuntimeException($description . ': expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
    }
}

function assertTrueValue(bool $condition, string $description): void
{
    if (!$condition) {
        throw new RuntimeException($description);
    }
}

function expectRateLimit(callable $callback, string $description): void
{
    try {
        $callback();
    } catch (RateLimitException $exception) {
        assertTrueValue($exception->retryAfterSeconds > 0, $description . ' provides a retry delay');
        return;
    }

    throw new RuntimeException($description . ': expected a rate-limit exception');
}

function limiterConfig(string $stateFile, array $overrides = []): array
{
    return array_replace_recursive([
        'state_file' => $stateFile,
        'hmac_secret' => str_repeat('a', 64),
        'max_state_bytes' => 1048576,
        'global_attempts' => ['limit' => 100, 'window_seconds' => 300],
        'ip_attempts' => ['limit' => 10, 'window_seconds' => 900],
        'ip_deliveries' => ['limit' => 5, 'window_seconds' => 3600],
        'email_deliveries' => ['limit' => 3, 'window_seconds' => 3600],
        'global_deliveries' => ['limit' => 50, 'window_seconds' => 86400],
        'duplicate_messages' => ['limit' => 1, 'window_seconds' => 86400],
    ], $overrides);
}

function payload(string $message): array
{
    return [
        'nombre' => 'Persona de prueba',
        'email' => 'person@example.com',
        'tema' => 'Consulta general',
        'mensaje' => $message,
    ];
}

$temporaryDirectory = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'redep-contact-test-' . bin2hex(random_bytes(8));
if (!mkdir($temporaryDirectory, 0700, true) && !is_dir($temporaryDirectory)) {
    throw new RuntimeException('Could not create the test directory');
}

try {
    $idempotencyFile = $temporaryDirectory . DIRECTORY_SEPARATOR . 'idempotency.json';
    $limiter = new RateLimiter(limiterConfig($idempotencyFile));
    $firstPayload = payload('Este es un mensaje válido para la prueba de idempotencia.');
    $fingerprint = $limiter->fingerprint($firstPayload);
    $firstRequest = '11111111-1111-4111-8111-111111111111';

    assertSameValue('new', $limiter->registerAttempt('192.0.2.10', $firstRequest, $fingerprint), 'First attempt is new');
    assertSameValue(
        'reserved',
        $limiter->reserveDelivery('192.0.2.10', $firstPayload['email'], $firstRequest, $fingerprint),
        'First delivery is reserved'
    );
    $limiter->markCompleted($firstRequest, $fingerprint, 'sent');
    assertSameValue('sent', $limiter->registerAttempt('192.0.2.10', $firstRequest, $fingerprint), 'A retry is idempotent');

    $duplicateRequest = '22222222-2222-4222-8222-222222222222';
    assertSameValue('new', $limiter->registerAttempt('192.0.2.11', $duplicateRequest, $fingerprint), 'Duplicate starts as a new request');
    expectRateLimit(
        fn () => $limiter->reserveDelivery('192.0.2.11', $firstPayload['email'], $duplicateRequest, $fingerprint),
        'Duplicate message is limited'
    );

    $storedState = file_get_contents($idempotencyFile);
    assertTrueValue(is_string($storedState), 'Rate-limit state is readable');
    assertTrueValue(!str_contains($storedState, '192.0.2.10'), 'Raw IP is not stored');
    assertTrueValue(!str_contains($storedState, 'person@example.com'), 'Raw email is not stored');
    assertTrueValue(!str_contains($storedState, $firstPayload['mensaje']), 'Raw message is not stored');

    $attemptFile = $temporaryDirectory . DIRECTORY_SEPARATOR . 'attempts.json';
    $attemptLimiter = new RateLimiter(limiterConfig($attemptFile, [
        'ip_attempts' => ['limit' => 2, 'window_seconds' => 900],
    ]));
    $attemptPayload = payload('Mensaje diferente para probar el límite de intentos.');
    $attemptFingerprint = $attemptLimiter->fingerprint($attemptPayload);
    $attemptLimiter->registerAttempt('192.0.2.20', '33333333-3333-4333-8333-333333333333', $attemptFingerprint);
    $attemptLimiter->registerAttempt('192.0.2.20', '44444444-4444-4444-8444-444444444444', $attemptFingerprint);
    expectRateLimit(
        fn () => $attemptLimiter->registerAttempt('192.0.2.20', '55555555-5555-4555-8555-555555555555', $attemptFingerprint),
        'Per-IP attempt limit is enforced'
    );

    $emailFile = $temporaryDirectory . DIRECTORY_SEPARATOR . 'email.json';
    $emailLimiter = new RateLimiter(limiterConfig($emailFile, [
        'email_deliveries' => ['limit' => 1, 'window_seconds' => 3600],
    ]));
    $emailFirstPayload = payload('Primer mensaje para probar el límite por correo.');
    $emailFirstFingerprint = $emailLimiter->fingerprint($emailFirstPayload);
    $emailFirstRequest = '66666666-6666-4666-8666-666666666666';
    $emailLimiter->registerAttempt('192.0.2.30', $emailFirstRequest, $emailFirstFingerprint);
    $emailLimiter->reserveDelivery('192.0.2.30', $emailFirstPayload['email'], $emailFirstRequest, $emailFirstFingerprint);
    $emailLimiter->markCompleted($emailFirstRequest, $emailFirstFingerprint, 'sent');

    $emailSecondPayload = payload('Segundo mensaje distinto para el mismo correo.');
    $emailSecondFingerprint = $emailLimiter->fingerprint($emailSecondPayload);
    $emailSecondRequest = '77777777-7777-4777-8777-777777777777';
    $emailLimiter->registerAttempt('192.0.2.31', $emailSecondRequest, $emailSecondFingerprint);
    expectRateLimit(
        fn () => $emailLimiter->reserveDelivery(
            '192.0.2.31',
            $emailSecondPayload['email'],
            $emailSecondRequest,
            $emailSecondFingerprint
        ),
        'Per-email delivery limit is enforced'
    );

    echo "Rate limiter tests passed.\n";
} finally {
    foreach (glob($temporaryDirectory . DIRECTORY_SEPARATOR . '*.json') ?: [] as $file) {
        unlink($file);
    }
    rmdir($temporaryDirectory);
}

