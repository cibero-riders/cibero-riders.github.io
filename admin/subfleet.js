import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient("https://xpzgvknnrkyvcnncfqrq.supabase.co", "sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN");
const applicationStatuses = { new: "Nouă", reviewing: "În verificare", sent_to_platform: "Trimisă platformei", activated: "Activată", rejected: "Respinsă", archived: "Arhivată" };
const ticketStatuses = { new: "Nou", reviewing: "În lucru", clarification: "Clarificare necesară", sent_to_platform: "Trimis platformei", approved: "Aprobat", rejected: "Respins", archived: "Arhivat" };
const courierTypeLabels = { new_courier: "Curier nou", experienced_courier: "Curier cu experiență" };
const ticketTypeLabels = { phone: "Schimbare telefon", email: "Schimbare email", iban: "Schimbare IBAN", city: "Schimbare oraș", vehicle: "Schimbare vehicul", plate_number: "Schimbare număr înmatriculare", activate_chas: "Activează CASH", deactivate_chas: "Dezactivează CASH", transfer_cont: "Transfer de Cont", other: "Altă problemă", suma_incorecta: "Raport eronat", lipsa_plata: "Plată lipsă", clarificare_decont: "Clarificare decont", alta_problema_plata: "Alte probleme cu plata", actualizare_documente: "Actualizare documente", problema_contract: "Problemă cu contractul", alta_problema_admin: "Altă problemă administrativă", comanda_anulata: "Comandă Glovo anulată", deconturi: "Deconturi", inactivitate: "Concediu/Inactivitate", problema_decontare: "Problemă cu decontarea", trimite_bonuri_pdf: "Trimitere bonuri PDF" };
const ticketViews = [
  { id: "bolt", workspace: "platforms", label: "Bolt", types: ["phone", "email", "iban", "city", "vehicle", "plate_number", "activate_chas", "deactivate_chas", "other"], matches: item => item.category === "bolt" },
  { id: "glovo", workspace: "platforms", label: "Glovo", types: ["phone", "email", "iban", "city", "vehicle", "plate_number", "activate_chas", "deactivate_chas", "comanda_anulata", "other"], matches: item => item.category === "glovo" },
  { id: "wolt", workspace: "platforms", label: "Wolt", types: ["phone", "email", "iban", "city", "vehicle", "other"], matches: item => item.category === "wolt" },
  { id: "suma_incorecta", workspace: "reports", label: "Raport eronat", matches: item => item.request_type === "suma_incorecta" },
  { id: "lipsa_plata", workspace: "reports", label: "Plată lipsă", matches: item => item.request_type === "lipsa_plata" },
  { id: "alta_problema_plata", workspace: "reports", label: "Alte probleme cu plata", matches: item => item.request_type === "alta_problema_plata" },
  { id: "transfer_cont", workspace: "administrative", label: "Transfer de cont", matches: item => item.request_type === "transfer_cont" },
  { id: "probleme_admin", workspace: "administrative", label: "Probleme administrative", types: ["actualizare_documente", "problema_contract", "alta_problema_admin"], matches: item => item.category === "probleme_admin" && item.request_type !== "transfer_cont" },
  { id: "inactivitate", workspace: "administrative", label: "Concediu / Inactivitate", matches: item => item.category === "inactivitate" || item.request_type === "inactivitate" },
  { id: "problema_decontare", workspace: "reimbursement", label: "Probleme cu decontarea", matches: item => ["deconturi", "problema_decontare", "clarificare_decont"].includes(item.request_type) || (item.category === "deconturi" && item.request_type !== "trimite_bonuri_pdf") },
  { id: "trimite_bonuri_pdf", workspace: "reimbursement", label: "Bonuri PDF", matches: item => item.request_type === "trimite_bonuri_pdf" },
];

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
const statusTabs = document.querySelector("#subfleet-status-tabs");
const ticketNavigation = document.querySelector("#subfleet-ticket-navigation");
const ticketWorkspaces = document.querySelector("#subfleet-ticket-workspaces");
const ticketCategories = document.querySelector("#subfleet-ticket-categories");
const ticketTypes = document.querySelector("#subfleet-ticket-types");
const memberDialog = document.querySelector("#subfleet-member-dialog");
const memberDetails = document.querySelector("#subfleet-member-details");
let profile = null;
let activeTab = "pool";
let activeClaimedStatus = "all";
let activeTicketWorkspace = "platforms";
let activeTicketView = "bolt";
let activeTicketRequestType = "";
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
  statusTabs.hidden = tab !== "claimed";
  ticketNavigation.hidden = tab !== "tickets";
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
function filteredClaimed() { return activeClaimedStatus === "all" ? claimed.filter(item => item.status !== "archived") : claimed.filter(item => item.status === activeClaimedStatus); }
function ticketViewById(id) { return ticketViews.find(item => item.id === id) ?? ticketViews[0]; }
function ticketMatchesActiveView(item) { const selected = ticketViewById(activeTicketView); return selected.matches(item) && (!activeTicketRequestType || item.request_type === activeTicketRequestType); }
function renderStatusTabs() {
  const statuses = [["all", "Toți"], ["new", "Noi"], ["reviewing", "În verificare"], ["sent_to_platform", "Trimis la Platformă"], ["activated", "Activi"], ["rejected", "Respinși"], ["archived", "Arhivă"]];
  statusTabs.innerHTML = statuses.map(([value, label]) => `<button class="subfleet-filter-tab${value === activeClaimedStatus ? " active" : ""}${value === "archived" ? " archive" : ""}" type="button" role="tab" aria-selected="${value === activeClaimedStatus}" data-claimed-status="${escapeHtml(value)}">${value === "archived" ? '<b aria-hidden="true">⌫</b>' : ""}${escapeHtml(label)} <span>${value === "all" ? claimed.filter(item => item.status !== "archived").length : claimed.filter(item => item.status === value).length}</span></button>`).join("");
  statusTabs.querySelectorAll("[data-claimed-status]").forEach(button => button.addEventListener("click", () => { activeClaimedStatus = button.dataset.claimedStatus; render(); }));
}
function renderTicketNavigation() {
  const workspaces = [["platforms", "Platforme"], ["reports", "Rapoarte și Plăți"], ["administrative", "Administrativ"], ["reimbursement", "5% Decontare"]];
  ticketWorkspaces.innerHTML = workspaces.map(([id, label]) => `<button class="ticket-workspace-tab${id === activeTicketWorkspace ? " active" : ""}" type="button" role="tab" data-subfleet-ticket-workspace="${id}">${label}</button>`).join("");
  ticketWorkspaces.querySelectorAll("[data-subfleet-ticket-workspace]").forEach(button => button.addEventListener("click", () => { activeTicketWorkspace = button.dataset.subfleetTicketWorkspace; activeTicketView = ticketViews.find(item => item.workspace === activeTicketWorkspace)?.id ?? "bolt"; activeTicketRequestType = ""; render(); }));
  const views = ticketViews.filter(item => item.workspace === activeTicketWorkspace);
  ticketCategories.innerHTML = views.map(item => `<button class="platform-tab${item.id === activeTicketView ? " active" : ""}" type="button" role="tab" data-subfleet-ticket-view="${item.id}">${item.label}</button>`).join("");
  ticketCategories.querySelectorAll("[data-subfleet-ticket-view]").forEach(button => button.addEventListener("click", () => { activeTicketView = button.dataset.subfleetTicketView; activeTicketRequestType = ""; render(); }));
  const selected = ticketViewById(activeTicketView);
  ticketTypes.hidden = !(selected.types?.length);
  ticketTypes.innerHTML = selected.types?.map(type => `<button class="ticket-type-tab${type === activeTicketRequestType ? " active" : ""}" type="button" data-subfleet-ticket-type="${type}">${ticketTypeLabels[type] ?? type}</button>`).join("") ?? "";
  ticketTypes.querySelectorAll("[data-subfleet-ticket-type]").forEach(button => button.addEventListener("click", () => { activeTicketRequestType = activeTicketRequestType === button.dataset.subfleetTicketType ? "" : button.dataset.subfleetTicketType; render(); }));
}
function detailField(label, value, full = false) { return `<div class="detail-field${full ? " full" : ""}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "—")}</strong></div>`; }
function openClaimedMember(id) {
  const item = claimed.find(member => member.id === id);
  if (!item) return;
  memberDetails.innerHTML = `<div class="detail-grid">${detailField("Nume complet", `${item.first_name ?? ""} ${item.last_name ?? ""}`)}${detailField("Email", item.email)}${detailField("Telefon", item.phone)}${detailField("Naționalitate", item.nationality)}${detailField("Oraș", item.city)}${detailField("Tip vehicul", item.vehicle)}${detailField("Ce vrei să faci?", item.message, true)}${detailField("Platforme selectate", platformLabel(item.desired_platforms), true)}</div>`;
  memberDialog.showModal();
  void markMemberRead(item);
}
async function markMemberRead(item) {
  if (item.opened_at) return;
  const openedAt = new Date().toISOString();
  claimed = claimed.map(member => member.id === item.id ? { ...member, opened_at: openedAt } : member);
  render();
  const { error } = await supabase.from("applications").update({ opened_at: openedAt }).eq("id", item.id);
  if (error) { console.warn("Marcajul de citire nu a putut fi salvat.", error); }
}
function render() {
  const rows = activeTab === "pool" ? pool : activeTab === "claimed" ? filteredClaimed() : tickets.filter(ticketMatchesActiveView);
  empty.hidden = rows.length > 0;
  if (activeTab === "pool") list.innerHTML = rows.map(item => `<article class="subfleet-row"><div><h3>${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</h3><p><strong>${escapeHtml(item.city)}</strong> · ${escapeHtml(item.nationality || "Naționalitate neprecizată")}</p><small>${escapeHtml(courierTypeLabels[item.courier_type] ?? item.courier_type)} · ${escapeHtml(item.vehicle || "Vehicul neprecizat")} · ${escapeHtml(platformLabel(item.desired_platforms))} · ${escapeHtml(formatDate(item.created_at))}</small></div><button class="primary-button subfleet-claim" type="button" data-claim-id="${escapeHtml(item.id)}">Revendică membrul</button></article>`).join("");
  else if (activeTab === "claimed") { renderStatusTabs(); list.innerHTML = rows.map(item => `<article class="subfleet-row claimed-member-row${item.opened_at ? "" : " unread"}"><button class="subfleet-member-open" type="button" data-member-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</strong><small>${escapeHtml(item.email)} · ${escapeHtml(item.phone)} · ${escapeHtml(item.city)}</small><small>${escapeHtml(platformLabel(item.desired_platforms))} · revendicat ${escapeHtml(formatDate(item.claimed_at))}</small></span><b aria-hidden="true">→</b></button><select data-application-status="${escapeHtml(item.id)}">${Object.entries(applicationStatuses).map(([value, label]) => `<option value="${value}"${value === item.status ? " selected" : ""}>${label}</option>`).join("")}</select></article>`).join(""); }
  else { renderTicketNavigation(); list.innerHTML = rows.map(item => `<article class="subfleet-row${item.opened_at ? "" : " unread"}"><div><h3>${escapeHtml(ticketTypeLabels[item.request_type] ?? item.request_type)}</h3><p><strong>${escapeHtml(item.category)}</strong> · ${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)} · ${escapeHtml(item.email)}</p><small>#${escapeHtml(item.id.slice(0, 8).toUpperCase())} · ${escapeHtml(formatDate(item.created_at))}</small></div><select data-ticket-status="${escapeHtml(item.id)}">${Object.entries(ticketStatuses).map(([value, label]) => `<option value="${value}"${value === item.status ? " selected" : ""}>${label}</option>`).join("")}</select></article>`).join(""); }
  empty.textContent = activeTab === "tickets" ? "Nu există tickete în categoria selectată." : activeTab === "claimed" ? "Nu există membri cu statusul selectat." : "Nu sunt membri disponibili în acest moment.";
  list.querySelectorAll("[data-claim-id]").forEach(button => button.addEventListener("click", () => claim(button.dataset.claimId, button)));
  list.querySelectorAll("[data-member-id]").forEach(button => button.addEventListener("click", () => openClaimedMember(button.dataset.memberId)));
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
  const update = { status };
  const item = (table === "applications" ? claimed : tickets).find(entry => entry.id === id);
  if (status === "new" && item?.status !== "new") update.opened_at = null;
  if (item?.status === "new" && status !== "new") update.opened_at = new Date().toISOString();
  const { error } = await supabase.from(table).update(update).eq("id", id);
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
