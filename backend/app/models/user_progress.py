from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class UserProgressCreate(BaseModel):
    education_id: UUID
    status: str = Field(default="not started", pattern="^(not started|in progress|completed)$")


class UserProgressOut(BaseModel):
    id: UUID
    user_id: UUID
    education_id: UUID
    status: str
    completed_at: Optional[datetime] = None


class UserProgressUpdate(BaseModel):
    status: str = Field(pattern="^(not started|in progress|completed)$")
    completed_at: Optional[datetime] = None
