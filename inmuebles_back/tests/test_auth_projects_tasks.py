from fastapi.testclient import TestClient


def register_user(
  client: TestClient,
  email: str = "moises@example.com",
  name: str = "Moises",
  password: str = "secret123",
) -> dict:
  response = client.post(
    "/auth/register",
    json={"email": email, "name": name, "password": password},
  )

  assert response.status_code == 201

  return response.json()


def auth_headers(
  client: TestClient,
  email: str = "moises@example.com",
  password: str = "secret123",
) -> dict[str, str]:
  response = client.post(
    "/auth/login",
    json={"email": email, "password": password},
  )

  assert response.status_code == 200

  token = response.json()["access_token"]

  return {"Authorization": f"Bearer {token}"}


def test_register_login_and_me_happy_path(client: TestClient) -> None:
  created_user = register_user(client)
  headers = auth_headers(client)

  response = client.get("/auth/me", headers=headers)

  assert response.status_code == 200
  assert response.json()["id"] == created_user["id"]
  assert response.json()["email"] == "moises@example.com"


def test_register_rejects_duplicate_email(client: TestClient) -> None:
  register_user(client)

  response = client.post(
    "/auth/register",
    json={
      "email": "moises@example.com",
      "name": "Moises 2",
      "password": "secret123",
    },
  )

  assert response.status_code == 409
  assert response.json()["detail"] == "El email ya está registrado"


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
  register_user(client)

  response = client.post(
    "/auth/login",
    json={"email": "moises@example.com", "password": "bad-password"},
  )

  assert response.status_code == 401
  assert response.json()["detail"] == "Credenciales inválidas"


def test_protected_routes_require_token_and_keep_cors_headers(
  client: TestClient,
) -> None:
  response = client.get(
    "/projects/",
    headers={"Origin": "http://localhost:5174"},
  )

  assert response.status_code == 401
  assert response.headers["access-control-allow-origin"] == (
    "http://localhost:5174"
  )


def test_projects_and_tasks_are_scoped_to_authenticated_user(
  client: TestClient,
) -> None:
  first_user = register_user(client)
  first_headers = auth_headers(client)
  project_response = client.post(
    "/projects/",
    headers=first_headers,
    json={"name": "Inmueble 1", "description": "Muy bueno"},
  )

  assert project_response.status_code == 201

  project = project_response.json()
  task_response = client.post(
    "/tasks/",
    headers=first_headers,
    json={
      "description": "ser amigo",
      "project_id": project["id"],
      "title": "tarea 1",
    },
  )

  assert task_response.status_code == 201

  tasks_response = client.get(
    f"/tasks/?project_id={project['id']}",
    headers=first_headers,
  )

  assert tasks_response.status_code == 200
  assert len(tasks_response.json()) == 1
  assert project["user_id"] == first_user["id"]

  register_user(client, email="ana@example.com", name="Ana")
  second_headers = auth_headers(client, email="ana@example.com")

  blocked_project = client.get(
    f"/projects/{project['id']}",
    headers=second_headers,
  )
  blocked_task = client.post(
    "/tasks/",
    headers=second_headers,
    json={
      "description": "otro",
      "project_id": project["id"],
      "title": "tarea externa",
    },
  )

  assert blocked_project.status_code == 404
  assert blocked_task.status_code == 403
