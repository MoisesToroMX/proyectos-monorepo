import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_HOURS = 2

password_config = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hashed(password: str) -> str:
  return password_config.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
  return password_config.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
  data_to_encode = data.copy()
  issued_at = datetime.now(timezone.utc)
  expire_time = issued_at + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
  data_to_encode.update({"exp": expire_time, "iat": issued_at})

  return jwt.encode(data_to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
  try:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
  except jwt.ExpiredSignatureError:
    raise ValueError("Token expirado")
  except jwt.InvalidTokenError:
    raise ValueError("Token inválido")
