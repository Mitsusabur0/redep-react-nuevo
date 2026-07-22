<?php

declare(strict_types=1);

namespace Redep\Contact;

use RuntimeException;

final class TurnstileVerifier
{
    private const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    public function __construct(private readonly array $config)
    {
    }

    public function verify(string $token, string $ipAddress, string $requestId): void
    {
        if (!function_exists('curl_init')) {
            throw new RuntimeException('The cURL PHP extension is required');
        }

        $handle = curl_init(self::VERIFY_URL);
        if ($handle === false) {
            throw new RuntimeException('Turnstile verification could not be initialized');
        }

        $body = http_build_query([
            'secret' => $this->config['secret'],
            'response' => $token,
            'remoteip' => $ipAddress,
            'idempotency_key' => $requestId,
        ], '', '&', PHP_QUERY_RFC3986);

        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => (int) ($this->config['timeout_seconds'] ?? 10),
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        $rawResponse = curl_exec($handle);
        $httpStatus = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        $curlError = curl_errno($handle);
        curl_close($handle);

        if (!is_string($rawResponse) || $curlError !== 0 || $httpStatus !== 200) {
            throw new RuntimeException('Turnstile verification service is unavailable');
        }

        try {
            $result = json_decode($rawResponse, true, 16, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new RuntimeException('Turnstile returned an invalid response');
        }

        if (!is_array($result) || ($result['success'] ?? false) !== true) {
            throw new ClientRequestException(422, 'TURNSTILE_FAILED', 'No pudimos completar la verificación de seguridad. Inténtalo nuevamente.');
        }

        $hostname = strtolower(rtrim((string) ($result['hostname'] ?? ''), '.'));
        $expectedHostnames = array_map(
            static fn (mixed $value): string => strtolower(rtrim((string) $value, '.')),
            $this->config['expected_hostnames']
        );
        if ($hostname === '' || !in_array($hostname, $expectedHostnames, true)) {
            throw new ClientRequestException(422, 'TURNSTILE_HOSTNAME_MISMATCH', 'No pudimos validar el sitio de origen.');
        }

        if (($result['action'] ?? null) !== $this->config['expected_action']) {
            throw new ClientRequestException(422, 'TURNSTILE_ACTION_MISMATCH', 'No pudimos validar la acción solicitada.');
        }
    }
}

