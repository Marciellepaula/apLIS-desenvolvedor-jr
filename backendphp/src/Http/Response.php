<?php

declare(strict_types=1);

namespace App\Http;

final class Response
{
    public function __construct(
        private readonly int $status,
        private readonly array $payload,
        private readonly array $headers = [],
    ) {
    }

    public static function json(int $status, array $payload, array $headers = []): self
    {
        return new self($status, $payload, $headers);
    }

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: application/json; charset=utf-8');
        foreach ($this->headers as $name => $value) {
            header($name . ': ' . $value);
        }
        echo json_encode($this->payload, JSON_UNESCAPED_UNICODE);
    }
}

