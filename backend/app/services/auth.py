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
    Placeholder for user profile creation.
    Since we don't have a users table yet, we'll skip this for now.
    """
    # Skip user profile creation since the users table doesn't exist
    # The authentication is working fine without this
    return {"id": user_id, "email": email}
