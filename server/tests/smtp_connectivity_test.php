<?php

declare(strict_types=1);

/**
 * Non-authenticating network probe for Hostinger SMTP.
 *
 * This sends no credentials and no email. It only verifies that port 465 is
 * reachable over certificate-verified implicit TLS and advertises AUTH LOGIN.
 * It is intentionally separate from the offline PHP test suite.
 */

function readSmtpResponse(mixed $socket, array $expectedCodes, string $stage): array
{
    $lines = [];
    $code = 0;
    do {
        $line = fgets($socket, 8192);
        if ($line === false) {
            $metadata = stream_get_meta_data($socket);
            throw new RuntimeException(
                ($metadata['timed_out'] ?? false)
                    ? 'SMTP response timed out during ' . $stage
                    : 'SMTP response failed during ' . $stage
            );
        }
        $lines[] = rtrim($line, "\r\n");
        if (count($lines) > 100 || preg_match('/^(\d{3})([ -])/', $line, $matches) !== 1) {
            throw new RuntimeException('SMTP returned a malformed response during ' . $stage);
        }
        $code = (int) $matches[1];
        $continued = $matches[2] === '-';
    } while ($continued);

    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('Unexpected SMTP status ' . $code . ' during ' . $stage);
    }

    return $lines;
}

function writeSmtpCommand(mixed $socket, string $command): void
{
    if (preg_match('/[\r\n]/', $command) === 1) {
        throw new RuntimeException('Unsafe SMTP probe command');
    }
    if (fwrite($socket, $command . "\r\n") === false) {
        throw new RuntimeException('SMTP probe write failed');
    }
}

$host = 'smtp.hostinger.com';
$port = 465;
$timeout = 15;
$tlsMethod = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
    $tlsMethod |= constant('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT');
}
$context = stream_context_create([
    'ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'allow_self_signed' => false,
        'peer_name' => $host,
        'SNI_enabled' => true,
        'crypto_method' => $tlsMethod,
    ],
]);

$socket = stream_socket_client(
    'tls://' . $host . ':' . $port,
    $errorNumber,
    $errorMessage,
    $timeout,
    STREAM_CLIENT_CONNECT,
    $context
);
if ($socket === false) {
    throw new RuntimeException('Could not establish verified implicit TLS with Hostinger SMTP on port 465');
}
stream_set_timeout($socket, $timeout);

try {
    readSmtpResponse($socket, [220], 'connect');
    writeSmtpCommand($socket, 'EHLO connectivity-test.redepchile.com');
    $capabilities = readSmtpResponse($socket, [250], 'ehlo');
    if (!array_filter(
        $capabilities,
        static fn (string $line): bool => preg_match('/\bAUTH\b.*\bLOGIN\b/i', $line) === 1
    )) {
        throw new RuntimeException('Hostinger SMTP did not advertise AUTH LOGIN over implicit TLS');
    }
    $metadata = stream_get_meta_data($socket);
    $protocol = (string) ($metadata['crypto']['protocol'] ?? '');
    if (preg_match('/^TLSv1\.[23]$/', $protocol) !== 1) {
        throw new RuntimeException('Hostinger SMTP negotiated an unexpected TLS protocol');
    }

    writeSmtpCommand($socket, 'QUIT');
    readSmtpResponse($socket, [221], 'quit');
    echo 'Hostinger SMTP verified implicit TLS and AUTH LOGIN support passed (' . $protocol . ").\n";
} finally {
    fclose($socket);
}
