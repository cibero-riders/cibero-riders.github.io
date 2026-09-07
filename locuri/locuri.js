import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://xpzgvknnrkyvcnncfqrq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const containers = { glovo: document.querySelector("#glovo-slots"), wolt: document.querySelector("#wolt-slots") };
const updatedLabel = document.querySelector("#availability-updated");
const names = { glovo: "Glovo", wolt: "Wolt" };

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function render(platform, rows) {
  if (!rows.length) {
    containers[platform].innerHTML = `<p class="slots-empty">Momentan nu sunt locuri disponibile la ${names[platform]}.</p>`;
    return;
  }
  containers[platform].innerHTML = rows.map(row => `<article class="slot-row"><strong class="slot-city">${escapeHtml(row.city)}</strong><span class="slot-count">${row.slots} ${row.slots === 1 ? "loc" : "locuri"}</span></article>`).join("");
}

async function loadAvailability() {
  const { data, error } = await supabase.from("available_slots").select("platform, city, slots, sort_order, updated_at").order("platform").order("sort_order").order("city");
  if (error) {
    console.error(error);
    Object.values(containers).forEach(container => { container.innerHTML = '<p class="slots-empty">Disponibilitatea nu poate fi afișată momentan.</p>'; });
    updatedLabel.textContent = "";
    return;
  }
  const rows = data ?? [];
  render("glovo", rows.filter(row => row.platform === "glovo"));
  render("wolt", rows.filter(row => row.platform === "wolt"));
  const latest = rows.map(row => row.updated_at).filter(Boolean).sort().at(-1);
  updatedLabel.textContent = latest ? `Actualizat: ${new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(latest))}` : "";
}

await loadAvailability();
supabase.channel("cibero-public-availability").on("postgres_changes", { event: "*", schema: "public", table: "available_slots" }, loadAvailability).subscribe();
