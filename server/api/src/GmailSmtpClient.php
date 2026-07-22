<?php

declare(strict_types=1);

namespace Redep\Contact;

use RuntimeException;

final class GmailSmtpClient
{
    /** @var resource|null */
    private $socket = null;

    public function __construct(private readonly array $config)
    {
    }

    public function send(array $payload): void
    {
        $host = $this->config['host'];
        $port = (int) $this->config['port'];
        $timeout = (int) ($this->config['timeout_seconds'] ?? 15);
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'allow_self_signed' => false,
                'peer_name' => $host,
                'SNI_enabled' => true,
            ],
        ]);

        $socket = @stream_socket_client(
            'tcp://' . $host . ':' . $port,
            $errorNumber,
            $errorMessage,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );
        if ($socket === false) {
            throw new RuntimeException('SMTP connection failed');
        }

        $this->socket = $socket;
        stream_set_timeout($this->socket, $timeout);

        try {
            $this->expect([220], 'connect');
            $this->command('EHLO ' . $this->clientHostname(), [250], 'ehlo');
            $this->command('STARTTLS', [220], 'starttls');

            $cryptoEnabled = @stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if ($cryptoEnabled !== true) {
                throw new RuntimeException('SMTP TLS negotiation failed');
            }

            $this->command('EHLO ' . $this->clientHostname(), [250], 'secure_ehlo');
            $this->command('AUTH LOGIN', [334], 'auth');
            $this->command(base64_encode($this->config['username']), [334], 'username');
            $appPassword = str_replace(' ', '', $this->config['app_password']);
            $this->command(base64_encode($appPassword), [235], 'password');
            $this->command('MAIL FROM:<' . $this->config['from_email'] . '>', [250], 'mail_from');
            $this->command('RCPT TO:<' . $this->config['to_email'] . '>', [250, 251], 'recipient');
            $this->command('DATA', [354], 'data');
            $this->write($this->buildMessage($payload) . "\r\n.\r\n");
            $this->expect([250], 'message');

            try {
                $this->command('QUIT', [221], 'quit');
            } catch (RuntimeException) {
                // The message has already been accepted; a failed QUIT must not trigger a duplicate retry.
            }
        } finally {
            fclose($this->socket);
            $this->socket = null;
        }
    }

    private function buildMessage(array $payload): string
    {
        $fromName = $this->encodeHeader((string) ($this->config['from_name'] ?? 'REDEP Chile'));
        $subject = $this->encodeHeader('Nueva consulta web: ' . $payload['tema']);
        $date = gmdate('D, d M Y H:i:s O');
        $body = implode("\r\n", [
            'Se recibió una nueva consulta desde el formulario del sitio REDEP Chile.',
            '',
            'Nombre: ' . $payload['nombre'],
            'Correo: ' . $payload['email'],
            'Tema: ' . $payload['tema'],
            '',
            'Mensaje:',
            $payload['mensaje'],
            '',
            'Identificador de solicitud: ' . $payload['request_id'],
            'Fecha de recepción (UTC): ' . gmdate('Y-m-d H:i:s'),
        ]);

        $headers = [
            'Date: ' . $date,
            'From: ' . $fromName . ' <' . $this->config['from_email'] . '>',
            'To: <' . $this->config['to_email'] . '>',
            'Reply-To: <' . $payload['email'] . '>',
            'Subject: ' . $subject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            'Auto-Submitted: auto-generated',
            'X-Auto-Response-Suppress: All',
        ];

        $encodedBody = rtrim(chunk_split(base64_encode($body), 76, "\r\n"));
        return implode("\r\n", $headers) . "\r\n\r\n" . $encodedBody;
    }

    private function encodeHeader(string $value): string
    {
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }

    private function clientHostname(): string
    {
        $hostname = gethostname();
        if (!is_string($hostname) || preg_match('/^[a-z0-9.-]+$/i', $hostname) !== 1) {
            return 'localhost';
        }
        return $hostname;
    }

    private function command(string $command, array $expectedCodes, string $stage): void
    {
        if (preg_match('/[\r\n]/', $command) === 1) {
            throw new RuntimeException('Unsafe SMTP command');
        }
        $this->write($command . "\r\n");
        $this->expect($expectedCodes, $stage);
    }

    private function write(string $data): void
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('SMTP socket is unavailable');
        }

        $offset = 0;
        $length = strlen($data);
        while ($offset < $length) {
            $written = fwrite($this->socket, substr($data, $offset));
            if ($written === false || $written === 0) {
                throw new RuntimeException('SMTP write failed');
            }
            $offset += $written;
        }
    }

    private function expect(array $expectedCodes, string $stage): void
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('SMTP socket is unavailable');
        }

        $code = 0;
        $lineCount = 0;
        do {
            $line = fgets($this->socket, 8192);
            if ($line === false) {
                $metadata = stream_get_meta_data($this->socket);
                throw new RuntimeException(($metadata['timed_out'] ?? false) ? 'SMTP response timed out' : 'SMTP response failed');
            }
            $lineCount++;
            if ($lineCount > 100 || preg_match('/^(\d{3})([ -])/', $line, $matches) !== 1) {
                throw new RuntimeException('SMTP returned a malformed response');
            }
            $code = (int) $matches[1];
            $continued = $matches[2] === '-';
        } while ($continued);

        if (!in_array($code, $expectedCodes, true)) {
            throw new RuntimeException('SMTP stage failed: ' . $stage . ' (' . $code . ')');
        }
    }
}

