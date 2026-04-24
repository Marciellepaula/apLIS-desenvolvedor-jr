<?php

declare(strict_types=1);

namespace App\Medicos;

use PDO;

final class MedicoRepository implements MedicoRepositoryInterface
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    /** @return array<int, array{id:int, nome:string, CRM:string, UFCRM:string}> */
    public function all(): array
    {
        $stmt = $this->pdo->query('SELECT id, nome, crm, ufcrm FROM medicos ORDER BY id DESC');
        $rows = $stmt->fetchAll();

        return array_map(static fn (array $r) => [
            'id' => (int) $r['id'],
            'nome' => (string) $r['nome'],
            'CRM' => (string) $r['crm'],
            'UFCRM' => (string) $r['ufcrm'],
        ], $rows);
    }

    /** @return array{id:int, nome:string, CRM:string, UFCRM:string}|null */
    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, nome, crm, ufcrm FROM medicos WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        return [
            'id' => (int) $row['id'],
            'nome' => (string) $row['nome'],
            'CRM' => (string) $row['crm'],
            'UFCRM' => (string) $row['ufcrm'],
        ];
    }

    public function create(string $nome, string $crm, string $ufcrm): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO medicos (nome, crm, ufcrm) VALUES (:nome, :crm, :ufcrm)');
        $stmt->execute([
            'nome' => $nome,
            'crm' => $crm,
            'ufcrm' => $ufcrm,
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function update(int $id, string $nome, string $crm, string $ufcrm): bool
    {
        $stmt = $this->pdo->prepare('UPDATE medicos SET nome = :nome, crm = :crm, ufcrm = :ufcrm WHERE id = :id');
        $stmt->execute([
            'id' => $id,
            'nome' => $nome,
            'crm' => $crm,
            'ufcrm' => $ufcrm,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM medicos WHERE id = :id');
        $stmt->execute(['id' => $id]);

        return $stmt->rowCount() > 0;
    }
}

