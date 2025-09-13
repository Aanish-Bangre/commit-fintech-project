import uuid
from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.paper_trade import PaperTradeCreate, PaperTradeOut, PaperTradeUpdate
from app.services.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=PaperTradeOut)
async def create_paper_trade(payload: PaperTradeCreate, user=Depends(get_current_user)):
    """Create a new paper trade"""
    trade_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    
    row = {
        "id": str(trade_id),
        "user_id": user["id"],
        "strategy_id": str(payload.strategy_id) if payload.strategy_id else None,
        "symbol": payload.symbol,
        "side": payload.side,
        "qty": payload.qty,
        "price": payload.price,
        "status": "open",
        "pnl": None,
        "created_at": now,
    }
    
    res = await run_in_threadpool(supabase.table("paper_trades").insert, row)
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create paper trade: {res.error}"
        )
    
    return PaperTradeOut(
        id=trade_id,
        user_id=UUID(user["id"]),
        strategy_id=payload.strategy_id,
        symbol=payload.symbol,
        side=payload.side,
        qty=payload.qty,
        price=payload.price,
        status="open",
        pnl=None,
        created_at=datetime.fromisoformat(now),
    )


@router.get("/", response_model=List[PaperTradeOut])
async def list_paper_trades(user=Depends(get_current_user)):
    """List all paper trades for the current user"""
    resp = await run_in_threadpool(
        supabase.table("paper_trades")
        .select("*")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    trades = []
    
    for item in data:
        trades.append(PaperTradeOut(
            id=UUID(item["id"]),
            user_id=UUID(item["user_id"]),
            strategy_id=UUID(item["strategy_id"]) if item.get("strategy_id") else None,
            symbol=item["symbol"],
            side=item["side"],
            qty=float(item["qty"]),
            price=float(item["price"]),
            status=item.get("status", "open"),
            pnl=float(item["pnl"]) if item.get("pnl") is not None else None,
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return trades


@router.get("/{trade_id}", response_model=PaperTradeOut)
async def get_paper_trade(trade_id: UUID, user=Depends(get_current_user)):
    """Get a specific paper trade"""
    resp = await run_in_threadpool(
        supabase.table("paper_trades")
        .select("*")
        .eq("id", str(trade_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Paper trade not found")
    
    item = resp.data
    return PaperTradeOut(
        id=UUID(item["id"]),
        user_id=UUID(item["user_id"]),
        strategy_id=UUID(item["strategy_id"]) if item.get("strategy_id") else None,
        symbol=item["symbol"],
        side=item["side"],
        qty=float(item["qty"]),
        price=float(item["price"]),
        status=item.get("status", "open"),
        pnl=float(item["pnl"]) if item.get("pnl") is not None else None,
        created_at=datetime.fromisoformat(item["created_at"]),
    )


@router.put("/{trade_id}", response_model=PaperTradeOut)
async def update_paper_trade(
    trade_id: UUID, 
    payload: PaperTradeUpdate, 
    user=Depends(get_current_user)
):
    """Update a paper trade"""
    # Check if trade exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("paper_trades")
        .select("*")
        .eq("id", str(trade_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Paper trade not found")
    
    # Prepare update data
    update_data = {}
    if payload.status is not None:
        update_data["status"] = payload.status
    if payload.pnl is not None:
        update_data["pnl"] = payload.pnl
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # Update trade
    res = await run_in_threadpool(
        supabase.table("paper_trades")
        .update(update_data)
        .eq("id", str(trade_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update paper trade: {res.error}"
        )
    
    # Return updated trade
    return await get_paper_trade(trade_id, user)


@router.delete("/{trade_id}")
async def delete_paper_trade(trade_id: UUID, user=Depends(get_current_user)):
    """Delete a paper trade"""
    # Check if trade exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("paper_trades")
        .select("id")
        .eq("id", str(trade_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Paper trade not found")
    
    # Delete trade
    res = await run_in_threadpool(
        supabase.table("paper_trades")
        .delete()
        .eq("id", str(trade_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete paper trade: {res.error}"
        )
    
    return {"message": "Paper trade deleted successfully"}
