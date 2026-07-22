<?php

declare(strict_types=1);

use Redep\Contact\ClientRequestException;
use Redep\Contact\GmailSmtpClient;
use Redep\Contact\RateLimiter;
use Redep\Contact\RateLimitException;
use Redep\Contact\TurnstileVerifier;

use function Redep\Contact\clientIpAddress;
use function Redep\Contact\enforceRequestEnvelope;
use function Redep\Contact\loadPrivateConfig;
use function Redep\Contact\logContactEvent;
use function Redep\Contact\readAndValidatePayload;
use function Redep\Contact\respondJson;

require __DIR__ . '/src/Http.php';
require __DIR__ . '/src/RateLimiter.php';
require __DIR__ . '/src/TurnstileVerifier.php';
require __DIR__ . '/src/GmailSmtpClient.php';

ini_set('display_errors', '0');

try {
    $config = loadPrivateConfig();
    enforceRequestEnvelope($config);
    $payload = readAndValidatePayload();
    $ipAddress = clientIpAddress();

    $limiter = new RateLimiter($config['rate_limit']);
    $fingerprint = $limiter->fingerprint($payload);
    $attemptStatus = $limiter->registerAttempt($ipAddress, $payload['request_id'], $fingerprint);

    if ($attemptStatus === 'sent' || $attemptStatus === 'suppressed') {
        respondJson(200, 'MESSAGE_SENT', 'Tu mensaje fue recibido correctamente.');
    }
    if ($attemptStatus === 'pending') {
        respondJson(409, 'REQUEST_IN_PROGRESS', 'Este mensaje ya está siendo procesado. Espera unos segundos antes de reintentar.');
    }

    if ($payload['website'] !== '') {
        $limiter->markCompleted($payload['request_id'], $fingerprint, 'suppressed');
        logContactEvent('honeypot_suppressed', $payload['request_id']);
        respondJson(200, 'MESSAGE_SENT', 'Tu mensaje fue recibido correctamente.');
    }

    $turnstile = new TurnstileVerifier($config['turnstile']);
    $turnstile->verify($payload['turnstile_token'], $ipAddress, $payload['request_id']);

    $reservationStatus = $limiter->reserveDelivery(
        $ipAddress,
        $payload['email'],
        $payload['request_id'],
        $fingerprint
    );
    if ($reservationStatus === 'sent' || $reservationStatus === 'suppressed') {
        respondJson(200, 'MESSAGE_SENT', 'Tu mensaje fue recibido correctamente.');
    }
    if ($reservationStatus === 'pending') {
        respondJson(409, 'REQUEST_IN_PROGRESS', 'Este mensaje ya está siendo procesado. Espera unos segundos antes de reintentar.');
    }

    $mailer = new GmailSmtpClient($config['smtp']);
    try {
        $mailer->send($payload);
    } catch (Throwable) {
        try {
            $limiter->markFailed($payload['request_id'], $fingerprint);
        } catch (Throwable) {
            logContactEvent('rate_state_failure_after_smtp_error', $payload['request_id']);
        }
        logContactEvent('smtp_send_failed', $payload['request_id']);
        respondJson(503, 'DELIVERY_UNAVAILABLE', 'No pudimos enviar tu mensaje en este momento. Inténtalo nuevamente más tarde.');
    }

    try {
        $limiter->markCompleted($payload['request_id'], $fingerprint, 'sent');
    } catch (Throwable) {
        // Gmail already accepted the message. Do not report a false failure that could cause a duplicate retry.
        logContactEvent('rate_state_failure_after_smtp_success', $payload['request_id']);
    }

    logContactEvent('message_sent', $payload['request_id']);
    respondJson(200, 'MESSAGE_SENT', 'Tu mensaje fue recibido correctamente.');
} catch (RateLimitException $exception) {
    $retryAfter = max(1, min($exception->retryAfterSeconds, 86400));
    header('Retry-After: ' . $retryAfter);
    logContactEvent('rate_limited');
    respondJson(
        429,
        'RATE_LIMITED',
        'Se alcanzó el límite temporal de envíos. Inténtalo nuevamente más tarde.',
        ['retry_after' => $retryAfter]
    );
} catch (ClientRequestException $exception) {
    logContactEvent(strtolower($exception->publicCode));
    respondJson($exception->httpStatus, $exception->publicCode, $exception->publicMessage);
} catch (Throwable) {
    logContactEvent('unexpected_server_error');
    respondJson(500, 'SERVER_ERROR', 'No pudimos procesar tu solicitud en este momento.');
}
