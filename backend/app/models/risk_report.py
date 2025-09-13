from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class RiskReportOut(BaseModel):
    id: UUID
    backtest_id: UUID
    risk_level: str
    max_drawdown: float
    sharpe: float
    volatility: float
    recommendations: dict
    created_at: datetime
