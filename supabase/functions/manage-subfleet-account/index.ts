import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set(["https://cibero-riders.github.io"]);

function allowedOrigin(origin: string): boolean {
  if (!origin || ALLOWED_ORIGINS.has(origin)) return true;
  try { const url = new URL(origin); return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname); }
  catch { return false; }
}
function headers(origin: string): HeadersInit {
  return { "Access-Control-Allow-Origin": origin && allowedOrigin(origin) ? origin : "https://cibero-riders.github.io", "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" };
}
function response(origin: string, body: Record<string, unknown>, status = 200): Response { return Response.json(body, { status, headers: headers(origin) }); }
function serviceKey(): string {
  const packed = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (packed) try { const values = JSON.parse(packed) as Record<string, string>; if (values.default) return values.default; } catch { /* fall through */ }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}
function text(value: unknown, limit: number): string { return typeof value === "string" ? value.trim().slice(0, limit) : ""; }

Deno.serve(async request => {
  const origin = request.headers.get("origin") ?? "";
  if (!allowedOrigin(origin)) return response(origin, { error: "Origine nepermisă." }, 403);
  if (request.method === "OPTIONS") return new Response("ok", { headers: headers(origin) });
  if (request.method !== "POST") return response(origin, { error: "Metodă nepermisă." }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const key = serviceKey();
    const bearer = request.headers.get("authorization") ?? "";
    if (!url || !key || !bearer.startsWith("Bearer ")) return response(origin, { error: "Sesiune invalidă." }, 401);
    const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: userData, error: userError } = await admin.auth.getUser(bearer.slice(7));
    if (userError || !userData.user) return response(origin, { error: "Sesiune invalidă." }, 401);
    const { data: profile, error: profileError } = await admin.from("admin_users").select("role, is_active").eq("user_id", userData.user.id).maybeSingle();
    if (profileError || profile?.role !== "admin" || !profile.is_active) return response(origin, { error: "Doar un administrator poate gestiona sub-flotele." }, 403);

    const payload = await request.json() as Record<string, unknown>;
    const action = text(payload.action, 40);
    if (action === "create_subfleet_with_account") {
      const name = text(payload.name, 120); const description = text(payload.description, 1000) || null;
      const email = text(payload.email, 254).toLowerCase(); const password = text(payload.password, 256); const displayName = text(payload.display_name, 120);
      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10 || !displayName) return response(origin, { error: "Completează numele sub-flotei, administratorul, emailul și o parolă de minimum 10 caractere." }, 400);
      const { data: fleet, error: fleetError } = await admin.from("subfleets").insert({ name, description }).select("id, name, description, is_active, created_at").single();
      if (fleetError || !fleet) throw fleetError ?? new Error("Sub-flota nu a putut fi creată.");
      try {
        const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
        if (createError || !created.user) throw createError ?? new Error("Contul nu a putut fi creat.");
        const { error: membershipError } = await admin.from("admin_users").insert({ user_id: created.user.id, display_name: displayName, role: "subfleet", subfleet_id: fleet.id, is_active: true });
        if (membershipError) { await admin.auth.admin.deleteUser(created.user.id); throw membershipError; }
        return response(origin, { ok: true, subfleet: fleet, account: { user_id: created.user.id, email, display_name: displayName, subfleet_id: fleet.id } }, 201);
      } catch (error) {
        await admin.from("subfleets").delete().eq("id", fleet.id);
        throw error;
      }
    }
    if (action === "create_subfleet") {
      const name = text(payload.name, 120); const description = text(payload.description, 1000) || null;
      if (name.length < 2) return response(origin, { error: "Numele sub-flotei trebuie să aibă cel puțin 2 caractere." }, 400);
      const { data, error } = await admin.from("subfleets").insert({ name, description }).select("id, name, description, is_active, created_at").single();
      if (error) throw error;
      return response(origin, { ok: true, subfleet: data }, 201);
    }
    if (action === "create_account") {
      const subfleetId = text(payload.subfleet_id, 64); const email = text(payload.email, 254).toLowerCase();
      const password = text(payload.password, 256); const displayName = text(payload.display_name, 120);
      if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(subfleetId) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10 || !displayName) return response(origin, { error: "Completează numele, emailul și o parolă de minimum 10 caractere." }, 400);
      const { data: fleet } = await admin.from("subfleets").select("id").eq("id", subfleetId).eq("is_active", true).maybeSingle();
      if (!fleet) return response(origin, { error: "Sub-flota selectată nu este disponibilă." }, 404);
      const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
      if (createError || !created.user) throw createError ?? new Error("Contul nu a putut fi creat.");
      const { error: membershipError } = await admin.from("admin_users").insert({ user_id: created.user.id, display_name: displayName, role: "subfleet", subfleet_id: subfleetId, is_active: true });
      if (membershipError) { await admin.auth.admin.deleteUser(created.user.id); throw membershipError; }
      return response(origin, { ok: true, account: { user_id: created.user.id, email, display_name: displayName, subfleet_id: subfleetId } }, 201);
    }
    if (action === "set_account_active") {
      const userId = text(payload.user_id, 64); const isActive = payload.is_active === true;
      if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(userId)) return response(origin, { error: "Cont invalid." }, 400);
      const { error } = await admin.from("admin_users").update({ is_active: isActive }).eq("user_id", userId).eq("role", "subfleet");
      if (error) throw error;
      return response(origin, { ok: true });
    }
    return response(origin, { error: "Acțiune necunoscută." }, 400);
  } catch (error) {
    console.error("manage-subfleet-account failure", error);
    return response(origin, { error: "Acțiunea nu a putut fi finalizată." }, 500);
  }
});
