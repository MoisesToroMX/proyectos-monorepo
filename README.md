# Inmuebles Monorepo

Monorepo para la aplicacion Inmuebles.

## Estructura

- `inmuebles_back`: API FastAPI, SQLModel, PostgreSQL y Docker.
- `inmuebles_front`: frontend React, TypeScript, Vite y HeroUI.

## Backend

```bash
cd inmuebles_back
APP_PORT=8001 CORS_ORIGINS=http://127.0.0.1:5174 docker compose up --build -d
```

API:

- `http://127.0.0.1:8001`
- `http://127.0.0.1:8001/docs`

## Frontend

```bash
cd inmuebles_front
npm install
VITE_API_URL=http://127.0.0.1:8001 npm run dev -- --host 127.0.0.1 --port 5174
```

App:

- `http://127.0.0.1:5174`

## Validacion

Frontend:

```bash
cd inmuebles_front
npm run lint
npm run test
npm run build
npm audit --audit-level=low
```

Backend:

```bash
cd inmuebles_back
python3 -m py_compile app/main.py app/models/schemas.py
APP_PORT=8001 CORS_ORIGINS=http://127.0.0.1:5174 docker compose config
APP_PORT=8001 CORS_ORIGINS=http://127.0.0.1:5174 docker compose up --build -d
docker logs inmuebles_app --tail=120
```
