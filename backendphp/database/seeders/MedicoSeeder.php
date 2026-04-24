<?php

declare(strict_types=1);

require_once __DIR__ . '/../../backendphp/src/Bootstrap.php';

use App\Db\PdoFactory;
use PDO;

class MedicoSeeder
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = PdoFactory::make();
    }

    public function run(): void
    {
        $data = [
            ["nome" => "João da Silva", "CRM" => "123456", "UFCRM" => "CE"],
            ["nome" => "Maria Santos", "CRM" => "789012", "UFCRM" => "SP"],
            ["nome" => "Carlos Oliveira", "CRM" => "345678", "UFCRM" => "RJ"],
            ["nome" => "Ana Paula Costa", "CRM" => "901234", "UFCRM" => "MG"],
            ["nome" => "Roberto Silva", "CRM" => "567890", "UFCRM" => "BA"]
        ];

        // Limpa tabela antes de inserir novos dados
        $this->pdo->exec("DELETE FROM medicos");

        foreach ($data as $item) {
            $stmt = $this->pdo->prepare("
                INSERT INTO medicos (nome, CRM, UFCRM)
                VALUES (:nome, :crm, :uf)
            ");

            $stmt->execute([
                ":nome" => $item["nome"],
                ":crm" => $item["CRM"],
                ":uf" => $item["UFCRM"]
            ]);
        }

        echo "MedicoSeeder: " . count($data) . " médicos inseridos com sucesso!\n";
    }
}
