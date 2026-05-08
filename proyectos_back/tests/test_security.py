from datetime import datetime, timezone

import jwt
import pytest
from fastapi.testclient import TestClient

from app.credentials import security


def test_access_token_expires_in_max_two_hours() -> None:
  token = security.create_access_token({"user_id": "1"})
  payload = jwt.decode(
    token,
    security.SECRET_KEY,
    algorithms=[security.ALGORITHM],
  )
  expires_at = datetime.fromtimestamp(payload["exp"], timezone.utc)
  issued_at = datetime.fromtimestamp(payload["iat"], timezone.utc)

  assert (expires_at - issued_at).total_seconds() == 2 * 60 * 60


def test_decode_rejects_expired_token() -> None:
  expired_token = jwt.encode(
    {
      "exp": datetime.fromtimestamp(0, timezone.utc),
      "user_id": "1",
    },
    security.SECRET_KEY,
    algorithm=security.ALGORITHM,
  )

  with pytest.raises(ValueError, match="Token expirado"):
    security.decode_access_token(expired_token)


def test_protected_route_rejects_non_numeric_user_id(
  client: TestClient,
) -> None:
  token = jwt.encode(
    {"user_id": "abc"},
    security.SECRET_KEY,
    algorithm=security.ALGORITHM,
  )

  response = client.get(
    "/auth/me",
    headers={"Authorization": f"Bearer {token}"},
  )

  assert response.status_code == 401
  assert response.json()["detail"] == "Token inválido"
