import "server-only";

export function getServerSupabaseSecret() {
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new Error("Lipsește SUPABASE_SECRET_KEY pentru operațiunile server-side.");
  }

  return secretKey;
}
