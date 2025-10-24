from supabase import create_client, Client
from django.conf import settings



def get_supabase_client() -> Client:
    supabase_url = settings.SUPABASE_URL
    supabase_key = settings.SUPABASE_KEY

    if not supabase_url or not supabase_key:
        raise ValueError("Supabase URL and Key must be configured in settings")

    return create_client(supabase_url, supabase_key)



