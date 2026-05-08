from datetime import datetime, timezone
from typing import Optional

from pydantic import EmailStr, BaseModel
from sqlmodel import SQLModel, Field, Relationship

class UserBase(SQLModel):
  name: str = Field(default='', index=True)
  email: EmailStr = Field(default='', index=True, unique=True)
  password_hash: str = Field(default='', unique=True)
  created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class User(UserBase, table=True):
  __tablename__ = 'users'

  id: Optional[int] = Field(default=None, primary_key=True)
  projects: Optional[list["Project"]] = Relationship(back_populates="project_owner")
  tasks: Optional[list["Task"]] = Relationship(back_populates="task_owner")
  pass

class UserCreate(BaseModel):
  pass

class Token(BaseModel):
  access_token: str
  token_type: str = 'bearer'
