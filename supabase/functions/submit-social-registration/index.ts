const ALLOWED_ORIGINS = new Set(["https://cibero-riders.github.io"]);
const CITIES = new Set([
  "Alba Iulia", "Arad", "Bacău", "Baia Mare", "Botoșani", "Brăila", "Brașov", "București", "Buzău", "Cluj-Napoca", "Constanța", "Craiova", "Deva", "Drobeta-Turnu Severin", "Focșani", "Galați", "Hunedoara", "Iași", "Mediaș", "Miercurea-Ciuc", "Onești", "Oradea", "Piatra Neamț", "Pitești", "Ploiești", "Râmnicu Vâlcea", "Reșița", "Roman", "Satu Mare", "Sfântu Gheorghe", "Sibiu", "Sighișoara", "Slatina", "Suceava", "Târgoviște", "Târgu Mureș", "Tecuci", "Timișoara", "Tulcea", "Vaslui", "Zalău",
]);
const VEHICLES = new Set(["Bicicletă", "Bicicletă electrică", "Scuter", "Trotinetă electrică", "Mașină"]);
const COURIER_TYPES = new Set(["new_courier", "pfa", "experienced_courier", "srl"]);
const DISCOVERY_SOURCES = new Set(["facebook", "instagram", "tiktok", "olx", "google", "recommendation", "other"]);
const PLATFORMS = new Set(["bolt", "glovo", "wolt"]);

function allowedOrigin(origin: string): boolean {
  if (!origin || ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  } catch { return false; }
}

function headers(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin && allowedOrigin(origin) ? origin : "https://cibero-riders.github.io",
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(origin: string, body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status, headers: headers(origin) });
}

function value(form: FormData, name: string, length: number): string {
  const raw = form.get(name);
  return typeof raw === "string" ? raw.trim().slice(0, length) : "";
}

function serviceKey(): string {
  const keys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (keys) {
    try {
      const parsed = JSON.parse(keys) as Record<string, string>;
      if (parsed.default) return parsed.default;
    } catch { /* fall through */ }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

Deno.serve(async request => {
  const origin = request.headers.get("origin") ?? "";
  if (!allowedOrigin(origin)) return json(origin, { error: "Origine nepermisă." }, 403);
  if (request.method === "OPTIONS") return new Response("ok", { headers: headers(origin) });
  if (request.method !== "POST") return json(origin, { error: "Metodă nepermisă." }, 405);

  try {
    const form = await request.formData();
    if (value(form, "website", 200)) return json(origin, { ok: true });

    const fullName = value(form, "full_name", 200);
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const email = value(form, "email", 254).toLowerCase();
    const phone = value(form, "phone", 32);
    const nationality = value(form, "nationality", 100);
    const city = value(form, "city", 100);
    const vehicle = value(form, "vehicle", 100);
    const courierType = value(form, "courier_type", 40);
    const discoverySource = value(form, "discovery_source", 40);
    const message = value(form, "message", 2000);
    const desiredPlatforms = form.getAll("platforms").filter(item => typeof item === "string") as string[];

    if (nameParts.length < 2 || !nationality || !city || !vehicle || !message) return json(origin, { error: "Completează toate câmpurile obligatorii." }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(origin, { error: "Adresa de email nu este validă." }, 400);
    if (!/^[+0-9().\s-]{7,32}$/.test(phone)) return json(origin, { error: "Numărul de telefon nu este valid." }, 400);
    if (!CITIES.has(city) || !VEHICLES.has(vehicle) || !COURIER_TYPES.has(courierType) || !DISCOVERY_SOURCES.has(discoverySource)) return json(origin, { error: "Una dintre opțiunile selectate nu este validă." }, 400);
    if (!desiredPlatforms.length || desiredPlatforms.some(platform => !PLATFORMS.has(platform))) return json(origin, { error: "Selectează cel puțin o platformă." }, 400);
    if (value(form, "adult_confirmed", 10) !== "true" || value(form, "consent_privacy", 10) !== "true") return json(origin, { error: "Confirmările obligatorii lipsesc." }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const secret = serviceKey();
    if (!supabaseUrl || !secret) return json(origin, { error: "Serviciul nu este configurat." }, 500);
    const supabase = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });

    const duplicateSince = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recent, error: duplicateError } = await supabase.from("applications")
      .select("id").eq("platform", "social_media").eq("email", email).gte("created_at", duplicateSince).limit(1).maybeSingle();
    if (duplicateError) throw duplicateError;
    if (recent) return json(origin, { error: "O înregistrare cu acest email a fost trimisă recent. Încearcă din nou peste câteva minute." }, 429);

    const { data, error } = await supabase.from("applications").insert({
      platform: "social_media",
      application_type: "social_registration",
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" "),
      email,
      phone,
      city,
      vehicle,
      message,
      courier_type: courierType,
      nationality,
      discovery_source: discoverySource,
      desired_platforms: desiredPlatforms,
      consent_privacy: true,
      consent_data_accuracy: true,
      source: "social_media",
    }).select("id").single();
    if (error) throw error;
    return json(origin, { ok: true, application_id: data.id }, 201);
  } catch (error) {
    console.error("submit-social-registration failure", error);
    return json(origin, { error: "Înregistrarea nu a putut fi trimisă. Încearcă din nou." }, 500);
  }
});
