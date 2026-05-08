from collections.abc import Generator

import pytest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, Session, create_engine

from app.db import get_session
from app.models import project as project_model  # noqa: F401
from app.models import task as task_model  # noqa: F401
from app.models import user as user_model  # noqa: F401
from app.routes import auth, projects, tasks


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
  engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
  )
  SQLModel.metadata.create_all(engine)

  def override_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
      yield session

  app = FastAPI()
  app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )
  app.include_router(auth.router)
  app.include_router(projects.router)
  app.include_router(tasks.router)
  app.dependency_overrides[get_session] = override_session

  with TestClient(app) as test_client:
    yield test_client

  app.dependency_overrides.clear()
