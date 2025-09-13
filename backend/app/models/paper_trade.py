from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class PaperTradeCreate(BaseModel):
    strategy_id: Optional[UUID] = None
    symbol: str
    side: str = Field(pattern="^(buy|sell)$")
    qty: float
    price: float


class PaperTradeOut(PaperTradeCreate):
    id: UUID
    user_id: UUID
    status: str
    pnl: Optional[float] = None
    created_at: datetime


class PaperTradeUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(open|closed)$")
    pnl: Optional[float] = None
