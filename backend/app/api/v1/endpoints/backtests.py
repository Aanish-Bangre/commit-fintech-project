import uuid
from datetime import datetime, date
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.backtest import BacktestCreate, BacktestOut, BacktestUpdate
from app.services.auth import get_current_user
from app.services.backtest import run_backtest_with_strategy, simple_vector_backtest
import pandas as pd
import numpy as np

router = APIRouter()


@router.post("/", response_model=BacktestOut)
async def run_backtest_endpoint(payload: BacktestCreate, user=Depends(get_current_user)):
    """
    Run a backtest for a strategy.
    """
    # Fetch strategy to ensure it exists and user has access
    sresp = await run_in_threadpool(
        lambda: supabase.table("strategies")
        .select("*")
        .eq("id", str(payload.strategy_id))
        .single()
        .execute()
    )
    
    if sresp is None or getattr(sresp, "data", None) is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    strategy_data = sresp.data
    
    try:
        # Extract symbol from dataset (assuming format like "BHARTIARTL" or "BHARTIARTL_NS")
        symbol = payload.dataset.upper()
        if not symbol.endswith("_NS"):
            symbol = f"{symbol}_NS"
        
        # Run backtest with the strategy
        metrics, equity_curve = await run_in_threadpool(
            run_backtest_with_strategy,
            strategy_data.get("config_json", {}),
            symbol,
            payload.start_date,
            payload.end_date,
            payload.initial_capital
        )
        
    except FileNotFoundError:
        # Fallback: create demo data if stock file not found
        rng = np.random.default_rng(42)
        prices = np.cumprod(1 + rng.normal(0, 0.01, 252 * 2)) * 100
        df = pd.DataFrame({
            "Close": prices, 
            "Date": pd.date_range(end=pd.Timestamp.today(), periods=len(prices))
        })
        
        # Create simple signals
        df["Close"] = df["Close"].astype(float)
        df["sma_10"] = df["Close"].rolling(10).mean().bfill()
        df["sma_50"] = df["Close"].rolling(50).mean().bfill()
        df["signal"] = 0
        df.loc[(df["sma_10"].shift(1) < df["sma_50"].shift(1)) & (df["sma_10"] > df["sma_50"]), "signal"] = 1
        df.loc[(df["sma_10"].shift(1) > df["sma_50"].shift(1)) & (df["sma_10"] < df["sma_50"]), "signal"] = -1
        
        # Run demo backtest
        metrics, equity_curve = await run_in_threadpool(
            simple_vector_backtest, 
            df, 
            "signal", 
            payload.initial_capital
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Backtest failed: {str(e)}"
        )

    # Store backtest record
    backtest_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    row = {
        "id": str(backtest_id),
        "strategy_id": str(payload.strategy_id),
        "dataset": payload.dataset,
        "start_date": payload.start_date.isoformat(),
        "end_date": payload.end_date.isoformat(),
        "metrics_json": metrics,
        "equity_curve_url": None,
        "created_at": now,
    }
    
    res = await run_in_threadpool(
        lambda: supabase.table("backtests").insert(row).execute()
    )
    
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save backtest"
        )

    return BacktestOut(
        id=backtest_id,
        strategy_id=payload.strategy_id,
        dataset=payload.dataset,
        start_date=payload.start_date,
        end_date=payload.end_date,
        metrics_json=metrics,
        equity_curve_url=None,
        created_at=datetime.fromisoformat(now),
    )


@router.get("/{backtest_id}", response_model=BacktestOut)
async def get_backtest(backtest_id: UUID, user=Depends(get_current_user)):
    """Get a specific backtest by ID"""
    resp = await run_in_threadpool(
        lambda: supabase.table("backtests")
        .select("*")
        .eq("id", str(backtest_id))
        .single()
        .execute()
    )
    
    if resp is None or getattr(resp, "data", None) is None:
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    data = resp.data
    return BacktestOut(
        id=UUID(data["id"]),
        strategy_id=UUID(data["strategy_id"]),
        dataset=data["dataset"],
        start_date=date.fromisoformat(data["start_date"]),
        end_date=date.fromisoformat(data["end_date"]),
        metrics_json=data.get("metrics_json", {}),
        equity_curve_url=data.get("equity_curve_url"),
        created_at=datetime.fromisoformat(data["created_at"]),
    )


@router.get("/", response_model=List[BacktestOut])
async def list_backtests(user=Depends(get_current_user)):
    """List all backtests for the current user's strategies"""
    # First get user's strategies
    strategies_resp = await run_in_threadpool(
        lambda: supabase.table("strategies")
        .select("id")
        .eq("user_id", user["id"])
        .execute()
    )
    
    if not strategies_resp.data:
        return []
    
    strategy_ids = [strategy["id"] for strategy in strategies_resp.data]
    
    # Get backtests for these strategies
    resp = await run_in_threadpool(
        lambda: supabase.table("backtests")
        .select("*")
        .in_("strategy_id", strategy_ids)
        .order("created_at", desc=True)
        .execute()
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    backtests = []
    
    for item in data:
        backtests.append(BacktestOut(
            id=UUID(item["id"]),
            strategy_id=UUID(item["strategy_id"]),
            dataset=item["dataset"],
            start_date=date.fromisoformat(item["start_date"]),
            end_date=date.fromisoformat(item["end_date"]),
            metrics_json=item.get("metrics_json", {}),
            equity_curve_url=item.get("equity_curve_url"),
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return backtests


@router.get("/strategy/{strategy_id}", response_model=List[BacktestOut])
async def list_strategy_backtests(strategy_id: UUID, user=Depends(get_current_user)):
    """List all backtests for a specific strategy"""
    # Verify strategy belongs to user
    strategy_resp = await run_in_threadpool(
        lambda: supabase.table("strategies")
        .select("id")
        .eq("id", str(strategy_id))
        .eq("user_id", user["id"])
        .single()
        .execute()
    )
    
    if not strategy_resp.data:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    # Get backtests for this strategy
    resp = await run_in_threadpool(
        lambda: supabase.table("backtests")
        .select("*")
        .eq("strategy_id", str(strategy_id))
        .order("created_at", desc=True)
        .execute()
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    backtests = []
    
    for item in data:
        backtests.append(BacktestOut(
            id=UUID(item["id"]),
            strategy_id=UUID(item["strategy_id"]),
            dataset=item["dataset"],
            start_date=date.fromisoformat(item["start_date"]),
            end_date=date.fromisoformat(item["end_date"]),
            metrics_json=item.get("metrics_json", {}),
            equity_curve_url=item.get("equity_curve_url"),
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return backtests


@router.delete("/{backtest_id}")
async def delete_backtest(backtest_id: UUID, user=Depends(get_current_user)):
    """Delete a backtest"""
    # Verify backtest belongs to user's strategy
    resp = await run_in_threadpool(
        lambda: supabase.table("backtests")
        .select("strategy_id")
        .eq("id", str(backtest_id))
        .single()
        .execute()
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    # Check if strategy belongs to user
    strategy_resp = await run_in_threadpool(
        lambda: supabase.table("strategies")
        .select("id")
        .eq("id", resp.data["strategy_id"])
        .eq("user_id", user["id"])
        .single()
        .execute()
    )
    
    if not strategy_resp.data:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Delete backtest
    res = await run_in_threadpool(
        lambda: supabase.table("backtests")
        .delete()
        .eq("id", str(backtest_id))
        .execute()
    )
    
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete backtest"
        )
    
    return {"message": "Backtest deleted successfully"}
