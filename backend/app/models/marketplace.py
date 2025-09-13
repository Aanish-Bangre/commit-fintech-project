from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from typing import Optional

class MarketplaceCreate(BaseModel):
    strategy_id: UUID


class MarketplaceOut(BaseModel):
    id: UUID
    strategy_id: UUID
    user_id: UUID
    likes: int
    forks: int
    comments_count: int
    created_at: datetime


class MarketplaceUpdate(BaseModel):
    likes: Optional[int] = None
    forks: Optional[int] = None
    comments_count: Optional[int] = None
