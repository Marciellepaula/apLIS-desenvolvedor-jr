# Desenvolvimento Local

## Backend (Docker)

Suba apenas os backends e banco de dados:

```bash
docker-compose up mysql backend-node backend-php -d
```

## Frontend (Local)

Instale as dependências e inicie o React:

```bash
cd app
npm install
npm start
```

O frontend estará disponível em: http://localhost:3000

## Endpoints

- **Backend PHP (Médicos)**: http://localhost:8001
- **Backend Node.js (Pacientes)**: http://localhost:8000

## Estrutura

```
├── backend-node/     # Node.js API (Pacientes)
├── backend-php/      # PHP API (Médicos)  
├── app/              # React Frontend
└── db/               # MySQL Schema
```

## Para parar

```bash
# Parar backends
docker-compose down

# Parar frontend (Ctrl+C no terminal)
```
