import uuid
from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.marketplace import MarketplaceCreate, MarketplaceOut, MarketplaceUpdate
from app.services.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=MarketplaceOut)
async def create_marketplace_entry(payload: MarketplaceCreate, user=Depends(get_current_user)):
    """Add a strategy to the marketplace"""
    # Verify strategy exists and is public
    strategy_resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("id, visibility")
        .eq("id", str(payload.strategy_id))
        .single
    )
    
    if not strategy_resp.data:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    if strategy_resp.data["visibility"] != "public":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only public strategies can be added to marketplace"
        )
    
    # Check if already in marketplace
    existing = await run_in_threadpool(
        supabase.table("marketplace")
        .select("id")
        .eq("strategy_id", str(payload.strategy_id))
        .single
    )
    
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Strategy already in marketplace"
        )
    
    marketplace_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    
    row = {
        "id": str(marketplace_id),
        "strategy_id": str(payload.strategy_id),
        "user_id": user["id"],
        "likes": 0,
        "forks": 0,
        "comments_count": 0,
        "created_at": now,
    }
    
    res = await run_in_threadpool(supabase.table("marketplace").insert, row)
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add to marketplace: {res.error}"
        )
    
    return MarketplaceOut(
        id=marketplace_id,
        strategy_id=payload.strategy_id,
        user_id=UUID(user["id"]),
        likes=0,
        forks=0,
        comments_count=0,
        created_at=datetime.fromisoformat(now),
    )


@router.get("/", response_model=List[MarketplaceOut])
async def list_marketplace_strategies():
    """List all strategies in the marketplace"""
    resp = await run_in_threadpool(
        supabase.table("marketplace")
        .select("*")
        .order("created_at", desc=True)
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    marketplace_items = []
    
    for item in data:
        marketplace_items.append(MarketplaceOut(
            id=UUID(item["id"]),
            strategy_id=UUID(item["strategy_id"]),
            user_id=UUID(item["user_id"]),
            likes=item["likes"],
            forks=item["forks"],
            comments_count=item["comments_count"],
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return marketplace_items


@router.get("/{marketplace_id}", response_model=MarketplaceOut)
async def get_marketplace_entry(marketplace_id: UUID):
    """Get a specific marketplace entry"""
    resp = await run_in_threadpool(
        supabase.table("marketplace")
        .select("*")
        .eq("id", str(marketplace_id))
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Marketplace entry not found")
    
    item = resp.data
    return MarketplaceOut(
        id=UUID(item["id"]),
        strategy_id=UUID(item["strategy_id"]),
        user_id=UUID(item["user_id"]),
        likes=item["likes"],
        forks=item["forks"],
        comments_count=item["comments_count"],
        created_at=datetime.fromisoformat(item["created_at"]),
    )


@router.post("/{marketplace_id}/like")
async def like_strategy(marketplace_id: UUID, user=Depends(get_current_user)):
    """Like a strategy in the marketplace"""
    # Increment likes count
    res = await run_in_threadpool(
        supabase.table("marketplace")
        .update({"likes": supabase.table("marketplace").select("likes").eq("id", str(marketplace_id)).single().data["likes"] + 1})
        .eq("id", str(marketplace_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to like strategy: {res.error}"
        )
    
    return {"message": "Strategy liked successfully"}


@router.post("/{marketplace_id}/fork")
async def fork_strategy(marketplace_id: UUID, user=Depends(get_current_user)):
    """Fork a strategy from the marketplace"""
    # Get the original strategy
    marketplace_resp = await run_in_threadpool(
        supabase.table("marketplace")
        .select("strategy_id")
        .eq("id", str(marketplace_id))
        .single
    )
    
    if not marketplace_resp.data:
        raise HTTPException(status_code=404, detail="Marketplace entry not found")
    
    strategy_resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("*")
        .eq("id", marketplace_resp.data["strategy_id"])
        .single
    )
    
    if not strategy_resp.data:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    # Create a copy of the strategy for the user
    original_strategy = strategy_resp.data
    new_strategy_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    
    new_strategy = {
        "id": str(new_strategy_id),
        "user_id": user["id"],
        "name": f"{original_strategy['name']} (Fork)",
        "description": f"Forked from: {original_strategy['description'] or 'No description'}",
        "config_json": original_strategy["config_json"],
        "python_code": original_strategy["python_code"],
        "visibility": "private",
        "created_at": now,
        "updated_at": now,
    }
    
    # Insert new strategy
    strategy_res = await run_in_threadpool(supabase.table("strategies").insert, new_strategy)
    
    if strategy_res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fork strategy: {strategy_res.error}"
        )
    
    # Increment fork count
    fork_res = await run_in_threadpool(
        supabase.table("marketplace")
        .update({"forks": supabase.table("marketplace").select("forks").eq("id", str(marketplace_id)).single().data["forks"] + 1})
        .eq("id", str(marketplace_id))
    )
    
    if fork_res.error:
        print(f"Warning: Failed to update fork count: {fork_res.error}")
    
    return {"message": "Strategy forked successfully", "new_strategy_id": str(new_strategy_id)}


@router.delete("/{marketplace_id}")
async def remove_from_marketplace(marketplace_id: UUID, user=Depends(get_current_user)):
    """Remove a strategy from the marketplace (only by owner)"""
    # Check if user owns the marketplace entry
    resp = await run_in_threadpool(
        supabase.table("marketplace")
        .select("id")
        .eq("id", str(marketplace_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Marketplace entry not found or access denied")
    
    # Delete marketplace entry
    res = await run_in_threadpool(
        supabase.table("marketplace")
        .delete()
        .eq("id", str(marketplace_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove from marketplace: {res.error}"
        )
    
    return {"message": "Strategy removed from marketplace successfully"}
