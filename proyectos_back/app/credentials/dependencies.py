from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from app.db import get_session
from app.models.user import User
from app.credentials.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_token_user_id(payload: dict) -> int:
  user_id = payload.get("user_id")

  if user_id is None:
    raise ValueError("Token inválido")

  try:
    parsed_user_id = int(user_id)
  except (TypeError, ValueError):
    raise ValueError("Token inválido")

  if parsed_user_id < 1:
    raise ValueError("Token inválido")

  return parsed_user_id


def get_current_user(
  token: str = Depends(oauth2_scheme),
  session: Session = Depends(get_session)
) -> User:
  try:
    payload = decode_access_token(token)
    user_id = get_token_user_id(payload)
  except ValueError as e:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail=str(e),
      headers={"WWW-Authenticate": "Bearer"},
    )

  user = session.get(User, user_id)
  
  if user is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Usuario no encontrado",
      headers={"WWW-Authenticate": "Bearer"},
    )

  return user
