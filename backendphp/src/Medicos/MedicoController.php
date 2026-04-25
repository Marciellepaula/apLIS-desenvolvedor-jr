<?php

declare(strict_types=1);

namespace App\Medicos;

use App\Db\PdoFactory;
use App\Http\Json;
use App\Http\Request;
use App\Http\Response;
use App\I18n\Translator;
use PDOException;

final class MedicoController
{
    private readonly MedicoService $service;
    private readonly Translator $translator;

    public function __construct()
    {
        $pdo = PdoFactory::make();
        $repo = new MedicoRepository($pdo);
        $this->service = new MedicoService($repo);
        $this->translator = new Translator();
    }

    public function index(Request $_req, array $_params = []): Response
    {
        try {
            $medicos = $this->service->list();
            return Json::ok($medicos);
        } catch (PDOException $e) {
            return new Response(500, ['error' => 'Failed to fetch doctors']);
        }
    }

    public function show(Request $_req, array $params): Response
    {
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            return Json::error(400, 'validation.id.invalid');
        }

        try {
            $medico = $this->service->get($id);
            if ($medico === null) {
                return Json::error(404, 'doctor.not_found');
            }
            return Json::ok($medico, 'doctor.found');
        } catch (PDOException $e) {
            return Json::error(500, 'doctor.get_failed');
        }
    }

    public function create(Request $req, array $_params = []): Response
    {
        $payload = $req->body;
        if (is_string($payload)) {
            $decoded = json_decode($payload, true);
            if (!is_array($decoded) && str_contains($payload, "\0")) {
                $utf8 = @iconv('UTF-16LE', 'UTF-8', $payload);
                if ($utf8 !== false) {
                    $decoded = json_decode($utf8, true);
                } else {
                    $utf8 = @iconv('UTF-16BE', 'UTF-8', $payload);
                    if ($utf8 !== false) {
                        $decoded = json_decode($utf8, true);
                    }
                }
            }
            $payload = $decoded;
        }
        if (!is_array($payload)) {
            return Json::error(400, 'validation.body.invalid');
        }

        $lang = Translator::detectLanguage($req->headers);

        try {
            $created = $this->service->create($payload);
            $message = $this->translator->translate('doctor.created', $lang);
            return new Response(201, ['message' => $message, 'data' => $created]);
        } catch (ValidationException $e) {
            return new Response(422, ['error' => $e->getMessage()]);
        } catch (PDOException $e) {
            $errorMessage = $this->translator->translate('doctor.create_failed', $lang);
            return new Response(500, ['error' => $errorMessage]);
        }
    }

    public function update(Request $req, array $params): Response
    {
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            return Json::error(400, 'validation.id.invalid');
        }
        $payload = $req->body;
        if (is_string($payload)) {
            $decoded = json_decode($payload, true);
            if (!is_array($decoded) && str_contains($payload, "\0")) {
                $utf8 = @iconv('UTF-16LE', 'UTF-8', $payload);
                if ($utf8 !== false) {
                    $decoded = json_decode($utf8, true);
                } else {
                    $utf8 = @iconv('UTF-16BE', 'UTF-8', $payload);
                    if ($utf8 !== false) {
                        $decoded = json_decode($utf8, true);
                    }
                }
            }
            $payload = $decoded;
        }
        if (!is_array($payload)) {
            return Json::error(400, 'validation.body.invalid');
        }

        try {
            $updated = $this->service->update($id, $payload);
            if ($updated === null) {
                return Json::error(404, 'doctor.not_found');
            }
            return Json::ok($updated, 'doctor.updated');
        } catch (ValidationException $e) {
            return Json::error(422, $e->getMessage(), null, ['errors' => $e->errors]);
        } catch (PDOException $e) {
            return Json::error(500, 'doctor.update_failed');
        }
    }

    public function delete(Request $_req, array $params): Response
    {
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            return Json::error(400, 'validation.id.invalid');
        }

        try {
            $deleted = $this->service->delete($id);
            if (!$deleted) {
                return Json::error(404, 'doctor.not_found');
            }
            return Json::ok(null, 'doctor.deleted');
        } catch (PDOException $e) {
            return Json::error(500, 'doctor.delete_failed');
        }
    }
}

