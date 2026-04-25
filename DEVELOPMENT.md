# Desenvolvimento Local

## Backend (Docker)

Suba apenas os backends e banco de dados:

```bash
docker compose up mysql backend-node backend-php -d
```

## Frontend (Local)

Instale as dependências e inicie o React:

```bash
cd app
npm install
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## Endpoints (portas do host)

| Serviço              | URL                       |
|----------------------|---------------------------|
| Backend PHP (Médicos) | http://localhost:3002    |
| Backend Node (Pacientes) | http://localhost:3001 |
| MySQL                | localhost:3306            |

## Estrutura

```
├── backendjs/    # Node.js API (Pacientes)
├── backendphp/   # PHP API (Médicos)
├── app/          # React Frontend
└── db/           # MySQL Schema
```

## Para parar

```bash
# Parar backends
docker compose down

# Parar frontend (Ctrl+C no terminal)
```
