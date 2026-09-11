import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient("https://xpzgvknnrkyvcnncfqrq.supabase.co", "sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN");
const applicationStatuses = { new: "Nouă", reviewing: "În verificare", sent_to_platform: "Trimisă platformei", activated: "Activată", rejected: "Respinsă", archived: "Arhivată" };
const ticketStatuses = { new: "Nou", reviewing: "În lucru", clarification: "Clarificare necesară", sent_to_platform: "Trimis platformei", approved: "Aprobat", rejected: "Respins", archived: "Arhivat" };
const courierTypeLabels = { new_courier: "Curier nou", experienced_courier: "Curier cu experiență" };

const view = document.querySelector("#subfleet-dashboard-view");
const title = document.querySelector("#subfleet-dashboard-title");
const tabs = [...document.querySelectorAll("[data-subfleet-tab]")];
const list = document.querySelector("#subfleet-list");
const empty = document.querySelector("#subfleet-empty");
const feedback = document.querySelector("#subfleet-feedback");
const refresh = document.querySelector("#subfleet-refresh");
const poolCount = document.querySelector("#subfleet-pool-count");
const claimedCount = document.querySelector("#subfleet-claimed-count");
const ticketCount = document.querySelector("#subfleet-ticket-count");
const workspaceEyebrow = document.querySelector("#subfleet-workspace-eyebrow");
const workspaceTitle = document.querySelector("#subfleet-workspace-title");
const workspaceCopy = document.querySelector("#subfleet-workspace-copy");
let profile = null;
let activeTab = "pool";
let pool = [];
let claimed = [];
let tickets = [];

const escapeHtml = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const formatDate = value => new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const platformLabel = values => (values ?? []).map(value => ({ bolt: "Bolt Food", glovo: "Glovo", wolt: "Wolt" }[value] ?? value)).join(" · ") || "Platformă neprecizată";

function setFeedback(message = "", success = false) { feedback.classList.toggle("success", success); feedback.textContent = message; }
function updateTabCounts() { poolCount.textContent = pool.length; claimedCount.textContent = claimed.length; ticketCount.textContent = tickets.length; }
function selectTab(tab) {
  activeTab = tab;
  tabs.forEach(button => button.classList.toggle("active", button.dataset.subfleetTab === tab));
  const copy = {
    pool: ["Pool privat", "Membri disponibili", "Datele de contact devin vizibile doar după revendicare."],
    claimed: ["Portofoliu sub-flotă", "Membrii mei", "Ai acces la datele complete doar pentru persoanele revendicate de sub-flota ta."],
    tickets: ["Suport direcționat", "Tickete direcționate", "Aici ajung automat ticketele membrilor revendicați."],
  }[tab];
  [workspaceEyebrow.textContent, workspaceTitle.textContent, workspaceCopy.textContent] = copy;
  render();
}
async function load() {
  setFeedback("Se încarcă datele…"); refresh.disabled = true;
  const [poolResult, claimedResult, ticketResult] = await Promise.all([
    supabase.rpc("get_subfleet_lead_pool"),
    supabase.from("applications").select("*").eq("subfleet_id", profile.subfleet_id).order("claimed_at", { ascending: false }),
    supabase.from("tickets").select("*").eq("subfleet_id", profile.subfleet_id).order("created_at", { ascending: false }),
  ]);
  refresh.disabled = false;
  const error = poolResult.error || claimedResult.error || ticketResult.error;
  if (error) { console.error(error); setFeedback("Datele nu au putut fi încărcate. Reîncearcă."); return; }
  pool = poolResult.data ?? []; claimed = claimedResult.data ?? []; tickets = ticketResult.data ?? [];
  updateTabCounts(); setFeedback(""); render();
}
function render() {
  const rows = activeTab === "pool" ? pool : activeTab === "claimed" ? claimed : tickets;
  empty.hidden = rows.length > 0;
  if (activeTab === "pool") list.innerHTML = rows.map(item => `<article class="subfleet-row"><div><h3>${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</h3><p><strong>${escapeHtml(item.city)}</strong> · ${escapeHtml(courierTypeLabels[item.courier_type] ?? item.courier_type)}</p><small>${escapeHtml(platformLabel(item.desired_platforms))} · ${escapeHtml(formatDate(item.created_at))}</small></div><button class="primary-button subfleet-claim" type="button" data-claim-id="${escapeHtml(item.id)}">Revendică membrul</button></article>`).join("");
  else if (activeTab === "claimed") list.innerHTML = rows.map(item => `<article class="subfleet-row"><div><h3>${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</h3><p><strong>${escapeHtml(item.email)}</strong> · ${escapeHtml(item.phone)} · ${escapeHtml(item.city)}</p><small>${escapeHtml(platformLabel(item.desired_platforms))} · revendicat ${escapeHtml(formatDate(item.claimed_at))}</small></div><select data-application-status="${escapeHtml(item.id)}">${Object.entries(applicationStatuses).map(([value, label]) => `<option value="${value}"${value === item.status ? " selected" : ""}>${label}</option>`).join("")}</select></article>`).join("");
  else list.innerHTML = rows.map(item => `<article class="subfleet-row"><div><h3>${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</h3><p><strong>${escapeHtml(item.category)}</strong> · ${escapeHtml(item.request_type)} · ${escapeHtml(item.email)}</p><small>#${escapeHtml(item.id.slice(0, 8).toUpperCase())} · ${escapeHtml(formatDate(item.created_at))}</small></div><select data-ticket-status="${escapeHtml(item.id)}">${Object.entries(ticketStatuses).map(([value, label]) => `<option value="${value}"${value === item.status ? " selected" : ""}>${label}</option>`).join("")}</select></article>`).join("");
  list.querySelectorAll("[data-claim-id]").forEach(button => button.addEventListener("click", () => claim(button.dataset.claimId, button)));
  list.querySelectorAll("[data-application-status]").forEach(select => select.addEventListener("change", () => updateStatus("applications", select.dataset.applicationStatus, select.value)));
  list.querySelectorAll("[data-ticket-status]").forEach(select => select.addEventListener("change", () => updateStatus("tickets", select.dataset.ticketStatus, select.value)));
}
async function claim(id, button) {
  button.disabled = true; setFeedback("Se revendică membrul…");
  const { error } = await supabase.rpc("claim_subfleet_lead", { p_application_id: id });
  if (error) { console.error(error); setFeedback(error.message.includes("nu mai") ? "Membrul tocmai a fost revendicat de altă sub-flotă." : "Revendicarea nu a putut fi finalizată."); button.disabled = false; return; }
  setFeedback("Membru revendicat cu succes.", true); await load();
}
async function updateStatus(table, id, status) {
  setFeedback("Se actualizează statusul…");
  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) { console.error(error); setFeedback("Statusul nu a putut fi actualizat."); return; }
  setFeedback("Status actualizat.", true); await load();
}

tabs.forEach(button => button.addEventListener("click", () => selectTab(button.dataset.subfleetTab)));
refresh.addEventListener("click", load);

export async function showSubfleetPortal(userProfile) {
  profile = userProfile; view.hidden = false;
  const { data: fleet } = await supabase.from("subfleets").select("name").eq("id", profile.subfleet_id).maybeSingle();
  title.textContent = fleet?.name ? `Portal ${fleet.name}` : "Portal sub-flotă";
  selectTab("pool"); await load();
}
export function hideSubfleetPortal() { view.hidden = true; profile = null; }
