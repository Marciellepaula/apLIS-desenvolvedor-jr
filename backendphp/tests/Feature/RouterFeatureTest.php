<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Http\Request;
use App\Http\Router;
use PHPUnit\Framework\TestCase;

final class RouterFeatureTest extends TestCase
{
    public function testDispatchesRouteWithPathParam(): void
    {
        $router = new Router();
        $router->get('/api/v1/medicos/{id}', static function (Request $_req, array $params): array {
            return ['id' => (int) $params['id']];
        });

        $req = new Request('GET', '/api/v1/medicos/42', [], [], null);
        $res = $router->dispatch($req);

        ob_start();
        $res->send();
        $json = ob_get_clean();
        $data = json_decode($json ?: '', true);

        $this->assertTrue($data['success']);
        $this->assertSame(['id' => 42], $data['data']);
    }
}

