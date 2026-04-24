<?php

declare(strict_types=1);

namespace App\Http;

final class Request
{
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $headers,
        public readonly array $query,
        public readonly mixed $body,
    ) {
    }

    public static function fromGlobals(): self
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';

        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[$name] = $value;
            }
        }
        // PHP/Apache do not prefix these with HTTP_
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = $_SERVER['CONTENT_TYPE'];
        }
        if (isset($_SERVER['CONTENT_LENGTH'])) {
            $headers['content-length'] = $_SERVER['CONTENT_LENGTH'];
        }

        $raw = file_get_contents('php://input') ?: '';
        $contentType = strtolower((string)($headers['content-type'] ?? ''));
        $body = null;
        $rawTrimmed = ltrim($raw);
        $looksLikeJson = $rawTrimmed !== '' && ($rawTrimmed[0] === '{' || $rawTrimmed[0] === '[');
        if ($raw !== '' && (str_contains($contentType, 'application/json') || $looksLikeJson)) {
            $decoded = json_decode($raw, true);
            if (!is_array($decoded) && str_contains($raw, "\0")) {
                // Some clients (notably Windows/PowerShell) may send UTF-16 payloads.
                $utf8 = @iconv('UTF-16LE', 'UTF-8', $raw);
                if ($utf8 !== false) {
                    $decoded = json_decode($utf8, true);
                } else {
                    $utf8 = @iconv('UTF-16BE', 'UTF-8', $raw);
                    if ($utf8 !== false) {
                        $decoded = json_decode($utf8, true);
                    }
                }
            }
            $body = is_array($decoded) ? $decoded : null;
        } elseif ($raw !== '') {
            $body = $raw;
        } else {
            $body = null;
        }

        return new self(
            $method,
            $path,
            $headers,
            $_GET ?? [],
            $body,
        );
    }
}

