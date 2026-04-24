<?php

declare(strict_types=1);

namespace App\Http;

final class Router
{
    /** @var array<string, array<int, array{pattern:string, regex:string, keys:array<int,string>, handler:callable}>> */
    private array $routes = [];

    public function get(string $pattern, callable $handler): void
    {
        $this->add('GET', $pattern, $handler);
    }

    public function post(string $pattern, callable $handler): void
    {
        $this->add('POST', $pattern, $handler);
    }

    public function put(string $pattern, callable $handler): void
    {
        $this->add('PUT', $pattern, $handler);
    }

    public function delete(string $pattern, callable $handler): void
    {
        $this->add('DELETE', $pattern, $handler);
    }

    private function add(string $method, string $pattern, callable $handler): void
    {
        $keys = [];
        $regex = preg_replace_callback('/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/', static function (array $m) use (&$keys) {
            $keys[] = $m[1];
            return '([^/]+)';
        }, $pattern);
        $regex = '#^' . $regex . '$#';

        $this->routes[$method][] = [
            'pattern' => $pattern,
            'regex' => $regex,
            'keys' => $keys,
            'handler' => $handler,
        ];
    }

    public function dispatch(Request $request): Response
    {
        $method = strtoupper($request->method);
        $path = $request->path;

        foreach (($this->routes[$method] ?? []) as $route) {
            if (preg_match($route['regex'], $path, $matches) !== 1) {
                continue;
            }

            array_shift($matches);
            $params = [];
            foreach ($route['keys'] as $i => $key) {
                $params[$key] = $matches[$i] ?? null;
            }

            $result = ($route['handler'])($request, $params);
            if ($result instanceof Response) {
                return $result;
            }

            // Allow simple handlers to return arrays
            return Json::ok($result);
        }

        return Json::error(404, 'error.not_found');
    }
}

