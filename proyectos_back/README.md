# Proyectos Backend (FastAPI + SQLModel)

API de gestión de usuarios, proyectos y tareas construida con FastAPI, SQLModel y PostgreSQL.

## Requisitos

- Python 3.11
- PostgreSQL 13+
- pip / venv (o Poetry si prefieres)

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```
DATABASE_URL=postgresql+psycopg2://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>
SECRET_KEY=<clave_secreta_larga_y_aleatoria>
ALGORITHM=HS256
```

Notas:
- `DATABASE_URL` usa el driver `psycopg2` (ya incluido vía `psycopg2`), ejemplo local: `postgresql+psycopg2://postgres:postgres@localhost:5432/proyectos`.
- `SECRET_KEY` y `ALGORITHM` se usan para firmar los JWT.

## Instalación y ejecución

1. Crear y activar entorno virtual

```bash
python -m venv .venv
.venv/Scripts/activate  # Windows PowerShell
# source .venv/bin/activate  # Linux/Mac
```

2. Instalar dependencias

```bash
pip install -r requirements.txt
```

3. Configurar variables en `.env` (ver sección anterior).

4. Ejecutar servidor en desarrollo

```bash
fastapi dev
# o
uvicorn app.main:app --reload
```

- Documentación interactiva: `http://127.0.0.1:8000/docs`
- Health/root: `GET /`

## Autenticación y autorización

- Registro: `POST /auth/register`
- Login: `POST /auth/login`
  - JSON: `{ "email": "user@example.com", "password": "..." }`
  - También funciona con el diálogo "Authorize" de Swagger (OAuth2 Password): `username = email`, `password = contraseña`.
- Usa el token devuelto como `Authorization: Bearer <token>` para acceder a `/projects` y `/tasks`.

## Migraciones

La migracion inicial esta versionada en:

```bash
migrations/001_initial_schema.sql
```

Aplicacion manual:

```bash
psql "$DATABASE_URL" -f migrations/001_initial_schema.sql
```

La app conserva `SQLModel.metadata.create_all` al arrancar para facilitar la
revision local y el uso con Docker.

## Ejecución con Docker

Requisitos: Docker Desktop o Docker Engine + docker compose.

Archivos incluidos:
- `Dockerfile` (imagen de la app)
- `docker-compose.yml` (servicios app + Postgres)
- `.dockerignore`

Comandos básicos (desde la raíz del proyecto):

```bash
docker compose build
docker compose up -d
docker compose logs -f app
```

La app quedará en `http://localhost:8000` y la documentación en `http://localhost:8000/docs`.

Variables de entorno en contenedor:
- Por defecto, `docker-compose.yml` usa:
  - `DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/proyectos`
  - `SECRET_KEY` configurable en tiempo de ejecución

Ejemplo de override al levantar:

```bash
SECRET_KEY=$(openssl rand -hex 32) docker compose up -d --build
```

Logs y administración:

```bash
docker compose logs -f app
docker compose logs -f db
docker compose ps
docker compose down
```

## Estructura relevante

```
app/
  main.py
  db.py
  models/
    user.py
    project.py
    task.py
    schemas.py
  routes/
    auth.py
    projects.py
    tasks.py
migrations/
  001_initial_schema.sql
```

## Notas de desarrollo

- Las rutas privadas se protegen con dependencias JWT en cada endpoint.
- Las entidades usan SQLModel; `ProjectCreate` y `TaskCreate` no aceptan `user_id` ni `created_at`; el servidor los asigna.
- CORS configurado por `CORS_ORIGINS`, por defecto para
  `http://localhost:5174`, `http://127.0.0.1:5174`,
  `http://localhost:8080` y `http://127.0.0.1:8080`.

## Scripts útiles

```bash
uvicorn app.main:app --reload
pip list --outdated
```
