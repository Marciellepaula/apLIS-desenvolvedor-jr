<?php

declare(strict_types=1);

namespace App\Medicos;

interface MedicoRepositoryInterface
{
    /** @return array<int, array{id:int, nome:string, CRM:string, UFCRM:string}> */
    public function all(): array;

    /** @return array{id:int, nome:string, CRM:string, UFCRM:string}|null */
    public function findById(int $id): ?array;

    public function create(string $nome, string $crm, string $ufcrm): int;

    public function update(int $id, string $nome, string $crm, string $ufcrm): bool;

    public function delete(int $id): bool;
}

