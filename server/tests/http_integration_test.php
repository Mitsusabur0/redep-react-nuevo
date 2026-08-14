<?php

declare(strict_types=1);

function assertHttpStatus(int $expected, array $response, string $description): void
{
    if ($response['status'] !== $expected) {
        throw new RuntimeException(
            $description . ': expected HTTP ' . $expected . ', got ' . $response['status'] . ' with body ' . $response['body']
        );
    }
}

function request(string $url, string $method, ?string $origin = null, ?string $body = null): array
{
    $headers = ['Accept: application/json'];
    if ($origin !== null) {
        $headers[] = 'Origin: ' . $origin;
    }
    if ($body !== null) {
        $headers[] = 'Content-Type: application/json';
        $headers[] = 'Content-Length: ' . strlen($body);
    }

    $context = stream_context_create([
        'http' => [
            'method' => $method,
            'header' => implode("\r\n", $headers),
            'content' => $body ?? '',
            'ignore_errors' => true,
            'timeout' => 5,
        ],
    ]);
    $responseBody = file_get_contents($url, false, $context);
    $responseHeaders = $http_response_header ?? [];
    preg_match('/\s(\d{3})\s/', $responseHeaders[0] ?? '', $statusMatch);

    return [
        'status' => isset($statusMatch[1]) ? (int) $statusMatch[1] : 0,
        'body' => is_string($responseBody) ? $responseBody : '',
        'headers' => $responseHeaders,
    ];
}

function assertHeaderMissing(array $response, string $headerName, string $description): void
{
    $prefix = strtolower($headerName) . ':';
    foreach ($response['headers'] as $header) {
        if (str_starts_with(strtolower($header), $prefix)) {
            throw new RuntimeException($description . ': unexpected header ' . $headerName);
        }
    }
}

function removeTestTree(string $path, string $expectedParent): void
{
    $realPath = realpath($path);
    $realParent = realpath($expectedParent);
    if ($realPath === false || $realParent === false || dirname($realPath) !== $realParent) {
        throw new RuntimeException('Refusing to remove an unexpected test path');
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($realPath, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($iterator as $item) {
        $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname());
    }
    rmdir($realPath);
}

$temporaryParent = sys_get_temp_dir();
$temporaryRoot = $temporaryParent . DIRECTORY_SEPARATOR . 'redep-http-test-' . bin2hex(random_bytes(8));
$documentRoot = $temporaryRoot . DIRECTORY_SEPARATOR . 'public_html';
$privateDirectory = $temporaryRoot . DIRECTORY_SEPARATOR . 'contact-form-private';
$projectRoot = dirname(__DIR__, 2);

mkdir($documentRoot . DIRECTORY_SEPARATOR . 'api', 0700, true);
mkdir($privateDirectory, 0700, true);

$sourceApi = $projectRoot . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'api';
$copyIterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($sourceApi, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);
foreach ($copyIterator as $item) {
    $relativePath = substr($item->getPathname(), strlen($sourceApi) + 1);
    $destination = $documentRoot . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . $relativePath;
    if ($item->isDir()) {
        mkdir($destination, 0700, true);
    } else {
        copy($item->getPathname(), $destination);
    }
}

$origin = 'https://redep.test';
$config = [
    'allowed_origins' => [$origin],
    'turnstile' => [
        'secret' => '1x00000000000000000000AA',
        'allow_test_keys' => true,
        'expected_hostnames' => ['redep.test'],
        'expected_action' => 'contact',
        'timeout_seconds' => 5,
    ],
    'smtp' => [
        'host' => 'smtp.hostinger.com',
        'port' => 465,
        'encryption' => 'implicit_tls',
        'username' => 'formularios@redepchile.com',
        'password' => 'test mailbox password',
        'from_email' => 'formularios@redepchile.com',
        'from_name' => 'REDEP test',
        'to_email' => 'contacto@redepchile.com',
        'timeout_seconds' => 5,
    ],
    'rate_limit' => [
        'state_file' => $privateDirectory . DIRECTORY_SEPARATOR . 'rate-limits.json',
        'hmac_secret' => str_repeat('b', 64),
        'max_state_bytes' => 1048576,
        'global_attempts' => ['limit' => 100, 'window_seconds' => 300],
        'ip_attempts' => ['limit' => 10, 'window_seconds' => 900],
        'ip_deliveries' => ['limit' => 5, 'window_seconds' => 3600],
        'email_deliveries' => ['limit' => 3, 'window_seconds' => 3600],
        'global_deliveries' => ['limit' => 50, 'window_seconds' => 86400],
        'duplicate_messages' => ['limit' => 1, 'window_seconds' => 86400],
    ],
];
$configContents = "<?php\n\ndeclare(strict_types=1);\n\nreturn " . var_export($config, true) . ";\n";
file_put_contents($privateDirectory . DIRECTORY_SEPARATOR . 'config.php', $configContents);

$server = null;
try {
    $portProbe = stream_socket_server('tcp://127.0.0.1:0', $errorNumber, $errorMessage);
    if ($portProbe === false) {
        throw new RuntimeException('Could not allocate a local HTTP test port');
    }
    $address = stream_socket_get_name($portProbe, false);
    fclose($portProbe);
    $port = (int) substr(strrchr((string) $address, ':'), 1);

    $command = [PHP_BINARY, '-S', '127.0.0.1:' . $port, '-t', $documentRoot];
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['file', $temporaryRoot . DIRECTORY_SEPARATOR . 'server-output.log', 'a'],
        2 => ['file', $temporaryRoot . DIRECTORY_SEPARATOR . 'server-error.log', 'a'],
    ];
    $server = proc_open($command, $descriptors, $pipes, $temporaryRoot);
    if (!is_resource($server)) {
        throw new RuntimeException('Could not start the PHP integration server');
    }
    fclose($pipes[0]);

    $ready = false;
    for ($attempt = 0; $attempt < 50; $attempt++) {
        $probe = @stream_socket_client('tcp://127.0.0.1:' . $port, $errorNumber, $errorMessage, 0.1);
        if ($probe !== false) {
            fclose($probe);
            $ready = true;
            break;
        }
        usleep(100000);
    }
    if (!$ready) {
        throw new RuntimeException('The PHP integration server did not start');
    }

    $endpoint = 'http://127.0.0.1:' . $port . '/api/contact.php';
    $getResponse = request($endpoint, 'GET');
    assertHttpStatus(405, $getResponse, 'Non-POST requests are rejected');
    assertHeaderMissing($getResponse, 'X-Powered-By', 'The endpoint suppresses PHP version disclosure');
    assertHttpStatus(403, request($endpoint, 'POST', 'https://attacker.example', '{}'), 'Cross-origin requests are rejected');
    assertHttpStatus(400, request($endpoint, 'POST', $origin, '{not-json'), 'Malformed JSON is rejected');

    $missingTurnstilePayload = json_encode([
        'nombre' => 'Persona de prueba',
        'email' => 'person@example.com',
        'tema' => 'Consulta general',
        'mensaje' => 'Este mensaje comprueba que una solicitud normal necesita Turnstile.',
        'website' => '',
        'turnstile_token' => '',
        'request_id' => 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'form_started_at' => (int) floor(microtime(true) * 1000) - 3000,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    assertHttpStatus(
        422,
        request($endpoint, 'POST', $origin, $missingTurnstilePayload),
        'Normal submissions require a Turnstile token'
    );

    $honeypotPayload = json_encode([
        'nombre' => 'Persona de prueba',
        'email' => 'person@example.com',
        'tema' => 'Consulta general',
        'mensaje' => 'Este mensaje válido activa únicamente la prueba del honeypot.',
        'website' => 'https://spam.example',
        'turnstile_token' => '',
        'request_id' => '88888888-8888-4888-8888-888888888888',
        'form_started_at' => (int) floor(microtime(true) * 1000) - 3000,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    $honeypotResponse = request($endpoint, 'POST', $origin, $honeypotPayload);
    assertHttpStatus(200, $honeypotResponse, 'Honeypot submissions receive a non-revealing success');
    $honeypotResult = json_decode($honeypotResponse['body'], true, 8, JSON_THROW_ON_ERROR);
    if (($honeypotResult['success'] ?? false) !== true) {
        throw new RuntimeException('Honeypot response did not contain success=true');
    }

    $state = file_get_contents($config['rate_limit']['state_file']);
    if (!is_string($state) || str_contains($state, 'person@example.com') || str_contains($state, '192.')) {
        throw new RuntimeException('HTTP integration state leaked raw request identifiers');
    }

    echo "HTTP integration tests passed.\n";
} catch (Throwable $exception) {
    $serverErrorLog = @file_get_contents($temporaryRoot . DIRECTORY_SEPARATOR . 'server-error.log');
    $diagnostic = is_string($serverErrorLog) && $serverErrorLog !== ''
        ? "\nPHP test-server log:\n" . $serverErrorLog
        : '';
    throw new RuntimeException($exception->getMessage() . $diagnostic, 0, $exception);
} finally {
    if (is_resource($server)) {
        proc_terminate($server);
        proc_close($server);
    }
    removeTestTree($temporaryRoot, $temporaryParent);
}
