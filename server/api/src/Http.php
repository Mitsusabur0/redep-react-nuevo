<?php

declare(strict_types=1);

namespace Redep\Contact;

use RuntimeException;

final class ClientRequestException extends RuntimeException
{
    public function __construct(
        public readonly int $httpStatus,
        public readonly string $publicCode,
        public readonly string $publicMessage
    ) {
        parent::__construct($publicCode);
    }
}

final class RateLimitException extends RuntimeException
{
    public function __construct(public readonly int $retryAfterSeconds)
    {
        parent::__construct('Contact form rate limit exceeded');
    }
}

final class ConfigurationException extends RuntimeException
{
    public function __construct(public readonly string $event, string $message)
    {
        parent::__construct($message);
    }
}

function respondJson(int $status, string $code, string $message, array $extra = []): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('Pragma: no-cache');
    header('X-Content-Type-Options: nosniff');

    $body = array_merge([
        'success' => $status >= 200 && $status < 300,
        'code' => $code,
        'message' => $message,
    ], $extra);

    $json = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    echo $json === false ? '{"success":false,"code":"SERVER_ERROR","message":"No pudimos procesar tu solicitud."}' : $json;
    exit;
}

function loadPrivateConfig(): array
{
    $configuredPath = getenv('CONTACT_FORM_CONFIG');
    $documentRoot = isset($_SERVER['DOCUMENT_ROOT']) ? rtrim((string) $_SERVER['DOCUMENT_ROOT'], DIRECTORY_SEPARATOR) : '';
    $configPath = is_string($configuredPath) && $configuredPath !== ''
        ? $configuredPath
        : dirname($documentRoot) . DIRECTORY_SEPARATOR . 'contact-form-private' . DIRECTORY_SEPARATOR . 'config.php';

    $realConfigPath = realpath($configPath);
    $realDocumentRoot = $documentRoot !== '' ? realpath($documentRoot) : false;

    if ($realConfigPath === false || !is_file($realConfigPath) || !is_readable($realConfigPath)) {
        throw new ConfigurationException('config_unavailable', 'Private contact-form configuration is unavailable');
    }

    if (
        $realDocumentRoot !== false
        && ($realConfigPath === $realDocumentRoot || str_starts_with($realConfigPath, $realDocumentRoot . DIRECTORY_SEPARATOR))
    ) {
        throw new ConfigurationException('config_inside_public_root', 'Private contact-form configuration must be outside the document root');
    }

    $config = require $realConfigPath;
    if (!is_array($config)) {
        throw new ConfigurationException('config_invalid_format', 'Private contact-form configuration must return an array');
    }

    validateConfig($config);

    $stateFile = (string) $config['rate_limit']['state_file'];
    $stateDirectory = realpath(dirname($stateFile));
    $configDirectory = dirname($realConfigPath);
    $realStateFile = realpath($stateFile);
    if (
        $stateDirectory === false
        || !is_dir($stateDirectory)
        || !is_writable($stateDirectory)
        || $stateDirectory !== $configDirectory
        || (
            $realStateFile !== false
            && (!is_file($realStateFile) || !is_writable($realStateFile))
        )
        || (
            $realDocumentRoot !== false
            && (
                $stateDirectory === $realDocumentRoot
                || str_starts_with($stateDirectory, $realDocumentRoot . DIRECTORY_SEPARATOR)
                || $realStateFile === $realDocumentRoot
                || ($realStateFile !== false && str_starts_with($realStateFile, $realDocumentRoot . DIRECTORY_SEPARATOR))
            )
        )
    ) {
        throw new ConfigurationException(
            'rate_state_path_invalid',
            'Rate-limit state must be writable beside the private configuration and outside the document root'
        );
    }

    return $config;
}

function validateConfig(array $config): void
{
    $allowedOrigins = $config['allowed_origins'] ?? null;
    if (!is_array($allowedOrigins) || $allowedOrigins === []) {
        throw new ConfigurationException('origins_invalid', 'At least one allowed origin is required');
    }

    foreach ($allowedOrigins as $origin) {
        if (!isValidOrigin($origin)) {
            throw new ConfigurationException('origins_invalid', 'Every allowed origin must be an HTTPS origin without a path');
        }
    }

    $turnstile = $config['turnstile'] ?? null;
    if (!is_array($turnstile) || !isNonPlaceholderSecret($turnstile['secret'] ?? null, 20)) {
        throw new ConfigurationException('turnstile_config_invalid', 'A valid Turnstile secret is required');
    }
    if (isTurnstileTestKey($turnstile['secret']) && ($turnstile['allow_test_keys'] ?? false) !== true) {
        throw new ConfigurationException('turnstile_test_key_rejected', 'Cloudflare testing secrets are disabled in production');
    }
    if (!is_array($turnstile['expected_hostnames'] ?? null) || $turnstile['expected_hostnames'] === []) {
        throw new ConfigurationException('turnstile_config_invalid', 'At least one Turnstile hostname is required');
    }
    foreach ($turnstile['expected_hostnames'] as $hostname) {
        if (!is_string($hostname) || preg_match('/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))+$/i', $hostname) !== 1) {
            throw new ConfigurationException('turnstile_config_invalid', 'Every Turnstile hostname must be a hostname without a scheme or path');
        }
    }
    if (($turnstile['expected_action'] ?? null) !== 'contact') {
        throw new ConfigurationException('turnstile_config_invalid', 'The Turnstile action must be contact');
    }
    $turnstileTimeout = $turnstile['timeout_seconds'] ?? null;
    if (!is_int($turnstileTimeout) || $turnstileTimeout < 3 || $turnstileTimeout > 30) {
        throw new ConfigurationException('turnstile_config_invalid', 'Turnstile timeout must be between 3 and 30 seconds');
    }

    $smtp = $config['smtp'] ?? null;
    if (!is_array($smtp)) {
        throw new ConfigurationException('smtp_config_invalid', 'SMTP configuration is required');
    }

    $smtpUsername = $smtp['username'] ?? null;
    $fromEmail = $smtp['from_email'] ?? null;
    $toEmail = $smtp['to_email'] ?? null;
    $smtpTimeout = $smtp['timeout_seconds'] ?? null;
    $fromName = $smtp['from_name'] ?? null;
    $smtpPort = (int) ($smtp['port'] ?? 0);
    $smtpEncryption = $smtp['encryption'] ?? null;
    $validTransport = ($smtpPort === 465 && $smtpEncryption === 'implicit_tls')
        || ($smtpPort === 587 && $smtpEncryption === 'starttls');
    if (
        ($smtp['host'] ?? null) !== 'smtp.hostinger.com'
        || !$validTransport
        || !is_string($smtpUsername)
        || filter_var($smtpUsername, FILTER_VALIDATE_EMAIL) === false
        || strcasecmp($smtpUsername, 'formularios@redepchile.com') !== 0
        || !is_string($fromEmail)
        || filter_var($fromEmail, FILTER_VALIDATE_EMAIL) === false
        || strcasecmp($smtpUsername, $fromEmail) !== 0
        || !is_string($toEmail)
        || filter_var($toEmail, FILTER_VALIDATE_EMAIL) === false
        || strcasecmp($toEmail, 'contacto@redepchile.com') !== 0
        || !is_string($fromName)
        || !isValidText($fromName, 1, 100, false)
        || !isNonPlaceholderSecret($smtp['password'] ?? null, 8)
        || !is_int($smtpTimeout)
        || $smtpTimeout < 5
        || $smtpTimeout > 60
    ) {
        throw new ConfigurationException('smtp_config_invalid', 'Hostinger SMTP configuration is invalid');
    }

    $rateLimit = $config['rate_limit'] ?? null;
    $maximumStateBytes = is_array($rateLimit) ? ($rateLimit['max_state_bytes'] ?? null) : null;
    if (
        !is_array($rateLimit)
        || !is_string($rateLimit['state_file'] ?? null)
        || ($rateLimit['state_file'] ?? '') === ''
        || !isNonPlaceholderSecret($rateLimit['hmac_secret'] ?? null, 32)
        || !is_int($maximumStateBytes)
        || $maximumStateBytes < 65536
        || $maximumStateBytes > 5242880
    ) {
        throw new ConfigurationException('rate_config_invalid', 'Rate-limit configuration is invalid');
    }

    foreach (['global_attempts', 'ip_attempts', 'ip_deliveries', 'email_deliveries', 'global_deliveries', 'duplicate_messages'] as $rule) {
        $value = $rateLimit[$rule] ?? null;
        if (
            !is_array($value)
            || !is_int($value['limit'] ?? null)
            || $value['limit'] < 1
            || !is_int($value['window_seconds'] ?? null)
            || $value['window_seconds'] < 1
        ) {
            throw new ConfigurationException('rate_config_invalid', 'A rate-limit rule is invalid: ' . $rule);
        }
    }
}

function isValidOrigin(mixed $value): bool
{
    if (!is_string($value) || filter_var($value, FILTER_VALIDATE_URL) === false) {
        return false;
    }

    $parts = parse_url($value);
    return is_array($parts)
        && ($parts['scheme'] ?? null) === 'https'
        && is_string($parts['host'] ?? null)
        && ($parts['host'] ?? '') !== ''
        && !isset($parts['user'])
        && !isset($parts['pass'])
        && !isset($parts['port'])
        && !isset($parts['query'])
        && !isset($parts['fragment'])
        && (!isset($parts['path']) || $parts['path'] === '');
}

function isNonPlaceholderSecret(mixed $value, int $minimumLength): bool
{
    if (!is_string($value) || strlen(trim($value)) < $minimumLength) {
        return false;
    }

    return stripos($value, 'replace') === false && stripos($value, 'change-me') === false;
}

function isTurnstileTestKey(string $value): bool
{
    return preg_match('/^[123]x0{20}/', $value) === 1;
}

function enforceRequestEnvelope(array $config): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        throw new ClientRequestException(405, 'METHOD_NOT_ALLOWED', 'Este formulario solo acepta solicitudes POST.');
    }

    $origin = rtrim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''), '/');
    $allowedOrigins = array_map(
        static fn (mixed $value): string => rtrim((string) $value, '/'),
        $config['allowed_origins']
    );

    if ($origin === '' || !in_array($origin, $allowedOrigins, true)) {
        throw new ClientRequestException(403, 'ORIGIN_REJECTED', 'No pudimos validar el origen de la solicitud.');
    }

    $contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
    if ($contentType !== 'application/json') {
        throw new ClientRequestException(415, 'UNSUPPORTED_MEDIA_TYPE', 'El formato de la solicitud no es válido.');
    }

    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > 16384) {
        throw new ClientRequestException(413, 'REQUEST_TOO_LARGE', 'La solicitud es demasiado grande.');
    }
}

function readAndValidatePayload(): array
{
    $rawBody = file_get_contents('php://input', false, null, 0, 16385);
    if (!is_string($rawBody) || $rawBody === '' || strlen($rawBody) > 16384) {
        throw new ClientRequestException(400, 'INVALID_REQUEST', 'No pudimos leer los datos del formulario.');
    }

    try {
        $input = json_decode($rawBody, true, 16, JSON_THROW_ON_ERROR);
    } catch (\JsonException) {
        throw new ClientRequestException(400, 'INVALID_JSON', 'Los datos enviados no tienen un formato válido.');
    }

    if (!is_array($input) || array_is_list($input)) {
        throw new ClientRequestException(400, 'INVALID_REQUEST', 'Los datos enviados no tienen un formato válido.');
    }

    $allowedKeys = ['nombre', 'email', 'tema', 'mensaje', 'website', 'turnstile_token', 'request_id', 'form_started_at'];
    if (array_diff(array_keys($input), $allowedKeys) !== []) {
        throw new ClientRequestException(400, 'UNEXPECTED_FIELDS', 'La solicitud contiene campos no permitidos.');
    }

    foreach (['nombre', 'email', 'tema', 'mensaje', 'website', 'turnstile_token', 'request_id'] as $field) {
        if (!array_key_exists($field, $input) || !is_string($input[$field])) {
            throw new ClientRequestException(422, 'INVALID_FIELDS', 'Revisa los campos del formulario e inténtalo nuevamente.');
        }
    }

    if (!array_key_exists('form_started_at', $input) || !is_int($input['form_started_at'])) {
        throw new ClientRequestException(422, 'INVALID_FIELDS', 'Revisa los campos del formulario e inténtalo nuevamente.');
    }

    $payload = [
        'nombre' => trim($input['nombre']),
        'email' => trim($input['email']),
        'tema' => trim($input['tema']),
        'mensaje' => normalizeMessage($input['mensaje']),
        'website' => trim($input['website']),
        'turnstile_token' => trim($input['turnstile_token']),
        'request_id' => strtolower(trim($input['request_id'])),
        'form_started_at' => $input['form_started_at'],
    ];

    if (!isValidText($payload['nombre'], 2, 100, false)) {
        throw new ClientRequestException(422, 'INVALID_NAME', 'Ingresa un nombre válido de entre 2 y 100 caracteres.');
    }

    if (
        textLength($payload['email']) > 254
        || preg_match('/[\x00-\x20\x7F]/', $payload['email']) === 1
        || filter_var($payload['email'], FILTER_VALIDATE_EMAIL) === false
    ) {
        throw new ClientRequestException(422, 'INVALID_EMAIL', 'Ingresa una dirección de correo válida.');
    }

    $allowedSubjects = [
        'Consulta general',
        'Endometriosis',
        'Adenomiosis',
        'Dolor pélvico',
        'Cirugías',
        'Apoyo al paciente',
        'Otro',
    ];
    if (!in_array($payload['tema'], $allowedSubjects, true)) {
        throw new ClientRequestException(422, 'INVALID_SUBJECT', 'Selecciona un tema válido.');
    }

    if (!isValidText($payload['mensaje'], 10, 3000, true)) {
        throw new ClientRequestException(422, 'INVALID_MESSAGE', 'El mensaje debe tener entre 10 y 3000 caracteres.');
    }

    $urlCount = preg_match_all('~(?:https?://|www\.)~iu', $payload['mensaje']);
    if ($urlCount === false || $urlCount > 3) {
        throw new ClientRequestException(422, 'TOO_MANY_LINKS', 'El mensaje contiene demasiados enlaces.');
    }

    $turnstileTokenLength = strlen($payload['turnstile_token']);
    if ($turnstileTokenLength > 2048 || ($payload['website'] === '' && $turnstileTokenLength < 1)) {
        throw new ClientRequestException(422, 'TURNSTILE_REQUIRED', 'Completa la verificación de seguridad.');
    }

    if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $payload['request_id']) !== 1) {
        throw new ClientRequestException(422, 'INVALID_REQUEST_ID', 'No pudimos identificar esta solicitud. Recarga la página e inténtalo nuevamente.');
    }

    $nowMilliseconds = (int) floor(microtime(true) * 1000);
    $formAge = $nowMilliseconds - $payload['form_started_at'];
    if ($formAge < 2000 || $formAge > 86400000) {
        throw new ClientRequestException(422, 'INVALID_FORM_TIME', 'Espera un momento, recarga el formulario e inténtalo nuevamente.');
    }

    return $payload;
}

function normalizeMessage(string $value): string
{
    $normalized = preg_replace('/\R/u', "\n", trim($value));
    return is_string($normalized) ? $normalized : '';
}

function isValidText(string $value, int $minimumLength, int $maximumLength, bool $allowLineBreaks): bool
{
    $length = textLength($value);
    if ($length < $minimumLength || $length > $maximumLength) {
        return false;
    }

    $controlPattern = $allowLineBreaks
        ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u'
        : '/[\x00-\x1F\x7F]/u';

    return preg_match($controlPattern, $value) !== 1;
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function clientIpAddress(): string
{
    $remoteAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    if (filter_var($remoteAddress, FILTER_VALIDATE_IP) === false) {
        throw new ClientRequestException(403, 'CLIENT_REJECTED', 'No pudimos validar el origen de la solicitud.');
    }

    return $remoteAddress;
}

function logContactEvent(string $event, ?string $requestId = null): void
{
    $safeEvent = preg_replace('/[^a-z0-9_-]/i', '', $event) ?: 'unknown';
    $requestReference = $requestId === null ? '' : ' request=' . substr(hash('sha256', $requestId), 0, 12);
    error_log('[contact-form] ' . $safeEvent . $requestReference);
}
