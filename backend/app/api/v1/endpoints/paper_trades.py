from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.paper_trade import (
    PaperTradeCreate, PaperTradeOut, PaperTradeUpdate, 
    PortfolioSummary, Position, MarketData, PaperTradeStats
)
from app.services.auth import get_current_user
from app.services.paper_trading import paper_trading_service
from app.services.market_data import market_data_service

router = APIRouter()


@router.get("/portfolio", response_model=PortfolioSummary)
async def get_portfolio(user=Depends(get_current_user)):
    """Get user's paper trading portfolio"""
    try:
        portfolio = await paper_trading_service.get_user_portfolio(user["id"])
        return PortfolioSummary(**portfolio)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get portfolio: {str(e)}"
        )


@router.post("/trade", response_model=PaperTradeOut)
async def execute_trade(trade_data: PaperTradeCreate, user=Depends(get_current_user)):
    """Execute a paper trade"""
    try:
        result = await paper_trading_service.execute_trade(
            user_id=user["id"],
            symbol=trade_data.symbol,
            action=trade_data.action,
            quantity=trade_data.quantity,
            price=trade_data.price,
            order_type=trade_data.order_type,
            notes=trade_data.notes
        )
        
        return PaperTradeOut(**result)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to execute trade: {str(e)}"
        )


@router.get("/trades", response_model=List[PaperTradeOut])
async def get_trade_history(limit: int = 50, user=Depends(get_current_user)):
    """Get user's trade history"""
    try:
        trades = await paper_trading_service.get_trade_history(user["id"], limit)
        return [PaperTradeOut(**trade) for trade in trades]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trade history: {str(e)}"
        )


@router.get("/stats", response_model=PaperTradeStats)
async def get_trading_stats(user=Depends(get_current_user)):
    """Get user's trading statistics"""
    try:
        stats = await paper_trading_service.get_trading_stats(user["id"])
        return PaperTradeStats(**stats)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trading stats: {str(e)}"
        )


@router.get("/market-data/{symbol}", response_model=MarketData)
async def get_market_data(symbol: str, user=Depends(get_current_user)):
    """Get real-time market data for a symbol"""
    try:
        market_data = await market_data_service.get_market_data(symbol)
        return MarketData(**market_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get market data: {str(e)}"
        )


@router.get("/market-data", response_model=List[MarketData])
async def get_multiple_market_data(symbols: str, user=Depends(get_current_user)):
    """Get real-time market data for multiple symbols (comma-separated)"""
    try:
        symbol_list = [s.strip() for s in symbols.split(",")]
        market_data_list = []
        
        for symbol in symbol_list:
            try:
                data = await market_data_service.get_market_data(symbol)
                market_data_list.append(MarketData(**data))
            except Exception as e:
                # Skip symbols that fail, but continue with others
                continue
        
        return market_data_list
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get market data: {str(e)}"
        )


@router.get("/positions", response_model=List[Position])
async def get_positions(user=Depends(get_current_user)):
    """Get user's current positions"""
    try:
        portfolio = await paper_trading_service.get_user_portfolio(user["id"])
        return [Position(**pos) for pos in portfolio["positions"]]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get positions: {str(e)}"
        )


@router.get("/price/{symbol}")
async def get_current_price(symbol: str, user=Depends(get_current_user)):
    """Get current price for a symbol"""
    try:
        price = await market_data_service.get_current_price(symbol)
        return {"symbol": symbol, "price": price, "timestamp": datetime.utcnow()}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get price: {str(e)}"
        )


@router.post("/reset-portfolio")
async def reset_portfolio(user=Depends(get_current_user)):
    """Reset user's portfolio to initial state"""
    try:
        # Delete all positions
        await run_in_threadpool(
            lambda: supabase.table("paper_positions")
            .delete()
            .eq("user_id", user["id"])
            .execute()
        )
        
        # Reset cash balance
        await run_in_threadpool(
            lambda: supabase.table("user_portfolios")
            .update({"cash_balance": 1000000})  # Reset to ₹10,00,000
            .eq("user_id", user["id"])
            .execute()
        )
        
        return {"message": "Portfolio reset successfully", "cash_balance": 1000000}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset portfolio: {str(e)}"
        )


@router.get("/trade/{trade_id}", response_model=PaperTradeOut)
async def get_trade(trade_id: UUID, user=Depends(get_current_user)):
    """Get a specific trade by ID"""
    try:
        trade_resp = await run_in_threadpool(
            lambda: supabase.table("paper_trading_trades")
            .select("*")
            .eq("id", str(trade_id))
            .eq("user_id", user["id"])
            .single()
            .execute()
        )
        
        if not getattr(trade_resp, "data", None):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trade not found"
            )
        
        return PaperTradeOut(**trade_resp.data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trade: {str(e)}"
        )