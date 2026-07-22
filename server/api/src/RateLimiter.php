<?php

declare(strict_types=1);

namespace Redep\Contact;

use RuntimeException;

final class RateLimiter
{
    private string $stateFile;
    private string $hmacSecret;
    private int $maximumStateBytes;

    public function __construct(private readonly array $config)
    {
        $this->stateFile = $config['state_file'];
        $this->hmacSecret = $config['hmac_secret'];
        $this->maximumStateBytes = (int) ($config['max_state_bytes'] ?? 1048576);

        if ($this->maximumStateBytes < 65536 || $this->maximumStateBytes > 5242880) {
            throw new RuntimeException('Rate-limit state size is outside the allowed bounds');
        }
    }

    public function fingerprint(array $payload): string
    {
        $normalized = implode("\n", [
            $this->lowercase($payload['nombre']),
            strtolower($payload['email']),
            $payload['tema'],
            $this->lowercase($payload['mensaje']),
        ]);

        return $this->key('message', $normalized);
    }

    public function registerAttempt(string $ipAddress, string $requestId, string $fingerprint): string
    {
        return $this->mutate(function (array &$state, int $now) use ($ipAddress, $requestId, $fingerprint): string {
            $this->prune($state, $now);
            $existingStatus = $this->existingRequestStatus($state, $requestId, $fingerprint);
            if ($existingStatus === 'sent' || $existingStatus === 'suppressed' || $existingStatus === 'pending') {
                return $existingStatus;
            }

            $ipKey = $this->key('ip', $ipAddress);
            $globalRule = $this->config['global_attempts'];
            $ipRule = $this->config['ip_attempts'];

            $this->enforceLimit($state['global_attempts'], $globalRule, $now);
            $state['ip_attempts'][$ipKey] ??= [];
            $this->enforceLimit($state['ip_attempts'][$ipKey], $ipRule, $now);

            $state['global_attempts'][] = $now;
            $state['ip_attempts'][$ipKey][] = $now;
            $state['requests'][$requestId] = [
                'fingerprint' => $fingerprint,
                'status' => 'initiated',
                'updated_at' => $now,
                'expires_at' => $now + 86400,
            ];

            return 'new';
        });
    }

    public function reserveDelivery(
        string $ipAddress,
        string $email,
        string $requestId,
        string $fingerprint
    ): string {
        return $this->mutate(function (array &$state, int $now) use ($ipAddress, $email, $requestId, $fingerprint): string {
            $this->prune($state, $now);
            $existingStatus = $this->existingRequestStatus($state, $requestId, $fingerprint);
            if ($existingStatus === 'sent' || $existingStatus === 'suppressed') {
                return $existingStatus;
            }
            if ($existingStatus === 'pending') {
                return 'pending';
            }

            $ipKey = $this->key('ip', $ipAddress);
            $emailKey = $this->key('email', strtolower($email));
            $ipRule = $this->config['ip_deliveries'];
            $emailRule = $this->config['email_deliveries'];
            $globalRule = $this->config['global_deliveries'];
            $duplicateRule = $this->config['duplicate_messages'];

            $state['ip_deliveries'][$ipKey] ??= [];
            $state['email_deliveries'][$emailKey] ??= [];
            $this->enforceLimit($state['ip_deliveries'][$ipKey], $ipRule, $now);
            $this->enforceLimit($state['email_deliveries'][$emailKey], $emailRule, $now);
            $this->enforceLimit($state['global_deliveries'], $globalRule, $now);

            $duplicate = $state['duplicates'][$fingerprint] ?? null;
            if (is_array($duplicate) && ($duplicate['request_id'] ?? null) !== $requestId) {
                $retryAfter = max(1, ((int) $duplicate['time'] + $duplicateRule['window_seconds']) - $now);
                throw new RateLimitException($retryAfter);
            }

            $state['ip_deliveries'][$ipKey][] = $now;
            $state['email_deliveries'][$emailKey][] = $now;
            $state['global_deliveries'][] = $now;
            $state['duplicates'][$fingerprint] = ['request_id' => $requestId, 'time' => $now];
            $state['requests'][$requestId] = [
                'fingerprint' => $fingerprint,
                'status' => 'pending',
                'updated_at' => $now,
                'expires_at' => $now + 86400,
            ];

            return 'reserved';
        });
    }

    public function markCompleted(string $requestId, string $fingerprint, string $status): void
    {
        if (!in_array($status, ['sent', 'suppressed'], true)) {
            throw new RuntimeException('Invalid completed request status');
        }

        $this->mutate(function (array &$state, int $now) use ($requestId, $fingerprint, $status): null {
            $this->prune($state, $now);
            $this->assertRequestFingerprint($state, $requestId, $fingerprint);
            $state['requests'][$requestId] = [
                'fingerprint' => $fingerprint,
                'status' => $status,
                'updated_at' => $now,
                'expires_at' => $now + 86400,
            ];
            return null;
        });
    }

    public function markFailed(string $requestId, string $fingerprint): void
    {
        $this->mutate(function (array &$state, int $now) use ($requestId, $fingerprint): null {
            $this->prune($state, $now);
            $this->assertRequestFingerprint($state, $requestId, $fingerprint);
            $state['requests'][$requestId] = [
                'fingerprint' => $fingerprint,
                'status' => 'failed',
                'updated_at' => $now,
                'expires_at' => $now + 3600,
            ];

            $duplicate = $state['duplicates'][$fingerprint] ?? null;
            if (is_array($duplicate) && ($duplicate['request_id'] ?? null) === $requestId) {
                unset($state['duplicates'][$fingerprint]);
            }
            return null;
        });
    }

    private function existingRequestStatus(array $state, string $requestId, string $fingerprint): ?string
    {
        $request = $state['requests'][$requestId] ?? null;
        if (!is_array($request)) {
            return null;
        }

        if (!hash_equals((string) ($request['fingerprint'] ?? ''), $fingerprint)) {
            throw new ClientRequestException(409, 'REQUEST_ID_CONFLICT', 'Esta solicitud no coincide con el formulario original. Recarga la página.');
        }

        return is_string($request['status'] ?? null) ? $request['status'] : null;
    }

    private function assertRequestFingerprint(array $state, string $requestId, string $fingerprint): void
    {
        $request = $state['requests'][$requestId] ?? null;
        if (!is_array($request) || !hash_equals((string) ($request['fingerprint'] ?? ''), $fingerprint)) {
            throw new RuntimeException('Request fingerprint is unavailable or mismatched');
        }
    }

    private function enforceLimit(array $timestamps, array $rule, int $now): void
    {
        if (count($timestamps) < $rule['limit']) {
            return;
        }

        $oldest = (int) min($timestamps);
        throw new RateLimitException(max(1, ($oldest + $rule['window_seconds']) - $now));
    }

    private function prune(array &$state, int $now): void
    {
        $state = array_replace_recursive($this->emptyState(), $state);

        $state['global_attempts'] = $this->recentTimestamps(
            $state['global_attempts'],
            $now - $this->config['global_attempts']['window_seconds']
        );
        $state['global_deliveries'] = $this->recentTimestamps(
            $state['global_deliveries'],
            $now - $this->config['global_deliveries']['window_seconds']
        );
        $this->pruneKeyedTimestamps($state['ip_attempts'], $now - $this->config['ip_attempts']['window_seconds']);
        $this->pruneKeyedTimestamps($state['ip_deliveries'], $now - $this->config['ip_deliveries']['window_seconds']);
        $this->pruneKeyedTimestamps($state['email_deliveries'], $now - $this->config['email_deliveries']['window_seconds']);

        foreach ($state['duplicates'] as $key => $duplicate) {
            if (!is_array($duplicate) || (int) ($duplicate['time'] ?? 0) <= $now - $this->config['duplicate_messages']['window_seconds']) {
                unset($state['duplicates'][$key]);
            }
        }

        foreach ($state['requests'] as $key => $request) {
            if (!is_array($request) || (int) ($request['expires_at'] ?? 0) <= $now) {
                unset($state['requests'][$key]);
            }
        }
    }

    private function pruneKeyedTimestamps(mixed &$groups, int $cutoff): void
    {
        if (!is_array($groups)) {
            $groups = [];
            return;
        }

        foreach ($groups as $key => $timestamps) {
            $groups[$key] = $this->recentTimestamps($timestamps, $cutoff);
            if ($groups[$key] === []) {
                unset($groups[$key]);
            }
        }
    }

    private function recentTimestamps(mixed $timestamps, int $cutoff): array
    {
        if (!is_array($timestamps)) {
            return [];
        }

        return array_values(array_filter(
            $timestamps,
            static fn (mixed $value): bool => is_int($value) && $value > $cutoff
        ));
    }

    private function mutate(callable $callback): mixed
    {
        $directory = dirname($this->stateFile);
        if (!is_dir($directory) || !is_writable($directory)) {
            throw new RuntimeException('Rate-limit directory is unavailable');
        }

        $handle = @fopen($this->stateFile, 'c+');
        if ($handle === false) {
            throw new RuntimeException('Rate-limit state cannot be opened');
        }

        try {
            if (!flock($handle, LOCK_EX)) {
                throw new RuntimeException('Rate-limit state cannot be locked');
            }

            $fileSize = fstat($handle)['size'] ?? 0;
            if (!is_int($fileSize) || $fileSize > $this->maximumStateBytes) {
                throw new RuntimeException('Rate-limit state is too large');
            }

            rewind($handle);
            $rawState = stream_get_contents($handle, $this->maximumStateBytes + 1);
            if (!is_string($rawState)) {
                throw new RuntimeException('Rate-limit state cannot be read');
            }

            if ($rawState === '') {
                $state = $this->emptyState();
            } else {
                try {
                    $state = json_decode($rawState, true, 32, JSON_THROW_ON_ERROR);
                } catch (\JsonException) {
                    throw new RuntimeException('Rate-limit state is corrupted');
                }
                if (!is_array($state) || ($state['version'] ?? null) !== 1) {
                    throw new RuntimeException('Rate-limit state has an invalid format');
                }
            }

            $result = $callback($state, time());
            $encodedState = json_encode($state, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
            if (strlen($encodedState) > $this->maximumStateBytes) {
                throw new RuntimeException('Rate-limit state reached its maximum size');
            }

            rewind($handle);
            if (!ftruncate($handle, 0) || !$this->writeAll($handle, $encodedState) || !fflush($handle)) {
                throw new RuntimeException('Rate-limit state cannot be persisted');
            }

            @chmod($this->stateFile, 0600);
            flock($handle, LOCK_UN);

            return $result;
        } finally {
            fclose($handle);
        }
    }

    private function writeAll(mixed $handle, string $contents): bool
    {
        $offset = 0;
        $length = strlen($contents);
        while ($offset < $length) {
            $written = fwrite($handle, substr($contents, $offset));
            if ($written === false || $written === 0) {
                return false;
            }
            $offset += $written;
        }
        return true;
    }

    private function emptyState(): array
    {
        return [
            'version' => 1,
            'global_attempts' => [],
            'ip_attempts' => [],
            'global_deliveries' => [],
            'ip_deliveries' => [],
            'email_deliveries' => [],
            'duplicates' => [],
            'requests' => [],
        ];
    }

    private function key(string $scope, string $value): string
    {
        return hash_hmac('sha256', $scope . "\0" . $value, $this->hmacSecret);
    }

    private function lowercase(string $value): string
    {
        return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
    }
}

