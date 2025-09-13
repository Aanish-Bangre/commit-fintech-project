import uuid
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.user_progress import UserProgressCreate, UserProgressOut, UserProgressUpdate
from app.services.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=UserProgressOut)
async def create_user_progress(payload: UserProgressCreate, user=Depends(get_current_user)):
    """Create or update user progress for education content"""
    # Verify education content exists
    education_resp = await run_in_threadpool(
        supabase.table("education")
        .select("id")
        .eq("id", str(payload.education_id))
        .single
    )
    
    if not education_resp.data:
        raise HTTPException(status_code=404, detail="Education content not found")
    
    # Check if progress already exists
    existing_resp = await run_in_threadpool(
        supabase.table("user_progress")
        .select("*")
        .eq("user_id", user["id"])
        .eq("education_id", str(payload.education_id))
        .single
    )
    
    if existing_resp.data:
        # Update existing progress
        progress_id = existing_resp.data["id"]
        update_data = {"status": payload.status}
        
        if payload.status == "completed":
            update_data["completed_at"] = datetime.utcnow().isoformat()
        
        res = await run_in_threadpool(
            supabase.table("user_progress")
            .update(update_data)
            .eq("id", progress_id)
        )
        
        if res.error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update progress: {res.error}"
            )
        
        # Return updated progress
        return await get_user_progress(progress_id, user)
    else:
        # Create new progress
        progress_id = uuid.uuid4()
        now = datetime.utcnow().isoformat()
        
        row = {
            "id": str(progress_id),
            "user_id": user["id"],
            "education_id": str(payload.education_id),
            "status": payload.status,
            "completed_at": now if payload.status == "completed" else None,
        }
        
        res = await run_in_threadpool(supabase.table("user_progress").insert, row)
        
        if res.error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create progress: {res.error}"
            )
        
        return UserProgressOut(
            id=progress_id,
            user_id=UUID(user["id"]),
            education_id=payload.education_id,
            status=payload.status,
            completed_at=datetime.fromisoformat(now) if payload.status == "completed" else None,
        )


@router.get("/", response_model=List[UserProgressOut])
async def list_user_progress(
    user=Depends(get_current_user),
    status: Optional[str] = Query(None)
):
    """List user's progress for all education content"""
    query = supabase.table("user_progress").select("*").eq("user_id", user["id"])
    
    if status:
        query = query.eq("status", status)
    
    resp = await run_in_threadpool(query.order("created_at", desc=True))
    
    data = resp.data if getattr(resp, "data", None) else []
    progress_items = []
    
    for item in data:
        progress_items.append(UserProgressOut(
            id=UUID(item["id"]),
            user_id=UUID(item["user_id"]),
            education_id=UUID(item["education_id"]),
            status=item["status"],
            completed_at=datetime.fromisoformat(item["completed_at"]) if item.get("completed_at") else None,
        ))
    
    return progress_items


@router.get("/{progress_id}", response_model=UserProgressOut)
async def get_user_progress(progress_id: UUID, user=Depends(get_current_user)):
    """Get specific user progress"""
    resp = await run_in_threadpool(
        supabase.table("user_progress")
        .select("*")
        .eq("id", str(progress_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="User progress not found")
    
    item = resp.data
    return UserProgressOut(
        id=UUID(item["id"]),
        user_id=UUID(item["user_id"]),
        education_id=UUID(item["education_id"]),
        status=item["status"],
        completed_at=datetime.fromisoformat(item["completed_at"]) if item.get("completed_at") else None,
    )


@router.put("/{progress_id}", response_model=UserProgressOut)
async def update_user_progress(
    progress_id: UUID, 
    payload: UserProgressUpdate, 
    user=Depends(get_current_user)
):
    """Update user progress"""
    # Check if progress exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("user_progress")
        .select("*")
        .eq("id", str(progress_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="User progress not found")
    
    # Prepare update data
    update_data = {"status": payload.status}
    
    if payload.status == "completed":
        update_data["completed_at"] = datetime.utcnow().isoformat()
    elif payload.completed_at is not None:
        update_data["completed_at"] = payload.completed_at.isoformat()
    
    # Update progress
    res = await run_in_threadpool(
        supabase.table("user_progress")
        .update(update_data)
        .eq("id", str(progress_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update progress: {res.error}"
        )
    
    # Return updated progress
    return await get_user_progress(progress_id, user)


@router.delete("/{progress_id}")
async def delete_user_progress(progress_id: UUID, user=Depends(get_current_user)):
    """Delete user progress"""
    # Check if progress exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("user_progress")
        .select("id")
        .eq("id", str(progress_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="User progress not found")
    
    # Delete progress
    res = await run_in_threadpool(
        supabase.table("user_progress")
        .delete()
        .eq("id", str(progress_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete progress: {res.error}"
        )
    
    return {"message": "User progress deleted successfully"}
