from supabase import create_client
from app.core.config import settings


def get_supabase_client():
    """Get Supabase client with service role key for server operations"""
    return create_client(
        settings.supabase_url, 
        settings.supabase_service_role_key
    )


def get_supabase_anon_client():
    """Get Supabase client with anon key for client operations"""
    return create_client(
        settings.supabase_url, 
        settings.supabase_anon_key
    )


# Global database client
supabase = get_supabase_client()
