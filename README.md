# 📋 Proyectos Monorepo

Monorepo profesional para **Proyectos**, una aplicacion full-stack con:

- ⚙️ **Backend**: FastAPI, SQLModel, PostgreSQL y JWT.
- 🎨 **Frontend**: React, TypeScript, Vite, HeroUI y Tailwind.
- 🐳 **Docker**: PostgreSQL + API + frontend servido con nginx.

---

## 📦 Estructura del proyecto

```text
.
├── docker-compose.yml          # Orquesta todo el proyecto
├── proyectos_back/             # API FastAPI
│   ├── Dockerfile              # Imagen backend multi-stage reducida
│   ├── docker-compose.yml      # Compose solo backend + db
│   ├── migrations/             # Migraciones SQL de PostgreSQL
│   ├── requirements.txt
│   └── app/
└── proyectos_front/            # App React/Vite
    ├── Dockerfile              # Build React + runtime nginx
    ├── nginx.conf              # SPA fallback + headers basicos
    ├── package.json
    └── src/
```

---

## ✅ Requisitos

Antes de levantar el proyecto completo, instala:

- 🐳 **Docker Desktop** o Docker Engine.
- 🧩 **Docker Compose v2** incluido en Docker Desktop.
- 🖥️ Terminal en la carpeta del monorepo.

Verifica Docker:

```bash
docker --version
docker compose version
```

---

## 🚀 Levantar todo con Docker

Desde la raiz del monorepo:

```bash
cd /Users/ingtony/Documents/Portfolio
docker compose up --build -d
```

Este comando construye y levanta:

- 🗄️ `proyectos_db`: base de datos PostgreSQL.
- ⚙️ `proyectos_backend`: API FastAPI.
- 🌐 `proyectos_frontend`: frontend React servido con nginx.

---

## 🌍 URLs locales

Cuando los contenedores esten listos:

| Servicio | URL |
| --- | --- |
| 🌐 Frontend | http://127.0.0.1:8080 |
| 🔐 Login | http://127.0.0.1:8080/login |
| ⚙️ Backend API | http://127.0.0.1:8001 |
| 📚 Swagger Docs | http://127.0.0.1:8001/docs |
| 🗄️ PostgreSQL | `localhost:5432` |

---

## 🔍 Verificar estado

```bash
docker compose ps
```

Estado esperado:

```text
NAME                 STATUS
proyectos_db         healthy
proyectos_backend    healthy
proyectos_frontend   healthy
```

Ver logs de todos los servicios:

```bash
docker compose logs --tail=120
```

Ver logs por servicio:

```bash
docker compose logs -f db
docker compose logs -f backend
docker compose logs -f frontend
```

---

## 🧪 Prueba rapida desde terminal

### 1. Probar backend

```bash
curl -I http://127.0.0.1:8001/docs
```

Debe responder `HTTP/1.1 200 OK`.

### 2. Registrar usuario

```bash
curl -X POST http://127.0.0.1:8001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Demo User",
    "email": "demo@proyectos.com",
    "password": "Password123"
  }'
```

### 3. Iniciar sesion

```bash
curl -X POST http://127.0.0.1:8001/auth/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'username=demo@proyectos.com' \
  --data-urlencode 'password=Password123'
```

Debe devolver un `access_token`.

---

## ⚙️ Variables de entorno

Puedes crear un archivo `.env` en la raiz para personalizar puertos y secretos:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=proyectos

APP_PORT=8001
FRONTEND_PORT=8080
POSTGRES_PORT=5432

FRONTEND_API_URL=http://127.0.0.1:8001
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080,http://localhost:5174,http://127.0.0.1:5174

SECRET_KEY=change-this-long-random-secret
ALGORITHM=HS256
```

⚠️ No subas `.env` a Git. El archivo esta ignorado.

---

## 🧬 Migraciones de base de datos

La carpeta `proyectos_back/migrations/` contiene el esquema versionado de
PostgreSQL.

Para aplicar la migracion inicial manualmente:

```bash
psql "$DATABASE_URL" -f proyectos_back/migrations/001_initial_schema.sql
```

En Docker, la app tambien inicializa las tablas al arrancar para facilitar la
revision local.

---

## 🧱 Como funciona Docker

### Backend

El backend usa una imagen **multi-stage**:

1. 🏗️ `builder`: crea un virtualenv e instala dependencias.
2. 🚀 `runtime`: copia solo el virtualenv y la app.
3. 🔒 Corre con usuario no-root `app`.
4. 🧹 No incluye `pip`, `setuptools`, `wheel` ni herramientas de build.

### Frontend

El frontend usa dos etapas:

1. 🏗️ `builder`: instala dependencias con `npm ci` y ejecuta `npm run build`.
2. 🌐 `runtime`: nginx sirve los archivos estaticos de `dist`.

El archivo `nginx.conf` incluye:

- Fallback de SPA a `index.html`.
- Cache largo para `/assets`.
- Headers basicos de seguridad.

---

## 🧯 Problemas comunes

### Puerto ocupado

Si `8001`, `8080` o `5432` estan ocupados, cambia los puertos:

```bash
APP_PORT=8010 FRONTEND_PORT=8090 POSTGRES_PORT=5433 docker compose up --build -d
```

En ese caso tambien ajusta el API que el frontend compila:

```bash
APP_PORT=8010 \
FRONTEND_PORT=8090 \
POSTGRES_PORT=5433 \
FRONTEND_API_URL=http://127.0.0.1:8010 \
CORS_ORIGINS=http://localhost:8090,http://127.0.0.1:8090 \
docker compose up --build -d
```

### Cambiaste `FRONTEND_API_URL`

Reconstruye el frontend:

```bash
docker compose build --no-cache frontend
docker compose up -d
```

### Limpiar contenedores

```bash
docker compose down
```

Esto detiene contenedores, pero conserva la base de datos.

### Reiniciar tambien la base de datos

⚠️ Esto borra datos locales:

```bash
docker compose down -v
docker compose up --build -d
```

---

## 🛠️ Desarrollo sin Docker

Backend:

```bash
cd proyectos_back
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Frontend:

```bash
cd proyectos_front
npm install
VITE_API_URL=http://127.0.0.1:8001 npm run dev -- --host 127.0.0.1 --port 5174
```

---

## ✅ Validacion recomendada

Frontend:

```bash
cd proyectos_front
npm run lint
npm run test
npm run build
npm audit --audit-level=low
```

Backend:

```bash
cd proyectos_back
python3 -m py_compile app/main.py app/models/schemas.py
```

Docker completo:

```bash
cd /Users/ingtony/Documents/Portfolio
docker compose config
docker compose up --build -d
docker compose ps
docker compose logs --tail=120
```

---

## 🧹 Comandos utiles

Reconstruir todo:

```bash
docker compose build --no-cache
docker compose up -d
```

Ver consumo de imagenes:

```bash
docker image ls | grep proyectos
```

Entrar al backend:

```bash
docker exec -it proyectos_backend sh
```

Entrar al frontend:

```bash
docker exec -it proyectos_frontend sh
```

---

## 🔒 Seguridad local

- No publiques `.env`.
- Cambia `SECRET_KEY` fuera de desarrollo.
- Usa passwords fuertes para PostgreSQL si expones el servicio.
- No uses `changeme` en ambientes reales.
- Mantén `CORS_ORIGINS` limitado a los dominios reales del frontend.
