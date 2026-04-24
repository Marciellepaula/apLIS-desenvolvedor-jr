<?php

declare(strict_types=1);

namespace App\Medicos;

final class MedicoService
{
    public function __construct(private readonly MedicoRepository $repo)
    {
    }

    /** @return array<int, array{id:int, nome:string, CRM:string, UFCRM:string}> */
    public function list(): array
    {
        return $this->repo->all();
    }

    /** @return array{id:int, nome:string, CRM:string, UFCRM:string}|null */
    public function get(int $id): ?array
    {
        return $this->repo->findById($id);
    }

    /** @param array<string, mixed> $payload */
    public function create(array $payload): array
    {
        [$nome, $crm, $ufcrm] = $this->validate($payload);
        $id = $this->repo->create($nome, $crm, $ufcrm);
        return $this->repo->findById($id) ?? ['id' => $id, 'nome' => $nome, 'CRM' => $crm, 'UFCRM' => $ufcrm];
    }

    /** @param array<string, mixed> $payload */
    public function update(int $id, array $payload): ?array
    {
        [$nome, $crm, $ufcrm] = $this->validate($payload);
        $updated = $this->repo->update($id, $nome, $crm, $ufcrm);
        if (!$updated) {
            return null;
        }
        return $this->repo->findById($id);
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    /**
     * Accepts both CRM/UFCRM and crm/ufcrm.
     *
     * @param array<string, mixed> $payload
     * @return array{0:string,1:string,2:string}
     */
    private function validate(array $payload): array
    {
        $nome = is_string($payload['nome'] ?? null) ? trim((string) $payload['nome']) : '';
        $crm = is_string($payload['CRM'] ?? null) ? trim((string) $payload['CRM']) : (is_string($payload['crm'] ?? null) ? trim((string) $payload['crm']) : '');
        $ufcrm = is_string($payload['UFCRM'] ?? null) ? trim((string) $payload['UFCRM']) : (is_string($payload['ufcrm'] ?? null) ? trim((string) $payload['ufcrm']) : '');

        $errors = [];
        if ($nome === '' || mb_strlen($nome) > 120) {
            $errors['nome'] = 'validation.nome.invalid';
        }
        if ($crm === '' || mb_strlen($crm) > 20) {
            $errors['CRM'] = 'validation.crm.invalid';
        }
        if (!preg_match('/^[A-Za-z]{2}$/', $ufcrm)) {
            $errors['UFCRM'] = 'validation.ufcrm.invalid';
        }

        if ($errors !== []) {
            throw new ValidationException($errors);
        }

        return [$nome, $crm, strtoupper($ufcrm)];
    }
}

