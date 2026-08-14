<?php

declare(strict_types=1);

use Redep\Contact\ConfigurationException;
use Redep\Contact\SmtpClient;

use function Redep\Contact\validateConfig;

require dirname(__DIR__) . '/api/src/Http.php';
require dirname(__DIR__) . '/api/src/SmtpClient.php';

function assertConfigTrue(bool $condition, string $description): void
{
    if (!$condition) {
        throw new RuntimeException($description);
    }
}

function validConfig(): array
{
    return [
        'allowed_origins' => [
            'https://redepchile.com',
            'https://www.redepchile.com',
        ],
        'turnstile' => [
            'secret' => str_repeat('t', 32),
            'expected_hostnames' => ['redepchile.com', 'www.redepchile.com'],
            'expected_action' => 'contact',
            'timeout_seconds' => 10,
        ],
        'smtp' => [
            'host' => 'smtp.hostinger.com',
            'port' => 465,
            'encryption' => 'implicit_tls',
            'username' => 'formularios@redepchile.com',
            'password' => ' valid mailbox password with spaces ',
            'from_email' => 'formularios@redepchile.com',
            'from_name' => 'REDEP Chile - Formulario web',
            'to_email' => 'contacto@redepchile.com',
            'timeout_seconds' => 15,
        ],
        'rate_limit' => [
            'state_file' => sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'rate-limits.json',
            'hmac_secret' => str_repeat('h', 64),
            'max_state_bytes' => 1048576,
            'global_attempts' => ['limit' => 100, 'window_seconds' => 300],
            'ip_attempts' => ['limit' => 10, 'window_seconds' => 900],
            'ip_deliveries' => ['limit' => 5, 'window_seconds' => 3600],
            'email_deliveries' => ['limit' => 3, 'window_seconds' => 3600],
            'global_deliveries' => ['limit' => 50, 'window_seconds' => 86400],
            'duplicate_messages' => ['limit' => 1, 'window_seconds' => 86400],
        ],
    ];
}

function expectConfigFailure(array $config, string $expectedEvent, string $description): void
{
    try {
        validateConfig($config);
    } catch (ConfigurationException $exception) {
        if ($exception->event !== $expectedEvent) {
            throw new RuntimeException(
                $description . ': expected event ' . $expectedEvent . ', got ' . $exception->event
            );
        }
        return;
    }

    throw new RuntimeException($description . ': expected configuration validation to fail');
}

$config = validConfig();
validateConfig($config);

$validStartTlsFallback = $config;
$validStartTlsFallback['smtp']['port'] = 587;
$validStartTlsFallback['smtp']['encryption'] = 'starttls';
validateConfig($validStartTlsFallback);

$invalidOrigin = $config;
$invalidOrigin['allowed_origins'] = ['https://redepchile.com/path'];
expectConfigFailure($invalidOrigin, 'origins_invalid', 'Origins with paths are rejected');

$insecureOrigin = $config;
$insecureOrigin['allowed_origins'] = ['http://redepchile.com'];
expectConfigFailure($insecureOrigin, 'origins_invalid', 'Non-HTTPS production origins are rejected');

$invalidHostname = $config;
$invalidHostname['turnstile']['expected_hostnames'] = ['https://redepchile.com'];
expectConfigFailure($invalidHostname, 'turnstile_config_invalid', 'Turnstile hostnames cannot include a scheme');

$testTurnstileSecret = $config;
$testTurnstileSecret['turnstile']['secret'] = '1x0000000000000000000000000000000AA';
expectConfigFailure($testTurnstileSecret, 'turnstile_test_key_rejected', 'Turnstile test secrets fail closed');
$testTurnstileSecret['turnstile']['allow_test_keys'] = true;
validateConfig($testTurnstileSecret);

$gmailHost = $config;
$gmailHost['smtp']['host'] = 'smtp.gmail.com';
expectConfigFailure($gmailHost, 'smtp_config_invalid', 'Gmail SMTP is rejected');

$startTlsOnImplicitTlsPort = $config;
$startTlsOnImplicitTlsPort['smtp']['encryption'] = 'starttls';
expectConfigFailure(
    $startTlsOnImplicitTlsPort,
    'smtp_config_invalid',
    'STARTTLS cannot be paired with the implicit-TLS port'
);

$implicitTlsOnSubmissionPort = $config;
$implicitTlsOnSubmissionPort['smtp']['port'] = 587;
expectConfigFailure(
    $implicitTlsOnSubmissionPort,
    'smtp_config_invalid',
    'Implicit TLS cannot be paired with the STARTTLS submission port'
);

$wrongSender = $config;
$wrongSender['smtp']['username'] = 'contacto@redepchile.com';
$wrongSender['smtp']['from_email'] = 'contacto@redepchile.com';
expectConfigFailure($wrongSender, 'smtp_config_invalid', 'The former authenticated sender is rejected');

$wrongRecipient = $config;
$wrongRecipient['smtp']['to_email'] = 'redepchile@gmail.com';
expectConfigFailure($wrongRecipient, 'smtp_config_invalid', 'The former Gmail recipient is rejected');

$unsafeFromName = $config;
$unsafeFromName['smtp']['from_name'] = "REDEP\r\nBcc: attacker@example.com";
expectConfigFailure($unsafeFromName, 'smtp_config_invalid', 'SMTP display-name header injection is rejected');

$invalidMaximumState = $config;
$invalidMaximumState['rate_limit']['max_state_bytes'] = 1024;
expectConfigFailure($invalidMaximumState, 'rate_config_invalid', 'Unsafe rate-state size bounds are rejected early');

$client = new SmtpClient($config['smtp']);
$buildMessage = Closure::bind(
    function (array $payload): string {
        return $this->buildMessage($payload);
    },
    $client,
    SmtpClient::class
);
assertConfigTrue($buildMessage instanceof Closure, 'SMTP message test can access the private builder');
$requestId = '11111111-1111-4111-8111-111111111111';
$message = $buildMessage([
    'nombre' => 'Persona de prueba',
    'email' => 'visitor@example.com',
    'tema' => 'Consulta general',
    'mensaje' => 'Mensaje de prueba para validar las cabeceras.',
    'request_id' => $requestId,
]);
assertConfigTrue(
    str_contains($message, "Message-ID: <contact-$requestId@redepchile.com>\r\n"),
    'SMTP message has a stable domain-aligned Message-ID'
);
assertConfigTrue(
    str_contains($message, "From: =?UTF-8?B?"),
    'SMTP message has the configured encoded From name'
);
assertConfigTrue(
    str_contains($message, " <formularios@redepchile.com>\r\n"),
    'SMTP message uses the fixed Hostinger sender'
);
assertConfigTrue(
    str_contains($message, "To: <contacto@redepchile.com>\r\n"),
    'SMTP message uses the fixed Hostinger recipient'
);
assertConfigTrue(
    str_contains($message, "Reply-To: <visitor@example.com>\r\n"),
    'SMTP message uses the visitor only as Reply-To'
);

echo "Configuration and SMTP message tests passed.\n";
