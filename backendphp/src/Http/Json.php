<?php

declare(strict_types=1);

namespace App\Http;

final class Json
{
    public static function ok(mixed $data, string $message = ''): Response
    {
        return Response::json(200, [
            'success' => true,
            'data' => $data,
            'message' => $message,
        ]);
    }

    public static function created(mixed $data, string $message = ''): Response
    {
        return Response::json(201, [
            'success' => true,
            'data' => $data,
            'message' => $message,
        ]);
    }

    public static function error(int $status, string $message, mixed $data = null, array $extra = []): Response
    {
        return Response::json($status, array_merge([
            'success' => false,
            'data' => $data,
            'message' => $message,
        ], $extra));
    }
}

