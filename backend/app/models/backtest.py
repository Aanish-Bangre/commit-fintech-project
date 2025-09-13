from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class BacktestCreate(BaseModel):
    strategy_id: UUID
    dataset: str  # "NSE", "NASDAQ", "KAGGLE" or path
    start_date: date
    end_date: date
    initial_capital: float = 100000.0


class BacktestOut(BaseModel):
    id: UUID
    strategy_id: UUID
    dataset: str
    start_date: date
    end_date: date
    metrics_json: dict
    equity_curve_url: Optional[str] = None
    created_at: datetime


class BacktestUpdate(BaseModel):
    metrics_json: Optional[dict] = None
    equity_curve_url: Optional[str] = None
