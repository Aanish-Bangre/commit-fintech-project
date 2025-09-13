import httpx
from fastapi import HTTPException, status, Header
from app.core.config import settings


async def get_current_user(authorization: str = Header(...)):
    """
    Verifies Bearer token by calling Supabase auth/v1/user endpoint.
    Returns a dict with `id` and `email`.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Missing Bearer token"
        )

    token = authorization.split(" ", 1)[1]
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}", 
                "apikey": settings.supabase_anon_key
            },
            timeout=10,
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired token"
        )

    user = resp.json()
    return {"id": user["id"], "email": user.get("email")}


async def ensure_user_profile(user_id: str, email: str, name: str = None):
    """
    Creates/updates a profile row in `users` table extension.
    This uses Supabase Postgres insert with upsert via ON CONFLICT on id.
    """
    from datetime import datetime
    from app.core.database import supabase
    
    payload = {
        "id": user_id,
        "email": email,
        "name": name or "",
        "role": "retail",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    
    # upsert
    res = supabase.table("users").upsert(payload).execute()
    if res.error:
        # log but do not break
        print("Supabase upsert user error:", res.error)
    return res.data
