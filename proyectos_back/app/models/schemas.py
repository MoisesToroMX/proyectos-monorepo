from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

class UserData(BaseModel):
  name: str
  email: EmailStr
  password: str = Field(min_length=6, max_length=72)

class LoginRequest(BaseModel):
  email: str
  password: str

class UserRead(BaseModel):
  id: int
  name: str
  email: EmailStr
  created_at: datetime

  class Config:
    from_attributes = True

class Token(BaseModel):
  access_token: str
  token_type: str
