import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getPublicSupabaseConfig } from "./public-env";
import { getServerSupabaseSecret } from "./server-env";

export function createAdminClient() {
  const { url } = getPublicSupabaseConfig();
  const secretKey = getServerSupabaseSecret();

  return createSupabaseClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
