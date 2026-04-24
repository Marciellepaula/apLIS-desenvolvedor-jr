<?php

declare(strict_types=1);

require_once 'seeders/MedicoSeeder.php';

$seeders = [
    new MedicoSeeder()
];

echo "Iniciando execução dos seeds...\n";
echo str_repeat("=", 40) . "\n";

foreach ($seeders as $seeder) {
    try {
        $seeder->run();
    } catch (Exception $e) {
        echo "Erro ao executar " . get_class($seeder) . ": " . $e->getMessage() . "\n";
    }
}

echo str_repeat("=", 40) . "\n";
echo "Todos os seeds executados com sucesso!\n";
