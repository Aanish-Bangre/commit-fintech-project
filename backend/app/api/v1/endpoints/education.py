import uuid
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.education import EducationCreate, EducationOut, EducationUpdate
from app.services.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=EducationOut)
async def create_education_content(payload: EducationCreate, user=Depends(get_current_user)):
    """Create new education content (admin only - for now, any authenticated user)"""
    education_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    
    row = {
        "id": str(education_id),
        "title": payload.title,
        "content": payload.content,
        "category": payload.category,
        "difficulty": payload.difficulty,
        "created_at": now,
    }
    
    res = await run_in_threadpool(supabase.table("education").insert, row)
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create education content: {res.error}"
        )
    
    return EducationOut(
        id=education_id,
        title=payload.title,
        content=payload.content,
        category=payload.category,
        difficulty=payload.difficulty,
        created_at=datetime.fromisoformat(now),
    )


@router.get("/", response_model=List[EducationOut])
async def list_education_content(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None)
):
    """List all education content with optional filtering"""
    query = supabase.table("education").select("*")
    
    if category:
        query = query.eq("category", category)
    if difficulty:
        query = query.eq("difficulty", difficulty)
    
    resp = await run_in_threadpool(query.order("created_at", desc=True))
    
    data = resp.data if getattr(resp, "data", None) else []
    education_items = []
    
    for item in data:
        education_items.append(EducationOut(
            id=UUID(item["id"]),
            title=item["title"],
            content=item.get("content"),
            category=item.get("category"),
            difficulty=item["difficulty"],
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return education_items


@router.get("/{education_id}", response_model=EducationOut)
async def get_education_content(education_id: UUID):
    """Get specific education content"""
    resp = await run_in_threadpool(
        supabase.table("education")
        .select("*")
        .eq("id", str(education_id))
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Education content not found")
    
    item = resp.data
    return EducationOut(
        id=UUID(item["id"]),
        title=item["title"],
        content=item.get("content"),
        category=item.get("category"),
        difficulty=item["difficulty"],
        created_at=datetime.fromisoformat(item["created_at"]),
    )


@router.put("/{education_id}", response_model=EducationOut)
async def update_education_content(
    education_id: UUID, 
    payload: EducationUpdate, 
    user=Depends(get_current_user)
):
    """Update education content"""
    # Check if content exists
    resp = await run_in_threadpool(
        supabase.table("education")
        .select("*")
        .eq("id", str(education_id))
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Education content not found")
    
    # Prepare update data
    update_data = {}
    if payload.title is not None:
        update_data["title"] = payload.title
    if payload.content is not None:
        update_data["content"] = payload.content
    if payload.category is not None:
        update_data["category"] = payload.category
    if payload.difficulty is not None:
        update_data["difficulty"] = payload.difficulty
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # Update content
    res = await run_in_threadpool(
        supabase.table("education")
        .update(update_data)
        .eq("id", str(education_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update education content: {res.error}"
        )
    
    # Return updated content
    return await get_education_content(education_id)


@router.delete("/{education_id}")
async def delete_education_content(education_id: UUID, user=Depends(get_current_user)):
    """Delete education content"""
    # Check if content exists
    resp = await run_in_threadpool(
        supabase.table("education")
        .select("id")
        .eq("id", str(education_id))
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Education content not found")
    
    # Delete content
    res = await run_in_threadpool(
        supabase.table("education")
        .delete()
        .eq("id", str(education_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete education content: {res.error}"
        )
    
    return {"message": "Education content deleted successfully"}
