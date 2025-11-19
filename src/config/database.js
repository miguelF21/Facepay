// Configuración de base de datos activa
// Cambiar USE_MONGODB a false para volver a Supabase

export const DATABASE_CONFIG = {
  USE_MONGODB: true,  // Cambiar a false para usar Supabase
  USE_SUPABASE: false,  // Cambiar a true para usar Supabase
};

export function isDatabaseMongo() {
  return DATABASE_CONFIG.USE_MONGODB;
}

export function isDatabaseSupabase() {
  return DATABASE_CONFIG.USE_SUPABASE;
}
