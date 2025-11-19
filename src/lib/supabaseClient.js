import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

function getSupabaseClient() {
  // TEMPORAL: Deshabilitado para usar MongoDB
  // Descomentar cuando vuelvas a usar Supabase
  /*
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using MongoDB API.');
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });

  return supabaseInstance;
  */
  
  // TEMPORAL: Retornar null para forzar uso de MongoDB
  console.log('Supabase temporalmente deshabilitado - Usando MongoDB API');
  return null;
}

export const supabase = getSupabaseClient();
