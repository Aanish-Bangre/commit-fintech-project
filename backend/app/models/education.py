from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class EducationCreate(BaseModel):
    title: str
    content: Optional[str] = None
    category: Optional[str] = None
    difficulty: str = Field(pattern="^(beginner|intermediate|advanced)$")


class EducationOut(BaseModel):
    id: UUID
    title: str
    content: Optional[str] = None
    category: Optional[str] = None
    difficulty: str
    created_at: datetime


class EducationUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = Field(None, pattern="^(beginner|intermediate|advanced)$")
