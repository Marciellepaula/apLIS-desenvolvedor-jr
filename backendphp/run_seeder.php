<?php

declare(strict_types=1);

require_once __DIR__ . '/src/Bootstrap.php';

// Create seeder inline since database folder isn't mounted
class MedicoSeeder
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = new PDO(
            'mysql:host=mysql;dbname=aplis',
            'root',
            'rootpass',
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
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

        // Clear table
        $this->pdo->exec("DELETE FROM medicos");

        // Insert data
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

$seeder = new MedicoSeeder();
$seeder->run();
