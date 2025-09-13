from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class CommentCreate(BaseModel):
    marketplace_id: UUID
    content: str


class CommentOut(BaseModel):
    id: UUID
    marketplace_id: UUID
    user_id: UUID
    content: str
    created_at: datetime


class CommentUpdate(BaseModel):
    content: str
