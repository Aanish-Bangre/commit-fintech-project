from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class PaperTradeCreate(BaseModel):
    """Model for creating a paper trade"""
    symbol: str = Field(..., description="Stock symbol (e.g., BHARTIARTL.NS)")
    action: str = Field(..., description="Trade action: 'buy' or 'sell'")
    quantity: int = Field(..., gt=0, description="Number of shares")
    price: Optional[float] = Field(None, description="Trade price (if None, uses current market price)")
    order_type: str = Field(default="market", description="Order type: 'market' or 'limit'")
    notes: Optional[str] = Field(None, description="Optional trade notes")


class PaperTradeOut(BaseModel):
    """Model for paper trade output"""
    id: UUID
    user_id: str
    symbol: str
    action: str
    quantity: int
    price: float
    order_type: str
    total_value: float
    notes: Optional[str]
    created_at: datetime
    executed_at: Optional[datetime] = None
    status: str = Field(default="pending", description="Trade status: pending, executed, cancelled")


class PaperTradeUpdate(BaseModel):
    """Model for updating a paper trade"""
    status: Optional[str] = None
    executed_at: Optional[datetime] = None
    price: Optional[float] = None


class PortfolioSummary(BaseModel):
    """Model for portfolio summary"""
    total_value: float
    cash_balance: float
    invested_value: float
    total_pnl: float
    total_pnl_percent: float
    positions: list
    trades_today: int
    trades_total: int


class Position(BaseModel):
    """Model for a stock position"""
    symbol: str
    quantity: int
    avg_price: float
    current_price: float
    market_value: float
    unrealized_pnl: float
    unrealized_pnl_percent: float
    total_invested: float


class MarketData(BaseModel):
    """Model for real-time market data"""
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: int
    high: float
    low: float
    open: float
    previous_close: float
    timestamp: datetime


class PaperTradeStats(BaseModel):
    """Model for paper trading statistics"""
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    total_pnl: float
    avg_trade_pnl: float
    best_trade: float
    worst_trade: float
    total_volume: float
    most_traded_symbol: str
    trading_days: int