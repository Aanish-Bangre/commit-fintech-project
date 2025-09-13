import uuid
from datetime import datetime, date
from typing import Dict, List, Optional, Tuple
import pandas as pd
from app.services.market_data import market_data_service
from app.core.database import supabase
from starlette.concurrency import run_in_threadpool
import logging

logger = logging.getLogger(__name__)

class PaperTradingService:
    """Service for paper trading operations"""
    
    def __init__(self):
        self.initial_cash = 1000000  # Default virtual cash: ₹10,00,000
    
    async def get_user_portfolio(self, user_id: str) -> Dict:
        """Get user's portfolio summary"""
        try:
            # Get user's cash balance
            cash_resp = await run_in_threadpool(
                lambda: supabase.table("user_portfolios")
                .select("cash_balance")
                .eq("user_id", user_id)
                .execute()
            )
            
            cash_balance = self.initial_cash
            if getattr(cash_resp, "data", None) and len(cash_resp.data) > 0:
                cash_balance = cash_resp.data[0].get("cash_balance", self.initial_cash)
            else:
                # Initialize portfolio if doesn't exist
                await self._initialize_portfolio(user_id)
            
            # Get user's positions
            positions_resp = await run_in_threadpool(
                lambda: supabase.table("paper_positions")
                .select("*")
                .eq("user_id", user_id)
                .execute()
            )
            
            positions = []
            total_invested = 0
            total_market_value = 0
            
            if getattr(positions_resp, "data", None):
                for pos_data in positions_resp.data:
                    symbol = pos_data["symbol"]
                    quantity = pos_data["quantity"]
                    avg_price = pos_data["avg_price"]
                    
                    # Get current price
                    try:
                        current_price = await market_data_service.get_current_price(symbol)
                        market_value = quantity * current_price
                        invested_value = quantity * avg_price
                        unrealized_pnl = market_value - invested_value
                        unrealized_pnl_percent = (unrealized_pnl / invested_value) * 100 if invested_value > 0 else 0
                        
                        position = {
                            "symbol": symbol,
                            "quantity": quantity,
                            "avg_price": avg_price,
                            "current_price": current_price,
                            "market_value": market_value,
                            "unrealized_pnl": unrealized_pnl,
                            "unrealized_pnl_percent": unrealized_pnl_percent,
                            "total_invested": invested_value
                        }
                        
                        positions.append(position)
                        total_invested += invested_value
                        total_market_value += market_value
                        
                    except Exception as e:
                        logger.error(f"Error getting price for {symbol}: {e}")
                        # Use avg_price as fallback
                        position = {
                            "symbol": symbol,
                            "quantity": quantity,
                            "avg_price": avg_price,
                            "current_price": avg_price,
                            "market_value": quantity * avg_price,
                            "unrealized_pnl": 0,
                            "unrealized_pnl_percent": 0,
                            "total_invested": quantity * avg_price
                        }
                        positions.append(position)
                        total_invested += quantity * avg_price
                        total_market_value += quantity * avg_price
            
            # Calculate portfolio metrics
            total_value = cash_balance + total_market_value
            total_pnl = total_market_value - total_invested
            total_pnl_percent = (total_pnl / total_invested) * 100 if total_invested > 0 else 0
            
            # Get trade counts
            trades_resp = await run_in_threadpool(
                lambda: supabase.table("paper_trading_trades")
                .select("id, created_at")
                .eq("user_id", user_id)
                .execute()
            )
            
            trades_today = 0
            trades_total = 0
            
            if getattr(trades_resp, "data", None):
                trades_total = len(trades_resp.data)
                today = date.today()
                trades_today = sum(1 for trade in trades_resp.data 
                                 if datetime.fromisoformat(trade["created_at"]).date() == today)
            
            portfolio = {
                "total_value": total_value,
                "cash_balance": cash_balance,
                "invested_value": total_invested,
                "total_pnl": total_pnl,
                "total_pnl_percent": total_pnl_percent,
                "positions": positions,
                "trades_today": trades_today,
                "trades_total": trades_total
            }
            
            return portfolio
            
        except Exception as e:
            logger.error(f"Error getting portfolio for user {user_id}: {e}")
            raise
    
    async def execute_trade(self, user_id: str, symbol: str, action: str, 
                          quantity: int, price: Optional[float] = None, 
                          order_type: str = "market", notes: Optional[str] = None) -> Dict:
        """Execute a paper trade"""
        try:
            # Get current market price if not provided
            if price is None:
                price = await market_data_service.get_current_price(symbol)
            
            total_value = quantity * price
            
            # Check if user has sufficient funds/positions
            portfolio = await self.get_user_portfolio(user_id)
            
            if action == "buy":
                if portfolio["cash_balance"] < total_value:
                    raise ValueError(f"Insufficient funds. Required: ₹{total_value:,.2f}, Available: ₹{portfolio['cash_balance']:,.2f}")
            elif action == "sell":
                # Check if user has sufficient quantity
                current_position = next((pos for pos in portfolio["positions"] if pos["symbol"] == symbol), None)
                if not current_position or current_position["quantity"] < quantity:
                    raise ValueError(f"Insufficient shares. Required: {quantity}, Available: {current_position['quantity'] if current_position else 0}")
            
            # Create trade record
            trade_id = uuid.uuid4()
            now = datetime.utcnow().isoformat()
            
            trade_data = {
                "id": str(trade_id),
                "user_id": user_id,
                "symbol": symbol,
                "action": action,
                "quantity": quantity,
                "price": price,
                "order_type": order_type,
                "total_value": total_value,
                "notes": notes,
                "status": "executed",
                "created_at": now,
                "executed_at": now
            }
            
            # Save trade
            trade_resp = await run_in_threadpool(
                lambda: supabase.table("paper_trading_trades").insert(trade_data).execute()
            )
            
            if not trade_resp.data:
                raise ValueError("Failed to save trade")
            
            # Update portfolio
            await self._update_portfolio(user_id, symbol, action, quantity, price, total_value)
            
            return {
                "trade_id": str(trade_id),
                "symbol": symbol,
                "action": action,
                "quantity": quantity,
                "price": price,
                "total_value": total_value,
                "status": "executed",
                "executed_at": now
            }
            
        except Exception as e:
            logger.error(f"Error executing trade: {e}")
            raise
    
    async def _update_portfolio(self, user_id: str, symbol: str, action: str, 
                              quantity: int, price: float, total_value: float):
        """Update user's portfolio after a trade"""
        try:
            # Get current portfolio
            portfolio_resp = await run_in_threadpool(
                lambda: supabase.table("user_portfolios")
                .select("*")
                .eq("user_id", user_id)
                .execute()
            )
            
            if not getattr(portfolio_resp, "data", None) or len(portfolio_resp.data) == 0:
                await self._initialize_portfolio(user_id)
                portfolio_resp = await run_in_threadpool(
                    lambda: supabase.table("user_portfolios")
                    .select("*")
                    .eq("user_id", user_id)
                    .execute()
                )
            
            portfolio_data = portfolio_resp.data[0]
            cash_balance = portfolio_data["cash_balance"]
            
            # Update cash balance
            if action == "buy":
                cash_balance -= total_value
            elif action == "sell":
                cash_balance += total_value
            
            # Update cash balance
            await run_in_threadpool(
                lambda: supabase.table("user_portfolios")
                .update({"cash_balance": cash_balance})
                .eq("user_id", user_id)
                .execute()
            )
            
            # Update positions
            position_resp = await run_in_threadpool(
                lambda: supabase.table("paper_positions")
                .select("*")
                .eq("user_id", user_id)
                .eq("symbol", symbol)
                .execute()
            )
            
            if getattr(position_resp, "data", None) and len(position_resp.data) > 0:
                # Update existing position
                current_pos = position_resp.data[0]
                current_quantity = current_pos["quantity"]
                current_avg_price = current_pos["avg_price"]
                
                if action == "buy":
                    new_quantity = current_quantity + quantity
                    new_avg_price = ((current_quantity * current_avg_price) + (quantity * price)) / new_quantity
                else:  # sell
                    new_quantity = current_quantity - quantity
                    new_avg_price = current_avg_price  # Keep same avg price
                
                if new_quantity > 0:
                    # Update position
                    await run_in_threadpool(
                        lambda: supabase.table("paper_positions")
                        .update({
                            "quantity": new_quantity,
                            "avg_price": new_avg_price
                        })
                        .eq("user_id", user_id)
                        .eq("symbol", symbol)
                        .execute()
                    )
                else:
                    # Remove position
                    await run_in_threadpool(
                        lambda: supabase.table("paper_positions")
                        .delete()
                        .eq("user_id", user_id)
                        .eq("symbol", symbol)
                        .execute()
                    )
            else:
                # Create new position (only for buy orders)
                if action == "buy":
                    position_data = {
                        "id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "symbol": symbol,
                        "quantity": quantity,
                        "avg_price": price,
                        "created_at": datetime.utcnow().isoformat()
                    }
                    
                    await run_in_threadpool(
                        lambda: supabase.table("paper_positions").insert(position_data).execute()
                    )
            
        except Exception as e:
            logger.error(f"Error updating portfolio: {e}")
            raise
    
    async def _initialize_portfolio(self, user_id: str):
        """Initialize user's portfolio with default cash"""
        try:
            portfolio_data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "cash_balance": self.initial_cash,
                "created_at": datetime.utcnow().isoformat()
            }
            
            await run_in_threadpool(
                lambda: supabase.table("user_portfolios").insert(portfolio_data).execute()
            )
            
        except Exception as e:
            logger.error(f"Error initializing portfolio: {e}")
            raise
    
    async def get_trade_history(self, user_id: str, limit: int = 50) -> List[Dict]:
        """Get user's trade history"""
        try:
            trades_resp = await run_in_threadpool(
                lambda: supabase.table("paper_trading_trades")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            
            if getattr(trades_resp, "data", None):
                return trades_resp.data
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error getting trade history: {e}")
            raise
    
    async def get_trading_stats(self, user_id: str) -> Dict:
        """Get user's trading statistics"""
        try:
            trades_resp = await run_in_threadpool(
                lambda: supabase.table("paper_trading_trades")
                .select("*")
                .eq("user_id", user_id)
                .execute()
            )
            
            if not getattr(trades_resp, "data", None):
                return {
                    "total_trades": 0,
                    "winning_trades": 0,
                    "losing_trades": 0,
                    "win_rate": 0,
                    "total_pnl": 0,
                    "avg_trade_pnl": 0,
                    "best_trade": 0,
                    "worst_trade": 0,
                    "total_volume": 0,
                    "most_traded_symbol": "",
                    "trading_days": 0
                }
            
            trades = trades_resp.data
            
            # Calculate statistics
            total_trades = len(trades)
            total_volume = sum(trade["total_value"] for trade in trades)
            
            # Symbol frequency
            symbol_counts = {}
            for trade in trades:
                symbol = trade["symbol"]
                symbol_counts[symbol] = symbol_counts.get(symbol, 0) + 1
            
            most_traded_symbol = max(symbol_counts.items(), key=lambda x: x[1])[0] if symbol_counts else ""
            
            # Trading days
            trading_dates = set()
            for trade in trades:
                trade_date = datetime.fromisoformat(trade["created_at"]).date()
                trading_dates.add(trade_date)
            trading_days = len(trading_dates)
            
            # P&L analysis (simplified - would need more complex logic for accurate P&L)
            # For now, we'll use portfolio P&L
            portfolio = await self.get_user_portfolio(user_id)
            total_pnl = portfolio["total_pnl"]
            
            stats = {
                "total_trades": total_trades,
                "winning_trades": 0,  # Would need position tracking for accurate calculation
                "losing_trades": 0,   # Would need position tracking for accurate calculation
                "win_rate": 0,        # Would need position tracking for accurate calculation
                "total_pnl": total_pnl,
                "avg_trade_pnl": total_pnl / total_trades if total_trades > 0 else 0,
                "best_trade": 0,      # Would need individual trade P&L calculation
                "worst_trade": 0,     # Would need individual trade P&L calculation
                "total_volume": total_volume,
                "most_traded_symbol": most_traded_symbol,
                "trading_days": trading_days
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting trading stats: {e}")
            raise

# Global instance
paper_trading_service = PaperTradingService()
