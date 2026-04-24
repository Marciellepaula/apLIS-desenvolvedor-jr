<?php

declare(strict_types=1);

require __DIR__ . '/../src/Bootstrap.php';

use App\Http\Request;
use App\Http\Router;
use App\Medicos\MedicoController;

$router = new Router();

$controller = new MedicoController();

// REST endpoints
$router->get('/health', fn () => ['ok' => true]);

$router->get('/api/v1/medicos', [$controller, 'index']);
$router->post('/api/v1/medicos', [$controller, 'create']);
$router->get('/api/v1/medicos/{id}', [$controller, 'show']);
$router->put('/api/v1/medicos/{id}', [$controller, 'update']);
$router->delete('/api/v1/medicos/{id}', [$controller, 'delete']);

try {
    $request = Request::fromGlobals();
    $router->dispatch($request)->send();
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'data' => null,
        'message' => 'error.unexpected',
        'error' => [
            'type' => get_class($e),
        ],
    ], JSON_UNESCAPED_UNICODE);
}

