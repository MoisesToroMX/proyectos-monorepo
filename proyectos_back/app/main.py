from os import getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, projects, tasks
from app.db import initialize_database


def get_cors_origins() -> list[str]:
  configured_origins = getenv('CORS_ORIGINS')

  if configured_origins:
    origins = [
      origin.strip()
      for origin in configured_origins.split(',')
      if origin.strip()
    ]

    return origins

  return [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ]


app = FastAPI(
  title='Proyectos API',
  version='1.0.0',
  description='API para manejar proyectos y tareas con FastAPI + PostgreSQL',
  lifespan=initialize_database
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)

@app.get('/')
async def root():
  return { 'message': '🚀 Bienvenido a la API de gestión de proyectos y tareas' }
