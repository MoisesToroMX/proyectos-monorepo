from datetime import datetime, timezone
from typing import Optional

from app.models.user import User
from sqlmodel import SQLModel, Field, Relationship

class ProjectBase(SQLModel):
    name: str = Field(default='', index=True)
    description: str = Field(default='', index=True)

class Project(ProjectBase, table=True):
    __tablename__ = 'projects'

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    project_owner: "User" = Relationship(back_populates="projects")
    tasks: list["Task"] = Relationship(back_populates="project")

class ProjectCreate(SQLModel):
    name: str
    description: str

class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
