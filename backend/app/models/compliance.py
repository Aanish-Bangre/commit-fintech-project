from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class ComplianceLogCreate(BaseModel):
    strategy_id: UUID
    algo_id: str
    action: str = Field(pattern="^(check_passed|limit_breached)$")
    details: dict


class ComplianceLogOut(BaseModel):
    id: UUID
    user_id: UUID
    strategy_id: UUID
    algo_id: str
    action: str
    details: dict
    created_at: datetime
