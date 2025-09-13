from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class StrategyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    config_json: dict
    visibility: str = Field(default="private", pattern="^(private|public)$")


class StrategyOut(StrategyCreate):
    id: UUID
    user_id: UUID
    python_code: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class StrategyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config_json: Optional[dict] = None
    python_code: Optional[str] = None
    visibility: Optional[str] = Field(None, pattern="^(private|public)$")
