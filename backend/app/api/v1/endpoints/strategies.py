import uuid
from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.strategy import StrategyCreate, StrategyOut, StrategyUpdate
from app.services.auth import get_current_user, ensure_user_profile
from app.services.backtest import generate_python_from_config

router = APIRouter()


@router.post("/", response_model=StrategyOut)
async def create_strategy(payload: StrategyCreate, user=Depends(get_current_user)):
    """Create a new trading strategy"""
    # Ensure user profile exists
    await run_in_threadpool(ensure_user_profile, user["id"], user["email"])

    strategy_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    python_code = generate_python_from_config(payload.config_json)

    row = {
        "id": str(strategy_id),
        "user_id": user["id"],
        "name": payload.name,
        "description": payload.description,
        "config_json": payload.config_json,
        "python_code": python_code,
        "visibility": payload.visibility,
        "created_at": now,
        "updated_at": now,
    }

    # Insert into Supabase
    res = await run_in_threadpool(supabase.table("strategies").insert, row)
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create strategy: {res.error}"
        )

    return StrategyOut(
        id=strategy_id,
        user_id=UUID(user["id"]),
        name=payload.name,
        description=payload.description,
        config_json=payload.config_json,
        python_code=python_code,
        visibility=payload.visibility,
        created_at=datetime.fromisoformat(now),
        updated_at=datetime.fromisoformat(now),
    )


@router.get("/{strategy_id}", response_model=StrategyOut)
async def get_strategy(strategy_id: UUID, user=Depends(get_current_user)):
    """Get a specific strategy by ID"""
    resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("*")
        .eq("id", str(strategy_id))
        .single
    )
    
    if not resp or getattr(resp, "data", None) is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    data = resp.data
    return StrategyOut(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        name=data["name"],
        description=data.get("description"),
        config_json=data.get("config_json", {}),
        python_code=data.get("python_code"),
        visibility=data.get("visibility", "private"),
        created_at=datetime.fromisoformat(data["created_at"]),
        updated_at=datetime.fromisoformat(data["updated_at"]),
    )


@router.get("/", response_model=List[StrategyOut])
async def list_strategies(user=Depends(get_current_user)):
    """List all strategies for the current user"""
    resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("*")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    strategies = []
    
    for item in data:
        strategies.append(StrategyOut(
            id=UUID(item["id"]),
            user_id=UUID(item["user_id"]),
            name=item["name"],
            description=item.get("description"),
            config_json=item.get("config_json", {}),
            python_code=item.get("python_code"),
            visibility=item.get("visibility", "private"),
            created_at=datetime.fromisoformat(item["created_at"]),
            updated_at=datetime.fromisoformat(item["updated_at"]),
        ))
    
    return strategies


@router.put("/{strategy_id}", response_model=StrategyOut)
async def update_strategy(
    strategy_id: UUID, 
    payload: StrategyUpdate, 
    user=Depends(get_current_user)
):
    """Update a strategy"""
    # Check if strategy exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("*")
        .eq("id", str(strategy_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp or getattr(resp, "data", None) is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    # Prepare update data
    update_data = {}
    if payload.name is not None:
        update_data["name"] = payload.name
    if payload.description is not None:
        update_data["description"] = payload.description
    if payload.config_json is not None:
        update_data["config_json"] = payload.config_json
        update_data["python_code"] = generate_python_from_config(payload.config_json)
    if payload.python_code is not None:
        update_data["python_code"] = payload.python_code
    if payload.visibility is not None:
        update_data["visibility"] = payload.visibility
    
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    # Update strategy
    res = await run_in_threadpool(
        supabase.table("strategies")
        .update(update_data)
        .eq("id", str(strategy_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update strategy: {res.error}"
        )
    
    # Return updated strategy
    return await get_strategy(strategy_id, user)


@router.delete("/{strategy_id}")
async def delete_strategy(strategy_id: UUID, user=Depends(get_current_user)):
    """Delete a strategy"""
    # Check if strategy exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("id")
        .eq("id", str(strategy_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp or getattr(resp, "data", None) is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    # Delete strategy
    res = await run_in_threadpool(
        supabase.table("strategies")
        .delete()
        .eq("id", str(strategy_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete strategy: {res.error}"
        )
    
    return {"message": "Strategy deleted successfully"}


@router.post("/generate-code")
async def generate_code(payload: dict, user=Depends(get_current_user)):
    """Generate Python code from strategy configuration"""
    cfg = payload.get("config_json") or payload
    code = await run_in_threadpool(generate_python_from_config, cfg)
    return {"python_code": code}
