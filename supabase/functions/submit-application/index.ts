import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://cibero-riders.github.io",
]);

const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const ALLOWED_VEHICLES = new Set([
  "Bicicletă",
  "Bicicletă electrică",
  "Scuter",
  "Trotinetă electrică",
  "Mașină",
]);

const MAX_PROOF_SIZE = 5 * 1024 * 1024;

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;

  try {
    const url = new URL(origin);
    return (
      (url.hostname === "127.0.0.1" || url.hostname === "localhost") &&
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://cibero-riders.github.io",
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(origin: string, body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: corsHeaders(origin),
  });
}

function textField(form: FormData, name: string, maxLength: number): string {
  const value = form.get(name);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function requiredBoolean(form: FormData, name: string): boolean {
  return form.get(name) === "true";
}

function secretKey(): string {
  const keySet = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (keySet) {
    try {
      const parsed = JSON.parse(keySet) as Record<string, string>;
      if (parsed.default) return parsed.default;
    } catch {
      // Fall through to the legacy built-in key while projects migrate.
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";

  if (!isAllowedOrigin(origin)) {
    return json(origin, { error: "Origine nepermisă." }, 403);
  }

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return json(origin, { error: "Metodă nepermisă." }, 405);
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return json(origin, { error: "Format de cerere invalid." }, 415);
    }

    const form = await request.formData();

    // Honeypot: ordinary users never see or fill this field.
    if (textField(form, "website", 200)) {
      return json(origin, { ok: true });
    }

    const platform = textField(form, "platform", 10).toLowerCase();
    const applicationType = textField(form, "application_type", 30) || "new_account";
    const firstName = textField(form, "first_name", 100);
    const lastName = textField(form, "last_name", 100);
    const email = textField(form, "email", 254).toLowerCase();
    const phone = textField(form, "phone", 32);
    const city = textField(form, "city", 100);
    const vehicle = textField(form, "vehicle", 100);
    const message = textField(form, "message", 2000);
    const consentPrivacy = requiredBoolean(form, "consent_privacy");
    const consentDataAccuracy = requiredBoolean(form, "consent_data_accuracy");

    if (!new Set(["wolt", "glovo"]).has(platform)) {
      return json(origin, { error: "Platformă invalidă." }, 400);
    }
    if (!new Set(["new_account", "transfer"]).has(applicationType)) {
      return json(origin, { error: "Tip de cerere invalid." }, 400);
    }
    if (!firstName || !lastName || !city) {
      return json(origin, { error: "Completează toate câmpurile obligatorii." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(origin, { error: "Adresa de email nu este validă." }, 400);
    }
    if (!/^[+0-9().\s-]{7,32}$/.test(phone)) {
      return json(origin, { error: "Numărul de telefon nu este valid." }, 400);
    }
    if (vehicle && !ALLOWED_VEHICLES.has(vehicle)) {
      return json(origin, { error: "Tip de vehicul invalid." }, 400);
    }
    if (!consentPrivacy) {
      return json(origin, { error: "Confirmarea informării privind datele este obligatorie." }, 400);
    }
    if (platform === "wolt" && !consentDataAccuracy) {
      return json(origin, { error: "Confirmarea datelor Wolt este obligatorie." }, 400);
    }

    const proofValue = form.get("proof");
    const proof = proofValue instanceof File && proofValue.size > 0 ? proofValue : null;
    if (platform === "wolt" && !proof) {
      return json(origin, { error: "Captura Wolt Client este obligatorie." }, 400);
    }
    if (proof && (!ALLOWED_IMAGE_TYPES.has(proof.type) || proof.size > MAX_PROOF_SIZE)) {
      return json(origin, { error: "Captura trebuie să fie JPG, PNG sau WEBP și să nu depășească 5 MB." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseSecretKey = secretKey();
    if (!supabaseUrl || !supabaseSecretKey) {
      console.error("Missing Supabase server credentials.");
      return json(origin, { error: "Serviciul nu este configurat." }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const duplicateSince = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentDuplicate, error: duplicateError } = await supabase
      .from("applications")
      .select("id")
      .eq("platform", platform)
      .eq("email", email)
      .gte("created_at", duplicateSince)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      console.error("Duplicate check failed", duplicateError);
      return json(origin, { error: "Cererea nu a putut fi verificată." }, 500);
    }
    if (recentDuplicate) {
      return json(origin, { error: "O cerere cu acest email a fost trimisă recent. Încearcă din nou peste câteva minute." }, 429);
    }

    const applicationId = crypto.randomUUID();
    let proofPath: string | null = null;

    if (proof) {
      const date = new Date();
      const extension = ALLOWED_IMAGE_TYPES.get(proof.type)!;
      proofPath = `${platform}/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${applicationId}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("application-proofs")
        .upload(proofPath, proof, {
          contentType: proof.type,
          upsert: false,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Proof upload failed", uploadError);
        return json(origin, { error: "Captura nu a putut fi încărcată." }, 500);
      }
    }

    const { error: insertError } = await supabase.from("applications").insert({
      id: applicationId,
      platform,
      application_type: applicationType,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      city,
      vehicle: vehicle || null,
      message: message || null,
      proof_path: proofPath,
      consent_privacy: consentPrivacy,
      consent_data_accuracy: consentDataAccuracy,
    });

    if (insertError) {
      console.error("Application insert failed", insertError);
      if (proofPath) {
        await supabase.storage.from("application-proofs").remove([proofPath]);
      }
      return json(origin, { error: "Cererea nu a putut fi salvată." }, 500);
    }

    return json(origin, { ok: true, application_id: applicationId }, 201);
  } catch (error) {
    console.error("Unhandled submit-application error", error);
    return json(origin, { error: "A apărut o eroare neașteptată." }, 500);
  }
});
