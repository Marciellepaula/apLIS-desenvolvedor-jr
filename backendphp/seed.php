<?php

declare(strict_types=1);

require_once __DIR__ . '/src/Bootstrap.php';
require_once __DIR__ . '/database/seeders/MedicoSeeder.php';

use App\Db\PdoFactory;

$seeder = new MedicoSeeder();
$seeder->run();
