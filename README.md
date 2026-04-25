# apLIS — Sistema Fullstack (Docker)

![apLIS Screenshot](screenshot.png)

Aplicação fullstack composta por:
- **Frontend (SPA)**: React (Vite) servido por **Nginx**
- **Backend PHP (Médicos)**: API REST (`/api/v1/medicos`)
- **Backend Node (Pacientes)**: API REST (`/api/v1/pacientes`)
- **Banco**: MySQL (compartilhado pelos dois backends)

## Como os serviços se comunicam

- **Rede interna Docker**: os containers se resolvem por nome de serviço (ex.: `mysql`, `backend-php`, `backend-node`)
- **Sem `localhost` entre containers**: comunicação interna via rede `internal`
- **Frontend sem CORS**: o Nginx faz proxy para as APIs
  - `/api/php/*` → `backend-php`
  - `/api/node/*` → `backend-node`

## Execução (Docker)

Pré-requisitos:
- Docker Desktop (com `docker compose`)

Subir tudo:

```bash
docker compose up --build
```

## URLs

| Serviço              | URL                                         |
|----------------------|---------------------------------------------|
| Frontend             | `http://localhost:8080`                     |
| API Médicos (PHP)    | `http://localhost:3002/api/v1/medicos`      |
| API Pacientes (Node) | `http://localhost:3001/api/v1/pacientes`    |
| MySQL                | `localhost:3306`                            |

## Banco de dados

- **Persistência**: volume `mysql_data`
- **Bootstrap**: na primeira execução (volume vazio), o MySQL executa `db/init.sql` criando as tabelas:
  - `medicos`
  - `pacientes`

## Variáveis de ambiente

As variáveis ficam em `.env` e são usadas pelo `docker-compose.yml` (credenciais/porta do MySQL e portas expostas).

## Testes

```bash
# Frontend (Vitest)
cd app && npm test

# Backend Node (Vitest)
cd backendjs && npm test

# Backend PHP (PHPUnit)
cd backendphp && ./vendor/bin/phpunit
```
