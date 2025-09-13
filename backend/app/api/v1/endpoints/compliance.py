import uuid
from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.compliance import ComplianceLogCreate, ComplianceLogOut
from app.services.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ComplianceLogOut)
async def create_compliance_log(payload: ComplianceLogCreate, user=Depends(get_current_user)):
    """Create a new compliance log entry"""
    # Verify strategy exists and belongs to user
    strategy_resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("id")
        .eq("id", str(payload.strategy_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not strategy_resp.data:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    log_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    
    row = {
        "id": str(log_id),
        "user_id": user["id"],
        "strategy_id": str(payload.strategy_id),
        "algo_id": payload.algo_id,
        "action": payload.action,
        "details": payload.details,
        "created_at": now,
    }
    
    res = await run_in_threadpool(supabase.table("compliance_logs").insert, row)
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create compliance log: {res.error}"
        )
    
    return ComplianceLogOut(
        id=log_id,
        user_id=UUID(user["id"]),
        strategy_id=payload.strategy_id,
        algo_id=payload.algo_id,
        action=payload.action,
        details=payload.details,
        created_at=datetime.fromisoformat(now),
    )


@router.get("/", response_model=List[ComplianceLogOut])
async def list_compliance_logs(user=Depends(get_current_user)):
    """List all compliance logs for the current user"""
    resp = await run_in_threadpool(
        supabase.table("compliance_logs")
        .select("*")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    logs = []
    
    for item in data:
        logs.append(ComplianceLogOut(
            id=UUID(item["id"]),
            user_id=UUID(item["user_id"]),
            strategy_id=UUID(item["strategy_id"]),
            algo_id=item["algo_id"],
            action=item["action"],
            details=item["details"],
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return logs


@router.get("/strategy/{strategy_id}", response_model=List[ComplianceLogOut])
async def list_strategy_compliance_logs(strategy_id: UUID, user=Depends(get_current_user)):
    """List compliance logs for a specific strategy"""
    # Verify strategy belongs to user
    strategy_resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("id")
        .eq("id", str(strategy_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not strategy_resp.data:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    resp = await run_in_threadpool(
        supabase.table("compliance_logs")
        .select("*")
        .eq("strategy_id", str(strategy_id))
        .order("created_at", desc=True)
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    logs = []
    
    for item in data:
        logs.append(ComplianceLogOut(
            id=UUID(item["id"]),
            user_id=UUID(item["user_id"]),
            strategy_id=UUID(item["strategy_id"]),
            algo_id=item["algo_id"],
            action=item["action"],
            details=item["details"],
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return logs


@router.get("/{log_id}", response_model=ComplianceLogOut)
async def get_compliance_log(log_id: UUID, user=Depends(get_current_user)):
    """Get a specific compliance log"""
    resp = await run_in_threadpool(
        supabase.table("compliance_logs")
        .select("*")
        .eq("id", str(log_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Compliance log not found")
    
    item = resp.data
    return ComplianceLogOut(
        id=UUID(item["id"]),
        user_id=UUID(item["user_id"]),
        strategy_id=UUID(item["strategy_id"]),
        algo_id=item["algo_id"],
        action=item["action"],
        details=item["details"],
        created_at=datetime.fromisoformat(item["created_at"]),
    )
