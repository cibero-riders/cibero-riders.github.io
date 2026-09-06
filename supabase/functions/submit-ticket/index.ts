import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set(["https://cibero-riders.github.io"]);
const CATEGORIES = new Set(["bolt", "glovo", "wolt", "rapoarte_plati", "probleme_admin", "deconturi", "inactivitate"]);
const TYPE_SETS: Record<string, Set<string>> = {
  bolt: new Set(["phone", "email", "iban", "city", "vehicle", "plate_number", "activate_chas", "deactivate_chas", "other", "suma_incorecta", "lipsa_plata", "clarificare_decont", "alta_problema_plata"]),
  glovo: new Set(["phone", "email", "iban", "city", "vehicle", "plate_number", "activate_chas", "deactivate_chas", "other", "comanda_anulata", "suma_incorecta", "lipsa_plata", "clarificare_decont", "alta_problema_plata"]),
  wolt: new Set(["transfer_cont", "phone", "email", "iban", "city", "vehicle", "other", "suma_incorecta", "lipsa_plata", "clarificare_decont", "alta_problema_plata"]),
  rapoarte_plati: new Set(["suma_incorecta", "lipsa_plata", "clarificare_decont", "alta_problema_plata"]),
  probleme_admin: new Set(["actualizare_documente", "problema_contract", "alta_problema_admin"]),
  deconturi: new Set(["deconturi", "problema_decontare", "trimite_bonuri_pdf"]),
  inactivitate: new Set(["inactivitate"]),
};
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const SUPPORT_TYPES = new Set([...IMAGE_TYPES, "application/pdf"]);
const ACTIVE_STATUSES = ["new", "reviewing", "clarification", "sent_to_platform"];
const MAX_SUPPORT = 10 * 1024 * 1024;
const MAX_PDF = 20 * 1024 * 1024;

function isAllowedOrigin(origin: string): boolean {
  if (!origin || ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  } catch { return false; }
}

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin && isAllowedOrigin(origin) ? origin : "https://cibero-riders.github.io",
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(origin: string, body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status, headers: corsHeaders(origin) });
}

function value(form: FormData, name: string, maxLength: number): string {
  const raw = form.get(name);
  return typeof raw === "string" ? raw.trim().slice(0, maxLength) : "";
}

function serviceKey(): string {
  const keySet = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (keySet) {
    try {
      const parsed = JSON.parse(keySet) as Record<string, string>;
      if (parsed.default) return parsed.default;
    } catch { /* fall through */ }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

function safeExtension(file: File): string {
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  if (!isAllowedOrigin(origin)) return json(origin, { error: "Origine nepermisă." }, 403);
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (request.method !== "POST") return json(origin, { error: "Metodă nepermisă." }, 405);

  try {
    const form = await request.formData();
    if (value(form, "website", 200)) return json(origin, { ok: true });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const secret = serviceKey();
    if (!supabaseUrl || !secret) return json(origin, { error: "Serviciul nu este configurat." }, 500);
    const supabase = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });

    const action = value(form, "action", 20) || "submit";
    const email = value(form, "email", 254).toLowerCase();

    if (action === "check") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(origin, { error: "Adresă de email invalidă." }, 400);
      const { count, error } = await supabase.from("tickets").select("id", { head: true, count: "exact" }).eq("email", email).in("status", ACTIVE_STATUSES);
      if (error) throw error;
      return json(origin, { active: (count ?? 0) > 0 });
    }

    const phone = value(form, "phone", 32);
    if (!/^[+0-9().\s-]{7,32}$/.test(phone)) return json(origin, { error: "Număr de telefon invalid." }, 400);
    const category = value(form, "category", 40).toLowerCase();
    const requestType = value(form, "request_type", 50).toLowerCase();
    const firstName = value(form, "first_name", 100);
    const lastName = value(form, "last_name", 100);
    if (!CATEGORIES.has(category) || !TYPE_SETS[category]?.has(requestType)) return json(origin, { error: "Categorie sau tip de solicitare invalid." }, 400);
    if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(origin, { error: "Completează datele de contact corect." }, 400);
    if (value(form, "confirmed", 10) !== "true") return json(origin, { error: "Confirmarea datelor este obligatorie." }, 400);

    const { count: activeCount, error: duplicateError } = await supabase.from("tickets").select("id", { head: true, count: "exact" }).eq("email", email).in("status", ACTIVE_STATUSES);
    if (duplicateError) throw duplicateError;
    if ((activeCount ?? 0) > 0) return json(origin, { error: "Există deja un ticket activ pentru această adresă de email." }, 409);

    const fields = {
      new_phone: value(form, "new_phone", 32) || null,
      new_email: value(form, "new_email", 254).toLowerCase() || null,
      new_iban: value(form, "new_iban", 40).replace(/\s/g, "").toUpperCase() || null,
      new_city: value(form, "new_city", 100) || null,
      new_vehicle: value(form, "new_vehicle", 100) || null,
      new_plate: value(form, "new_plate", 40).toUpperCase() || null,
      description: value(form, "description", 2000) || null,
      wolt_app_phone: value(form, "wolt_app_phone", 32) || null,
      wolt_courier_id: value(form, "wolt_courier_id", 100) || null,
      wolt_email: value(form, "wolt_email", 254).toLowerCase() || null,
      order_code: value(form, "order_code", 12) || null,
      notes: value(form, "notes", 2000) || null,
      platforms: value(form, "platforms", 100).split(",").map(item => item.trim()).filter(Boolean),
      inactive_start: value(form, "inactive_start", 10) || null,
      inactive_end: value(form, "inactive_end", 10) || null,
    };

    if (requestType === "phone" && (!fields.new_phone || fields.new_phone.replace(/\D/g, "").length < 10)) return json(origin, { error: "Numărul nou nu este valid." }, 400);
    if (requestType === "email" && (!fields.new_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.new_email))) return json(origin, { error: "Emailul nou nu este valid." }, 400);
    if (requestType === "iban" && !/^RO[A-Z0-9]{22}$/.test(fields.new_iban ?? "")) return json(origin, { error: "IBAN-ul nou nu este valid." }, 400);
    if (requestType === "city" && !fields.new_city) return json(origin, { error: "Orașul nou este obligatoriu." }, 400);
    if (requestType === "vehicle" && !fields.new_vehicle) return json(origin, { error: "Vehiculul nou este obligatoriu." }, 400);
    if (requestType === "plate_number" && !fields.new_plate) return json(origin, { error: "Numărul de înmatriculare este obligatoriu." }, 400);
    if (requestType === "other" && !fields.description) return json(origin, { error: "Descrierea solicitării este obligatorie." }, 400);
    if (requestType === "transfer_cont" && (!fields.wolt_app_phone || !fields.wolt_courier_id || !fields.wolt_email)) return json(origin, { error: "Completează toate datele contului Wolt." }, 400);
    if (requestType === "comanda_anulata" && !/^\d{12}$/.test(fields.order_code ?? "")) return json(origin, { error: "Codul comenzii trebuie să aibă 12 cifre." }, 400);
    if (requestType === "problema_decontare" && !fields.description) return json(origin, { error: "Descrierea solicitării de decontare este obligatorie." }, 400);
    if (category === "inactivitate") {
      const allowedPlatforms = new Set(["Bolt Food", "Glovo", "Wolt"]);
      if (!fields.platforms.length || fields.platforms.some(platform => !allowedPlatforms.has(platform)) || !fields.inactive_start || !fields.inactive_end) return json(origin, { error: "Completează platformele și perioada de inactivitate." }, 400);
      const start = new Date(`${fields.inactive_start}T00:00:00Z`);
      const end = new Date(`${fields.inactive_end}T00:00:00Z`);
      const inclusiveDays = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
      if (!Number.isFinite(inclusiveDays) || inclusiveDays < 7) return json(origin, { error: "Perioada de inactivitate trebuie să fie de cel puțin 7 zile." }, 400);
    }

    const supportFiles = form.getAll("files").filter(item => item instanceof File && item.size > 0) as File[];
    const receiptValue = form.get("receipt");
    const receipt = receiptValue instanceof File && receiptValue.size > 0 ? receiptValue : null;
    const pdfValue = form.get("receipts_pdf");
    const receiptsPdf = pdfValue instanceof File && pdfValue.size > 0 ? pdfValue : null;
    if (supportFiles.length > 5 || supportFiles.some(file => !SUPPORT_TYPES.has(file.type) || file.size > MAX_SUPPORT)) return json(origin, { error: "Documentele suport nu au un format sau o dimensiune acceptată." }, 400);
    if (requestType === "comanda_anulata" && (!receipt || !IMAGE_TYPES.has(receipt.type) || receipt.size > MAX_SUPPORT)) return json(origin, { error: "Poza bonului este obligatorie și trebuie să aibă maximum 10 MB." }, 400);
    const declaredAmount = Number(value(form, "declared_amount", 30).replace(",", "."));
    if (["deconturi", "trimite_bonuri_pdf"].includes(requestType) && (!receiptsPdf || receiptsPdf.type !== "application/pdf" || receiptsPdf.size > MAX_PDF || !Number.isFinite(declaredAmount) || declaredAmount <= 0)) return json(origin, { error: "Suma și PDF-ul cu bonuri sunt obligatorii." }, 400);

    const ticketId = crypto.randomUUID();
    const { error: insertError } = await supabase.from("tickets").insert({
      id: ticketId, category, request_type: requestType, first_name: firstName, last_name: lastName, phone, email,
      ...fields, declared_amount: ["deconturi", "trimite_bonuri_pdf"].includes(requestType) ? declaredAmount : null, confirmed: true,
    });
    if (insertError) throw insertError;

    const uploadedPaths: string[] = [];
    const uploads: Array<{ file: File; kind: "support" | "receipt" | "receipts_pdf" }> = [
      ...supportFiles.map(file => ({ file, kind: "support" as const })),
      ...(receipt ? [{ file: receipt, kind: "receipt" as const }] : []),
      ...(receiptsPdf ? [{ file: receiptsPdf, kind: "receipts_pdf" as const }] : []),
    ];
    try {
      for (let index = 0; index < uploads.length; index++) {
        const entry = uploads[index];
        const path = `${category}/${new Date().getUTCFullYear()}/${ticketId}/${entry.kind}-${index}.${safeExtension(entry.file)}`;
        const { error: uploadError } = await supabase.storage.from("ticket-files").upload(path, entry.file, { contentType: entry.file.type, upsert: false });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        const { error: fileError } = await supabase.from("ticket_files").insert({ ticket_id: ticketId, file_kind: entry.kind, storage_path: path, original_name: entry.file.name.slice(0, 255), mime_type: entry.file.type, file_size: entry.file.size });
        if (fileError) throw fileError;
      }
    } catch (uploadFailure) {
      if (uploadedPaths.length) await supabase.storage.from("ticket-files").remove(uploadedPaths);
      await supabase.from("tickets").delete().eq("id", ticketId);
      throw uploadFailure;
    }

    return json(origin, { ok: true, ticket_id: ticketId, reference: ticketId.slice(0, 8).toUpperCase() }, 201);
  } catch (error) {
    console.error("submit-ticket failure", error);
    return json(origin, { error: "Ticketul nu a putut fi salvat." }, 500);
  }
});
