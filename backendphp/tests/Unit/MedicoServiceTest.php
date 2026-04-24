<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Medicos\MedicoRepositoryInterface;
use App\Medicos\MedicoService;
use App\Medicos\ValidationException;
use PHPUnit\Framework\TestCase;

final class MedicoServiceTest extends TestCase
{
    public function testValidatesPayload(): void
    {
        $repo = new class implements MedicoRepositoryInterface {
            public function all(): array { return []; }
            public function findById(int $id): ?array { return null; }
            public function create(string $nome, string $crm, string $ufcrm): int { return 1; }
            public function update(int $id, string $nome, string $crm, string $ufcrm): bool { return true; }
            public function delete(int $id): bool { return true; }
        };
        $svc = new MedicoService($repo);

        $this->expectException(ValidationException::class);
        $svc->create(['nome' => '', 'CRM' => '', 'UFCRM' => '']);
    }

    public function testAcceptsLowercaseKeys(): void
    {
        $repo = new class implements MedicoRepositoryInterface {
            public function all(): array { return []; }
            public function findById(int $id): ?array { return ['id' => 10, 'nome' => 'Joao', 'CRM' => '123', 'UFCRM' => 'CE']; }
            public function create(string $nome, string $crm, string $ufcrm): int { return 10; }
            public function update(int $id, string $nome, string $crm, string $ufcrm): bool { return true; }
            public function delete(int $id): bool { return true; }
        };

        $svc = new MedicoService($repo);
        $created = $svc->create(['nome' => 'Joao', 'crm' => '123', 'ufcrm' => 'ce']);

        $this->assertSame('CE', $created['UFCRM']);
        $this->assertSame(10, $created['id']);
    }
}

