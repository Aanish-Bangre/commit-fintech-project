import uuid
from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.comment import CommentCreate, CommentOut, CommentUpdate
from app.services.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=CommentOut)
async def create_comment(payload: CommentCreate, user=Depends(get_current_user)):
    """Create a new comment on a marketplace strategy"""
    # Verify marketplace entry exists
    marketplace_resp = await run_in_threadpool(
        supabase.table("marketplace")
        .select("id")
        .eq("id", str(payload.marketplace_id))
        .single
    )
    
    if not marketplace_resp.data:
        raise HTTPException(status_code=404, detail="Marketplace entry not found")
    
    comment_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    
    row = {
        "id": str(comment_id),
        "marketplace_id": str(payload.marketplace_id),
        "user_id": user["id"],
        "content": payload.content,
        "created_at": now,
    }
    
    res = await run_in_threadpool(supabase.table("comments").insert, row)
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create comment: {res.error}"
        )
    
    # Update comments count in marketplace
    await run_in_threadpool(
        supabase.table("marketplace")
        .update({"comments_count": supabase.table("marketplace").select("comments_count").eq("id", str(payload.marketplace_id)).single().data["comments_count"] + 1})
        .eq("id", str(payload.marketplace_id))
    )
    
    return CommentOut(
        id=comment_id,
        marketplace_id=payload.marketplace_id,
        user_id=UUID(user["id"]),
        content=payload.content,
        created_at=datetime.fromisoformat(now),
    )


@router.get("/marketplace/{marketplace_id}", response_model=List[CommentOut])
async def list_comments(marketplace_id: UUID):
    """List all comments for a marketplace entry"""
    resp = await run_in_threadpool(
        supabase.table("comments")
        .select("*")
        .eq("marketplace_id", str(marketplace_id))
        .order("created_at", desc=True)
    )
    
    data = resp.data if getattr(resp, "data", None) else []
    comments = []
    
    for item in data:
        comments.append(CommentOut(
            id=UUID(item["id"]),
            marketplace_id=UUID(item["marketplace_id"]),
            user_id=UUID(item["user_id"]),
            content=item["content"],
            created_at=datetime.fromisoformat(item["created_at"]),
        ))
    
    return comments


@router.get("/{comment_id}", response_model=CommentOut)
async def get_comment(comment_id: UUID):
    """Get a specific comment"""
    resp = await run_in_threadpool(
        supabase.table("comments")
        .select("*")
        .eq("id", str(comment_id))
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    item = resp.data
    return CommentOut(
        id=UUID(item["id"]),
        marketplace_id=UUID(item["marketplace_id"]),
        user_id=UUID(item["user_id"]),
        content=item["content"],
        created_at=datetime.fromisoformat(item["created_at"]),
    )


@router.put("/{comment_id}", response_model=CommentOut)
async def update_comment(
    comment_id: UUID, 
    payload: CommentUpdate, 
    user=Depends(get_current_user)
):
    """Update a comment (only by author)"""
    # Check if comment exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("comments")
        .select("*")
        .eq("id", str(comment_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Comment not found or access denied")
    
    # Update comment
    res = await run_in_threadpool(
        supabase.table("comments")
        .update({"content": payload.content})
        .eq("id", str(comment_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update comment: {res.error}"
        )
    
    # Return updated comment
    return await get_comment(comment_id)


@router.delete("/{comment_id}")
async def delete_comment(comment_id: UUID, user=Depends(get_current_user)):
    """Delete a comment (only by author)"""
    # Check if comment exists and belongs to user
    resp = await run_in_threadpool(
        supabase.table("comments")
        .select("marketplace_id")
        .eq("id", str(comment_id))
        .eq("user_id", user["id"])
        .single
    )
    
    if not resp.data:
        raise HTTPException(status_code=404, detail="Comment not found or access denied")
    
    marketplace_id = resp.data["marketplace_id"]
    
    # Delete comment
    res = await run_in_threadpool(
        supabase.table("comments")
        .delete()
        .eq("id", str(comment_id))
    )
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete comment: {res.error}"
        )
    
    # Update comments count in marketplace
    await run_in_threadpool(
        supabase.table("marketplace")
        .update({"comments_count": supabase.table("marketplace").select("comments_count").eq("id", str(marketplace_id)).single().data["comments_count"] - 1})
        .eq("id", str(marketplace_id))
    )
    
    return {"message": "Comment deleted successfully"}
