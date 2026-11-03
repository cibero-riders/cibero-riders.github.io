import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://cibero.delivery",
  "https://www.cibero.delivery",
]);
const BOT_PATTERN = /bot|crawler|spider|preview|headless|lighthouse|pagespeed|monitor|uptime/i;

function cors(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://cibero.delivery";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };
}

function response(origin: string | null, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: cors(origin) });
}

function bucharestDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function normalizedPath(value: unknown) {
  if (typeof value !== "string") return null;
  const path = value.trim().split(/[?#]/, 1)[0].replace(/\/+/g, "/");
  if (!path.startsWith("/") || path.length > 180 || /[\u0000-\u001f]/.test(path)) return null;
  return path === "/" ? path : `${path.replace(/\/+$/, "")}/`;
}

function normalizedHost(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const host = value.trim().toLowerCase();
  return /^[a-z0-9.-]{1,160}$/.test(host) ? host : null;
}

async function sha256Hmac(secret: string, value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async request => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (request.method !== "POST") return response(origin, 405, { error: "Method not allowed." });
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return response(origin, 403, { error: "Origin not allowed." });

  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) return response(origin, 202, { recorded: false });

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = request.headers.get("cf-connecting-ip") ?? forwardedFor ?? request.headers.get("x-real-ip");
  if (!ip) return response(origin, 202, { recorded: false });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return response(origin, 400, { error: "Invalid JSON." });
  }

  const path = normalizedPath(body.path);
  const entryKind = body.entry_kind === "external" ? "external" : body.entry_kind === "direct" ? "direct" : null;
  const referrerHost = normalizedHost(body.referrer_host);
  if (!path || !entryKind) return response(origin, 400, { error: "Invalid analytics event." });
  if (path === "/statistici/") return response(origin, 202, { recorded: false });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const hashSecret = Deno.env.get("ANALYTICS_HASH_SECRET") ?? serviceKey;
  if (!supabaseUrl || !serviceKey || !hashSecret) {
    console.error("Analytics collector is missing server credentials.");
    return response(origin, 500, { error: "Collector not configured." });
  }

  const now = new Date();
  const day = bucharestDate(now);
  const visitorHash = await sha256Hmac(hashSecret, `${day}|${ip}|${userAgent}`);
  const bucketMs = 30 * 60 * 1000;
  const visitBucket = new Date(Math.floor(now.getTime() / bucketMs) * bucketMs).toISOString();
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.from("site_analytics_entries").upsert({
    occurred_at: now.toISOString(),
    occurred_on: day,
    path,
    referrer_host: entryKind === "external" ? referrerHost : null,
    entry_kind: entryKind,
    visitor_hash: visitorHash,
    visit_bucket: visitBucket,
  }, {
    onConflict: "occurred_on,path,visitor_hash,visit_bucket",
    ignoreDuplicates: true,
  });

  if (error) {
    console.error("Analytics insert failed", error.code, error.message);
    return response(origin, 500, { error: "Entry could not be recorded." });
  }
  return response(origin, 202, { recorded: true });
});
