import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import { showAccountGuide } from "./onboarding.js?v=3";

const SUPABASE_URL = "https://xpzgvknnrkyvcnncfqrq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const statusLabels = {
  new: "Nouă",
  reviewing: "În verificare",
  sent_to_platform: "Trimisă platformei",
  activated: "Activată",
  rejected: "Respinsă",
  archived: "Arhivată",
};

const applicationPlatformLabels = { wolt: "Wolt", glovo: "Glovo", social_media: "Social Media" };

const ticketStatusLabels = {
  new: "Nou",
  reviewing: "În lucru",
  clarification: "Clarificare necesară",
  sent_to_platform: "Trimis platformei",
  approved: "Aprobat",
  rejected: "Respins",
  archived: "Arhivat",
};

const ticketCategoryLabels = {
  bolt: "Bolt Food",
  glovo: "Glovo",
  wolt: "Wolt",
  rapoarte_plati: "Rapoarte și Plăți",
  probleme_admin: "Probleme Administrative",
  deconturi: "5% Decontare",
  inactivitate: "Concediu/Inactivitate",
};

const ticketTypeLabels = {
  phone: "Schimbare telefon", email: "Schimbare email", iban: "Schimbare IBAN", city: "Schimbare oraș",
  vehicle: "Schimbare vehicul", plate_number: "Schimbare număr înmatriculare", activate_chas: "Activează CASH",
  deactivate_chas: "Dezactivează CASH", transfer_cont: "Transfer de Cont", other: "Altă problemă",
  suma_incorecta: "Raport eronat", lipsa_plata: "Plată lipsă", clarificare_decont: "Clarificare decont",
  alta_problema_plata: "Alte probleme cu plata", actualizare_documente: "Actualizare documente",
  problema_contract: "Problemă cu contractul", alta_problema_admin: "Altă problemă administrativă",
  comanda_anulata: "Comandă Glovo anulată", deconturi: "Deconturi", inactivitate: "Concediu/Inactivitate",
  problema_decontare: "Problemă cu decontarea", trimite_bonuri_pdf: "Trimitere bonuri PDF",
};

const ticketViews = [
  { id: "bolt", workspace: "platforms", label: "Bolt", types: ["phone", "email", "iban", "city", "vehicle", "plate_number", "activate_chas", "deactivate_chas", "other"], matches: item => item.category === "bolt" },
  { id: "glovo", workspace: "platforms", label: "Glovo", types: ["phone", "email", "iban", "city", "vehicle", "plate_number", "activate_chas", "deactivate_chas", "comanda_anulata", "other"], matches: item => item.category === "glovo" },
  { id: "wolt", workspace: "platforms", label: "Wolt", types: ["phone", "email", "iban", "city", "vehicle", "other"], matches: item => item.category === "wolt" },
  { id: "suma_incorecta", workspace: "reports", label: "Raport eronat", matches: item => item.request_type === "suma_incorecta" },
  { id: "lipsa_plata", workspace: "reports", label: "Plată lipsă", matches: item => item.request_type === "lipsa_plata" },
  { id: "alta_problema_plata", workspace: "reports", label: "Alte probleme cu plata", matches: item => item.request_type === "alta_problema_plata" },
  { id: "problema_decontare", workspace: "reimbursement", label: "Probleme cu decontarea", matches: item => ["deconturi", "problema_decontare", "clarificare_decont"].includes(item.request_type) || (item.category === "deconturi" && item.request_type !== "trimite_bonuri_pdf") },
  { id: "trimite_bonuri_pdf", workspace: "reimbursement", label: "Bonuri PDF", matches: item => item.request_type === "trimite_bonuri_pdf" },
  { id: "transfer_cont", workspace: "administrative", label: "Transfer de cont", matches: item => item.request_type === "transfer_cont" },
  { id: "probleme_admin", workspace: "administrative", label: "Probleme administrative", types: ["actualizare_documente", "problema_contract", "alta_problema_admin"], matches: item => item.category === "probleme_admin" && item.request_type !== "transfer_cont" },
  { id: "inactivitate", workspace: "administrative", label: "Concediu / Inactivitate", matches: item => item.category === "inactivitate" || item.request_type === "inactivitate" },
];

const sessionLoading = document.querySelector("#session-loading");
const loginView = document.querySelector("#login-view");
const dashboardView = document.querySelector("#dashboard-view");
const subfleetDashboardView = document.querySelector("#subfleet-dashboard-view");
const loginForm = document.querySelector("#login-form");
const loginButton = loginForm.querySelector("button[type='submit']");
const loginFeedback = document.querySelector("#login-feedback");
const dashboardFeedback = document.querySelector("#dashboard-feedback");
const logoutButton = document.querySelector("#logout-button");
const refreshButton = document.querySelector("#refresh-button");
const exportButton = document.querySelector("#export-button");
const applicationsList = document.querySelector("#applications-list");
const emptyState = document.querySelector("#empty-state");
const searchFilter = document.querySelector("#search-filter");
const statusFilter = document.querySelector("#status-filter");
const platformTabs = [...document.querySelectorAll("[data-platform-tab]")];
const registrationTabs = [...document.querySelectorAll("[data-registration-view]")];
const accountRequestPlatformTabs = document.querySelector("#account-request-platform-tabs");
const applicationsPrimaryCount = document.querySelector("#applications-primary-count");
const applicationDialog = document.querySelector("#application-dialog");
const applicationDetails = document.querySelector("#application-details");
const selectAllApplications = document.querySelector("#select-all-applications");
const deleteSelectedButton = document.querySelector("#delete-selected-button");
const deleteDialog = document.querySelector("#delete-dialog");
const deleteDialogTitle = document.querySelector("#delete-dialog-title");
const deleteDialogCopy = document.querySelector("#delete-dialog-copy");
const cancelDeleteButton = document.querySelector("#cancel-delete-button");
const confirmDeleteButton = document.querySelector("#confirm-delete-button");
const deleteFeedback = document.querySelector("#delete-feedback");
const adminSectionTabs = [...document.querySelectorAll("[data-admin-section]")];
const adminAreaTabs = [...document.querySelectorAll("[data-admin-area]:not([data-admin-section])")];
const refreshTicketsButton = document.querySelector("#refresh-tickets-button");
const ticketsFeedback = document.querySelector("#tickets-feedback");
const ticketsList = document.querySelector("#tickets-list");
const ticketsEmptyState = document.querySelector("#tickets-empty-state");
const ticketSearchFilter = document.querySelector("#ticket-search-filter");
const ticketStatusFilter = document.querySelector("#ticket-status-filter");
const ticketWorkspaceTabs = [...document.querySelectorAll("[data-ticket-workspace]")];
const ticketCategoryTabsContainer = document.querySelector("#ticket-category-tabs");
const ticketTypeTabsContainer = document.querySelector("#ticket-type-tabs");
const ticketsPrimaryCount = document.querySelector("#tickets-primary-count");
const exportTicketsButton = document.querySelector("#export-tickets-button");
const ticketAdminDialog = document.querySelector("#ticket-admin-dialog");
const ticketAdminDetails = document.querySelector("#ticket-admin-details");
const ticketDeleteHeader = document.querySelector("#delete-ticket-header");
const availabilityEditors = [...document.querySelectorAll("[data-availability-editor]")];
const resetAvailabilityDraftButton = document.querySelector("#reset-availability-draft");
const publishAvailabilityButton = document.querySelector("#publish-availability");
const availabilityPublishDialog = document.querySelector("#availability-publish-dialog");
const availabilityPublishDetails = document.querySelector("#availability-publish-details");
const availabilityAdminUpdate = document.querySelector("#availability-admin-update");
const addSubfleetButton = document.querySelector("#add-subfleet-button");
const createSubfleetForm = document.querySelector("#create-subfleet-form");
const subfleetCreateDialog = document.querySelector("#subfleet-create-dialog");
const createSubfleetFeedback = document.querySelector("#create-subfleet-feedback");
const subfleetsFeedback = document.querySelector("#subfleets-feedback");
const subfleetSearch = document.querySelector("#subfleet-search");
const subfleetsList = document.querySelector("#subfleets-list");
const subfleetsEmpty = document.querySelector("#subfleets-empty");
const subfleetAlerts = document.querySelector("#subfleet-alerts");
const subfleetDetailTitle = document.querySelector("#subfleet-detail-title");
const subfleetDetailCopy = document.querySelector("#subfleet-detail-copy");
const subfleetMemberSearch = document.querySelector("#subfleet-member-search");
const subfleetMemberStatus = document.querySelector("#subfleet-member-status");
const subfleetMembersList = document.querySelector("#subfleet-members-list");
const subfleetMembersEmpty = document.querySelector("#subfleet-members-empty");
const backToSubfleetsButton = document.querySelector("#back-to-subfleets");
const openSubfleetMessagesButton = document.querySelector("#open-subfleet-messages");
const adminDuplicateAlertBell = document.querySelector("#admin-duplicate-alert-bell");
const adminDuplicateAlertBadge = document.querySelector("#admin-duplicate-alert-badge");
const duplicateAlertsDialog = document.querySelector("#duplicate-alerts-dialog");
const duplicateAlertsList = document.querySelector("#duplicate-alerts-list");
const adminMessageBell = document.querySelector("#admin-message-bell");
const adminMessageBadge = document.querySelector("#admin-message-badge");
const adminMessagesDialog = document.querySelector("#admin-messages-dialog");
const adminMessageConversations = document.querySelector("#admin-message-conversations");
const adminMessageThreadTitle = document.querySelector("#admin-message-thread-title");
const adminMessageThread = document.querySelector("#admin-message-thread");
const adminMessageForm = document.querySelector("#admin-message-form");
const adminMessageInput = document.querySelector("#admin-message-input");
const adminMessageSend = document.querySelector("#admin-message-send");
const adminMessageFeedback = document.querySelector("#admin-message-feedback");

let applications = [];
let activePlatform = "all";
let activeRegistrationView = "all";
const selectedApplicationIds = new Set();
let tickets = [];
let duplicateAlertTickets = [];
let activeTicketWorkspace = "platforms";
let activeTicketView = "bolt";
let activeTicketRequestType = "";
let pendingTicketDeletion = null;
let availability = [];
let availabilityDraft = { glovo: [], wolt: [] };
let currentAdminUserId = "";
let availabilityDraftDirty = false;
let availabilityRealtimeChannel = null;
let adminRealtimeChannel = null;
let subfleetPortal = null;
let subfleets = [];
let subfleetAccounts = [];
let subfleetAlertsData = [];
let duplicateAlerts = [];
let subfleetMessages = [];
let activeMessageSubfleetId = "";
let activeAdminArea = "cibero";
let activeSubfleetId = "";
const openedTicketStorageKey = "cibero-opened-ticket-ids";
const openedApplicationStorageKey = "cibero-opened-application-ids";

function storedIdSet(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? "[]");
    return new Set(Array.isArray(stored) ? stored : []);
  } catch {
    return new Set();
  }
}

const locallyOpenedTicketIds = storedIdSet(openedTicketStorageKey);
const locallyOpenedApplicationIds = storedIdSet(openedApplicationStorageKey);

const availabilityCities = [
  "Alba Iulia", "Arad", "Bacău", "Baia Mare", "Botoșani", "Brăila", "Brașov", "București", "Buzău", "Cluj-Napoca", "Constanța", "Craiova", "Deva", "Drobeta-Turnu Severin", "Focșani", "Galați", "Hunedoara", "Iași", "Mediaș", "Miercurea-Ciuc", "Onești", "Oradea", "Piatra Neamț", "Pitești", "Ploiești", "Râmnicu Vâlcea", "Reșița", "Roman", "Satu Mare", "Sfântu Gheorghe", "Sibiu", "Sighișoara", "Slatina", "Suceava", "Târgoviște", "Târgu Mureș", "Tecuci", "Timișoara", "Tulcea", "Vaslui", "Zalău"
];
const availabilityCityCollator = new Intl.Collator("ro-RO", { sensitivity: "base" });

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function cloneAvailabilityRows(rows) {
  return rows.map(({ city, slots, sort_order }) => ({ city, slots: Number(slots), sort_order: Number(sort_order ?? 0) }));
}

function sortAvailabilityRows(rows) {
  rows.sort((first, second) => availabilityCityCollator.compare(first.city, second.city));
  rows.forEach((row, index) => { row.sort_order = index; });
  return rows;
}

function sortAvailabilityDraft() {
  sortAvailabilityRows(availabilityDraft.glovo);
  sortAvailabilityRows(availabilityDraft.wolt);
}

function adminPreferenceKey(name) {
  return currentAdminUserId ? `cibero-admin-${name}:${currentAdminUserId}` : "";
}

function readAdminPreference(name) {
  const key = adminPreferenceKey(name);
  if (!key) return null;
  try { return JSON.parse(localStorage.getItem(key) ?? "null"); } catch { return null; }
}

function writeAdminPreference(name, value) {
  const key = adminPreferenceKey(name);
  if (key) localStorage.setItem(key, JSON.stringify(value));
}

function clearAdminPreference(name) {
  const key = adminPreferenceKey(name);
  if (key) localStorage.removeItem(key);
}

function normalizeCity(value) {
  return String(value ?? "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("ro-RO");
}

function availabilityPlatformLabel(platform) {
  return platform === "wolt" ? "Wolt" : "Glovo";
}

function availabilityCountLabel(count) {
  return `${count} ${count === 1 ? "oraș" : "orașe"}`;
}

function canonicalAvailabilityCity(value) {
  const normalized = normalizeCity(value);
  return availabilityCities.find(city => normalizeCity(city) === normalized) ?? "";
}

function matchingAvailabilityCities(value) {
  const normalized = normalizeCity(value);
  if (!normalized) return [];
  return availabilityCities.filter(city => normalizeCity(city).includes(normalized));
}

function sanitizeAvailabilityDraft(value) {
  if (!value || typeof value !== "object") return null;
  const sanitizeRows = rows => {
    if (!Array.isArray(rows)) return [];
    const cities = new Set();
    return rows.flatMap(row => {
      const city = canonicalAvailabilityCity(row?.city);
      const slots = Number(row?.slots);
      if (!city || cities.has(city) || !Number.isInteger(slots) || slots < 1 || slots > 999) return [];
      cities.add(city);
      return [{ city, slots, sort_order: cities.size - 1 }];
    });
  };
  return {
    glovo: sanitizeRows(value.glovo),
    wolt: sanitizeRows(value.wolt),
    activePlatform: value.activePlatform === "wolt" ? "wolt" : "glovo",
    // Drafts saved before this flag existed may contain deliberate work, so
    // preserve them rather than silently replacing them with live data.
    dirty: value.dirty !== false,
  };
}

function saveAvailabilityDraft() {
  writeAdminPreference("availability-draft", {
    glovo: availabilityDraft.glovo,
    wolt: availabilityDraft.wolt,
    dirty: availabilityDraftDirty,
  });
}

function restoreAvailabilityDraft() {
  return sanitizeAvailabilityDraft(readAdminPreference("availability-draft"));
}

function setActiveAdminSection(sectionId, persist = true) {
  const subfleetSections = ["subfleets-panel", "subfleet-detail-panel"];
  const requested = adminSectionTabs.some(tab => tab.dataset.adminSection === sectionId) || subfleetSections.includes(sectionId)
    ? sectionId
    : "applications-panel";
  const selectedTab = adminSectionTabs.find(tab => tab.dataset.adminSection === requested);
  activeAdminArea = subfleetSections.includes(requested) ? "subfleets" : (selectedTab?.dataset.adminArea ?? "cibero");
  adminAreaTabs.forEach(tab => {
    const active = tab.dataset.adminArea === activeAdminArea;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#admin-area-cibero").hidden = activeAdminArea !== "cibero";
  adminSectionTabs.forEach(tab => {
    const active = tab.dataset.adminSection === requested;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    document.querySelector(`#${tab.dataset.adminSection}`).hidden = !active;
  });
  ["subfleets-panel", "subfleet-detail-panel"].forEach(id => {
    document.querySelector(`#${id}`).hidden = id !== requested;
  });
  if (persist) writeAdminPreference("active-section", requested);
}

function setActiveAdminArea(area) {
  const nextArea = area === "subfleets" ? "subfleets" : "cibero";
  setActiveAdminSection(nextArea === "subfleets" ? "subfleets-panel" : "applications-panel");
  if (nextArea === "subfleets") { void loadSubfleets(); void loadSubfleetAlerts(); }
}

function updatePrimaryUnreadBadge(sectionId, badge, unreadCount) {
  const tab = adminSectionTabs.find(item => item.dataset.adminSection === sectionId);
  if (!tab || !badge) return;
  badge.textContent = unreadCount;
  badge.hidden = unreadCount === 0;
  tab.classList.toggle("has-unread", unreadCount > 0);
}

function updateTabUnreadBadge(tab, unreadCount) {
  const badge = tab.querySelector(".unread-badge");
  if (!badge) return;
  badge.textContent = unreadCount;
  badge.hidden = unreadCount === 0;
  tab.classList.toggle("has-unread", unreadCount > 0);
}

function ticketViewById(viewId) {
  return ticketViews.find(view => view.id === viewId) ?? ticketViews[0];
}

// A ticket with a subfleet owner is handled exclusively from that subfleet's
// portal. Admins retain audit access in Supabase (and for duplicate alerts),
// but it must never enter CibeRO's operational ticket queue or its counters.
function isCiberoManagedTicket(item) {
  return !item.subfleet_id;
}

function ciberoTickets() {
  return tickets.filter(isCiberoManagedTicket);
}

function ticketForDuplicateAlert(ticketId) {
  return tickets.find(item => item.id === ticketId) ?? duplicateAlertTickets.find(item => item.id === ticketId);
}

function ticketMatchesActiveView(item) {
  const view = ticketViewById(activeTicketView);
  return view.matches(item) && (!activeTicketRequestType || item.request_type === activeTicketRequestType);
}

function ticketDisplayCategory(item) {
  return ticketViews.find(view => view.matches(item))?.label ?? ticketCategoryLabels[item.category] ?? item.category;
}

function persistTicketNavigation() {
  writeAdminPreference("ticket-navigation", { workspace: activeTicketWorkspace, view: activeTicketView, requestType: activeTicketRequestType });
}

function restoreTicketNavigation() {
  const saved = readAdminPreference("ticket-navigation");
  const savedView = ticketViews.find(view => view.id === saved?.view);
  const savedWorkspace = ticketViews.some(view => view.workspace === saved?.workspace) ? saved.workspace : "platforms";
  activeTicketWorkspace = savedView?.workspace ?? savedWorkspace;
  activeTicketView = savedView?.workspace === activeTicketWorkspace ? savedView.id : ticketViews.find(view => view.workspace === activeTicketWorkspace).id;
  activeTicketRequestType = savedView?.types?.includes(saved?.requestType) ? saved.requestType : "";
  renderTicketNavigation();
}

function setActiveTicketWorkspace(workspace, persist = true) {
  activeTicketWorkspace = ticketViews.some(view => view.workspace === workspace) ? workspace : "platforms";
  if (ticketViewById(activeTicketView).workspace !== activeTicketWorkspace) {
    activeTicketView = ticketViews.find(view => view.workspace === activeTicketWorkspace).id;
  }
  activeTicketRequestType = "";
  if (persist) persistTicketNavigation();
  renderTicketNavigation();
  updateTicketSummary();
  renderTickets();
}

function setActiveTicketView(viewId, persist = true) {
  const view = ticketViews.find(item => item.id === viewId);
  if (!view) return;
  activeTicketWorkspace = view.workspace;
  activeTicketView = view.id;
  activeTicketRequestType = "";
  if (persist) persistTicketNavigation();
  renderTicketNavigation();
  updateTicketSummary();
  renderTickets();
}

function renderTicketNavigation() {
  const centralTickets = ciberoTickets();
  ticketWorkspaceTabs.forEach(tab => {
    const workspace = tab.dataset.ticketWorkspace;
    const active = workspace === activeTicketWorkspace;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    updateTabUnreadBadge(tab, centralTickets.filter(item => ticketViews.some(view => view.workspace === workspace && view.matches(item)) && item.status === "new").length);
  });
  const workspaceViews = ticketViews.filter(view => view.workspace === activeTicketWorkspace);
  ticketCategoryTabsContainer.innerHTML = workspaceViews.map(view => {
    const newCount = centralTickets.filter(item => view.matches(item) && item.status === "new").length;
    const active = view.id === activeTicketView;
    return `<button class="platform-tab${active ? " active" : ""}${newCount ? " has-unread" : ""}" type="button" role="tab" aria-selected="${active}" data-ticket-view="${escapeHtml(view.id)}">${escapeHtml(view.label)} <span class="unread-badge"${newCount ? "" : " hidden"}>${newCount}</span></button>`;
  }).join("");
  ticketCategoryTabsContainer.querySelectorAll("[data-ticket-view]").forEach(tab => {
    tab.addEventListener("click", () => setActiveTicketView(tab.dataset.ticketView));
  });
  renderTicketTypeNavigation();
}

function renderTicketTypeNavigation() {
  const view = ticketViewById(activeTicketView);
  const types = view.types ?? [];
  ticketTypeTabsContainer.hidden = types.length === 0;
  if (!types.length) {
    ticketTypeTabsContainer.innerHTML = "";
    return;
  }
  const filters = [{ id: "", label: "Toate solicitările" }, ...types.map(id => ({ id, label: ticketTypeLabels[id] ?? id }))];
  ticketTypeTabsContainer.innerHTML = filters.map(filter => {
    const active = filter.id === activeTicketRequestType;
    const newCount = ciberoTickets().filter(item => view.matches(item) && (!filter.id || item.request_type === filter.id) && item.status === "new").length;
    return `<button class="ticket-type-tab${active ? " active" : ""}${newCount ? " has-unread" : ""}" type="button" role="tab" aria-selected="${active}" data-ticket-request-type="${escapeHtml(filter.id)}">${escapeHtml(filter.label)} <span${newCount ? "" : " hidden"}>${newCount}</span></button>`;
  }).join("");
  ticketTypeTabsContainer.querySelectorAll("[data-ticket-request-type]").forEach(tab => {
    tab.addEventListener("click", () => setActiveTicketRequestType(tab.dataset.ticketRequestType));
  });
}

function setActiveTicketRequestType(requestType) {
  const types = ticketViewById(activeTicketView).types ?? [];
  activeTicketRequestType = types.includes(requestType) ? requestType : "";
  persistTicketNavigation();
  renderTicketNavigation();
  updateTicketSummary();
  renderTickets();
}

function availabilityEditor(platform) {
  return document.querySelector(`[data-availability-editor="${platform}"]`);
}

function availabilityEditorField(platform, name) {
  return document.querySelector(`[data-availability-${name}="${platform}"]`);
}

function setAvailabilityFeedback(platform, message = "", success = false) {
  const feedback = availabilityEditorField(platform, "feedback");
  feedback.classList.toggle("success", success);
  feedback.textContent = message;
}

function updateAvailabilitySlotsLabel(platform) {
  const cityInput = availabilityEditorField(platform, "city");
  const slotsLabel = availabilityEditorField(platform, "slots-label");
  const city = cityInput.value.trim();
  slotsLabel.textContent = city ? `Locuri disponibile în „${city}”` : "Locuri disponibile";
}

function focusAvailabilitySlotsAfterCitySelection(platform) {
  const cityInput = availabilityEditorField(platform, "city");
  const slotsInput = availabilityEditorField(platform, "slots");
  const city = canonicalAvailabilityCity(cityInput.value);
  updateAvailabilitySlotsLabel(platform);
  if (!city) return;
  cityInput.value = city;
  updateAvailabilitySlotsLabel(platform);
  slotsInput.focus();
  slotsInput.select();
  slotsInput.classList.add("availability-slots-ready");
  window.setTimeout(() => slotsInput.classList.remove("availability-slots-ready"), 850);
}

function renderAvailabilityCitySuggestions(platform) {
  const cityInput = availabilityEditorField(platform, "city");
  const suggestions = availabilityEditorField(platform, "city-suggestions");
  const query = cityInput.value.trim();
  const matches = matchingAvailabilityCities(query);
  suggestions.hidden = !query || !matches.length;
  cityInput.setAttribute("aria-expanded", String(!suggestions.hidden));
  suggestions.innerHTML = matches.map(city => `<button type="button" role="option" data-availability-city-option="${escapeHtml(city)}">${escapeHtml(city)}</button>`).join("");
  suggestions.querySelectorAll("[data-availability-city-option]").forEach(button => button.addEventListener("click", () => {
    cityInput.value = button.dataset.availabilityCityOption;
    suggestions.hidden = true;
    cityInput.setAttribute("aria-expanded", "false");
    focusAvailabilitySlotsAfterCitySelection(platform);
  }));
}

function availabilityRowsMarkup(rows, compact = false) {
  if (!rows.length) return `<p class="availability-empty">Nu ai adăugat încă niciun oraș.</p>`;
  return rows.map(row => `<div class="availability-preview-row${compact ? " compact" : ""}"><strong>${escapeHtml(row.city)}</strong><span>${row.slots} ${row.slots === 1 ? "loc" : "locuri"}</span></div>`).join("");
}

function publishedAvailabilityRow(platform, city) {
  return availability.find(row => row.platform === platform && row.city === city) ?? null;
}

function liveAvailabilityMarkup(platform, city, fallbackSlots) {
  const published = publishedAvailabilityRow(platform, city);
  const slots = Number(published?.slots ?? fallbackSlots);
  const applications = Number(published?.application_count ?? 0);
  return `<small class="availability-live-count${applications ? " has-applications" : ""}"><b>${slots} ${slots === 1 ? "loc disponibil" : "locuri disponibile"}</b><span>(${applications} ${applications === 1 ? "aplicare" : "aplicări"})</span></small>`;
}

function renderAvailabilityAdminUpdate() {
  const latest = availability.map(row => row.admin_updated_at).filter(Boolean).sort().at(-1);
  availabilityAdminUpdate.textContent = latest
    ? `Ultima actualizare de către un admin: ${formatDate(latest)}`
    : "Ultima actualizare de către un admin: —";
}

function renderAvailability() {
  sortAvailabilityDraft();
  ["glovo", "wolt"].forEach(platform => {
    const rows = availabilityDraft[platform];
    const list = availabilityEditorField(platform, "draft-list");
    availabilityEditorField(platform, "draft-count").textContent = availabilityCountLabel(rows.length);
    list.innerHTML = rows.length
      ? rows.map((row, index) => `<article class="availability-draft-row"><span class="availability-draft-city"><strong>${escapeHtml(row.city)}</strong>${liveAvailabilityMarkup(platform, row.city, row.slots)}</span><label>Locuri<input type="number" min="1" max="999" inputmode="numeric" value="${row.slots}" data-availability-slots="${index}" aria-label="Locuri disponibile în ${escapeHtml(row.city)}" /></label><button class="availability-remove" type="button" data-availability-remove="${index}" aria-label="Elimină ${escapeHtml(row.city)}">×</button></article>`).join("")
      : `<p class="availability-empty">Caută un oraș, introdu numărul de locuri și adaugă-l în listă.</p>`;

    list.querySelectorAll("[data-availability-slots]").forEach(input => input.addEventListener("input", () => {
      const index = Number(input.dataset.availabilitySlots);
      const slots = Math.min(999, Math.max(1, Number(input.value) || 1));
      availabilityDraft[platform][index].slots = slots;
      availabilityDraftDirty = true;
      saveAvailabilityDraft();
      renderAvailability();
    }));
    list.querySelectorAll("[data-availability-remove]").forEach(button => button.addEventListener("click", () => {
      availabilityDraft[platform].splice(Number(button.dataset.availabilityRemove), 1);
      availabilityDraftDirty = true;
      saveAvailabilityDraft();
      renderAvailability();
    }));
  });
  renderAvailabilityAdminUpdate();
}

async function loadAvailability({ restoreDraft = true } = {}) {
  ["glovo", "wolt"].forEach(platform => setAvailabilityFeedback(platform, "Se încarcă disponibilitățile publicate…"));
  const { data, error } = await supabase
    .from("available_slots")
    .select("id, platform, city, slots, initial_slots, application_count, sort_order, admin_updated_at")
    .order("platform")
    .order("sort_order")
    .order("city");
  if (error) {
    console.error(error);
    const savedDraft = restoreAvailabilityDraft();
    if (savedDraft) {
      availabilityDraft = { glovo: savedDraft.glovo, wolt: savedDraft.wolt };
      availabilityDraftDirty = savedDraft.dirty;
      ["glovo", "wolt"].forEach(platform => setAvailabilityFeedback(platform, "Draftul local a fost restaurat. Disponibilitățile publicate nu au putut fi actualizate acum.", true));
      renderAvailability();
    } else {
      ["glovo", "wolt"].forEach(platform => setAvailabilityFeedback(platform, "Disponibilitățile nu pot fi încărcate. Verifică migrarea Supabase pentru această secțiune."));
    }
    return;
  }
  availability = data ?? [];
  const publishedDraft = {
    glovo: cloneAvailabilityRows(availability.filter(row => row.platform === "glovo")),
    wolt: cloneAvailabilityRows(availability.filter(row => row.platform === "wolt")),
  };
  const savedDraft = restoreDraft ? restoreAvailabilityDraft() : null;
  if (savedDraft?.dirty) {
    availabilityDraft = { glovo: savedDraft.glovo, wolt: savedDraft.wolt };
    availabilityDraftDirty = true;
    ["glovo", "wolt"].forEach(platform => setAvailabilityFeedback(platform, "Draftul nepublicat a fost restaurat.", true));
  } else {
    availabilityDraft = publishedDraft;
    availabilityDraftDirty = false;
    ["glovo", "wolt"].forEach(platform => setAvailabilityFeedback(platform));
  }
  sortAvailabilityDraft();
  renderAvailability();
}

function addAvailabilityCity(platform) {
  const cityInput = availabilityEditorField(platform, "city");
  const slotsInput = availabilityEditorField(platform, "slots");
  const rawCity = cityInput.value.trim();
  const city = canonicalAvailabilityCity(rawCity);
  const slots = Number(slotsInput.value);
  setAvailabilityFeedback(platform);
  if (!city) {
    setAvailabilityFeedback(platform, "Alege un oraș din lista disponibilă.");
    cityInput.focus();
    return;
  }
  if (!Number.isInteger(slots) || slots < 1 || slots > 999) {
    setAvailabilityFeedback(platform, "Introdu un număr între 1 și 999 pentru locurile disponibile.");
    slotsInput.focus();
    return;
  }
  const existing = availabilityDraft[platform].find(row => row.city === city);
  if (existing) existing.slots = slots;
  else availabilityDraft[platform].push({ city, slots, sort_order: availabilityDraft[platform].length });
  sortAvailabilityDraft();
  availabilityDraftDirty = true;
  saveAvailabilityDraft();
  cityInput.value = "";
  slotsInput.value = "";
  updateAvailabilitySlotsLabel(platform);
  setAvailabilityFeedback(platform, existing ? `${city} a fost actualizat în listă.` : `${city} a fost adăugat în listă.`, true);
  renderAvailability();
  cityInput.focus();
}

function resetAvailabilityDraft() {
  availabilityDraft = {
    glovo: cloneAvailabilityRows(availability.filter(row => row.platform === "glovo")),
    wolt: cloneAvailabilityRows(availability.filter(row => row.platform === "wolt")),
  };
  sortAvailabilityDraft();
  ["glovo", "wolt"].forEach(platform => {
    availabilityEditorField(platform, "city").value = "";
    availabilityEditorField(platform, "slots").value = "";
    updateAvailabilitySlotsLabel(platform);
    setAvailabilityFeedback(platform, "Modificările nepublicate au fost anulate.");
  });
  availabilityDraftDirty = false;
  clearAdminPreference("availability-draft");
  renderAvailability();
}

function openAvailabilityPublishDialog() {
  const total = availabilityDraft.glovo.length + availabilityDraft.wolt.length;
  availabilityPublishDetails.innerHTML = `<div class="availability-confirmation"><p>Urmează să publici <strong>${availabilityCountLabel(total)}</strong> pe pagina publică. Orice listă publicată anterior va fi înlocuită.</p><p class="availability-confirmation-note">Publicarea începe un nou ciclu de evidență: pentru lista nouă, contorul de aplicări pornește de la 0.</p><div class="availability-preview-columns confirmation">${["glovo", "wolt"].map(platform => `<section class="availability-preview-platform ${platform}"><h4>${availabilityPlatformLabel(platform)}</h4>${availabilityRowsMarkup(availabilityDraft[platform], true)}</section>`).join("")}</div><div class="availability-actions dialog-actions"><button class="quiet-button" type="button" data-close-availability-dialog>Înapoi la editare</button><button id="confirm-publish-availability" class="primary-button" type="button">Publică acum</button></div><p id="availability-publish-feedback" class="feedback" role="status" aria-live="polite"></p></div>`;
  availabilityPublishDetails.querySelector("[data-close-availability-dialog]").addEventListener("click", () => availabilityPublishDialog.close());
  availabilityPublishDetails.querySelector("#confirm-publish-availability").addEventListener("click", publishAvailability);
  availabilityPublishDialog.showModal();
}

async function publishAvailability() {
  const confirmButton = availabilityPublishDetails.querySelector("#confirm-publish-availability");
  const feedback = availabilityPublishDetails.querySelector("#availability-publish-feedback");
  sortAvailabilityDraft();
  const rows = ["glovo", "wolt"].flatMap(platform => availabilityDraft[platform].map((row, index) => ({ platform, city: row.city, slots: row.slots, sort_order: index })));
  confirmButton.disabled = true;
  feedback.textContent = "Se publică disponibilitățile…";

  const { data: sessionData } = await supabase.auth.getSession();
  const publishedBy = sessionData.session?.user?.id ?? null;
  if (rows.length) {
    const adminUpdatedAt = new Date().toISOString();
    const { error: upsertError } = await supabase.from("available_slots").upsert(rows.map(row => ({ ...row, initial_slots: row.slots, application_count: 0, published_by: publishedBy, admin_updated_by: publishedBy, admin_updated_at: adminUpdatedAt })), { onConflict: "platform,city" });
    if (upsertError) {
      console.error(upsertError);
      confirmButton.disabled = false;
      feedback.textContent = "Publicarea nu a reușit. Încearcă din nou.";
      return;
    }
  }

  const draftKeys = new Set(rows.map(row => `${row.platform}::${row.city}`));
  const staleIds = availability.filter(row => !draftKeys.has(`${row.platform}::${row.city}`)).map(row => row.id).filter(Boolean);
  if (staleIds.length) {
    const { error: deleteError } = await supabase.from("available_slots").delete().in("id", staleIds);
    if (deleteError) {
      console.error(deleteError);
      confirmButton.disabled = false;
      feedback.textContent = "Orașele noi au fost publicate, dar lista veche nu a putut fi curățată. Reîncearcă publicarea.";
      return;
    }
  }
  clearAdminPreference("availability-draft");
  availabilityDraftDirty = false;
  await loadAvailability({ restoreDraft: false });
  availabilityPublishDialog.close();
  ["glovo", "wolt"].forEach(platform => setAvailabilityFeedback(platform, "Disponibilitățile au fost publicate pe pagina publică.", true));
}

function subscribeToAvailabilityUpdates() {
  if (availabilityRealtimeChannel) supabase.removeChannel(availabilityRealtimeChannel);
  availabilityRealtimeChannel = supabase
    .channel(`cibero-admin-availability-${currentAdminUserId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "available_slots" }, async () => {
      await loadAvailability({ restoreDraft: availabilityDraftDirty });
      if (!availabilityDraftDirty) {
        ["glovo", "wolt"].forEach(platform => setAvailabilityFeedback(platform, "Locurile publicate au fost actualizate live după o cerere nouă.", true));
      }
    })
    .subscribe();
}

function subscribeToAdminNotifications() {
  if (adminRealtimeChannel) supabase.removeChannel(adminRealtimeChannel);
  adminRealtimeChannel = supabase
    .channel(`cibero-admin-notifications-${currentAdminUserId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => { void loadApplications(); })
    .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, () => { void Promise.all([loadTickets(), loadDuplicateAlerts()]); })
    .on("postgres_changes", { event: "*", schema: "public", table: "admin_alerts" }, () => { void Promise.all([loadSubfleetAlerts(), loadDuplicateAlerts()]); })
    .on("postgres_changes", { event: "*", schema: "public", table: "subfleet_messages" }, () => { void loadAdminMessages(); })
    .subscribe();
}

function isTicketRead(item) {
  return Boolean(item.opened_at) || locallyOpenedTicketIds.has(item.id);
}

function isApplicationRead(item) {
  return Boolean(item.opened_at) || locallyOpenedApplicationIds.has(item.id);
}

function rememberOpened(id, ids, storageKey) {
  ids.add(id);
  localStorage.setItem(storageKey, JSON.stringify([...ids]));
}

function forgetOpened(id, ids, storageKey) {
  ids.delete(id);
  localStorage.setItem(storageKey, JSON.stringify([...ids]));
}

function readStateUpdateForStatus(previousStatus, nextStatus) {
  if (nextStatus === "new" && previousStatus !== "new") return { opened_at: null };
  if (previousStatus === "new" && nextStatus !== "new") return { opened_at: new Date().toISOString() };
  return {};
}

function syncApplicationReadState(item) {
  if (item.opened_at) rememberOpened(item.id, locallyOpenedApplicationIds, openedApplicationStorageKey);
  else forgetOpened(item.id, locallyOpenedApplicationIds, openedApplicationStorageKey);
}

function syncTicketReadState(item) {
  if (item.opened_at) rememberOpened(item.id, locallyOpenedTicketIds, openedTicketStorageKey);
  else forgetOpened(item.id, locallyOpenedTicketIds, openedTicketStorageKey);
}

function showLogin(message = "") {
  sessionLoading.hidden = true;
  loginView.hidden = false;
  dashboardView.hidden = true;
  subfleetDashboardView.hidden = true;
  subfleetPortal?.hideSubfleetPortal();
  logoutButton.hidden = true;
  adminDuplicateAlertBell.hidden = true;
  adminMessageBell.hidden = true;
  loginButton.disabled = false;
  loginFeedback.textContent = message;
}

function showDashboard() {
  sessionLoading.hidden = true;
  loginView.hidden = true;
  dashboardView.hidden = false;
  subfleetDashboardView.hidden = true;
  logoutButton.hidden = false;
  adminDuplicateAlertBell.hidden = false;
  adminMessageBell.hidden = false;
  loginForm.reset();
  loginFeedback.textContent = "";
  restoreTicketNavigation();
  const rememberedSection = readAdminPreference("active-section");
  setActiveAdminSection(rememberedSection === "subfleet-detail-panel" ? "subfleets-panel" : (rememberedSection ?? "applications-panel"), false);
}

async function accessProfile(userId) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, display_name, role, subfleet_id, is_active, onboarding_login_count")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function recordOnboardingLogin() {
  const { data, error } = await supabase.rpc("record_admin_onboarding_login");
  if (error) throw error;
  return Number(data ?? 1);
}

async function openAccessProfile(user, requestedRole = "") {
  const profile = await accessProfile(user.id);
  if (!profile?.is_active || !["admin", "subfleet"].includes(profile.role)) {
    await supabase.auth.signOut();
    showLogin("Acest cont nu are acces activ.");
    return false;
  }
  if (requestedRole && profile.role !== requestedRole) {
    await supabase.auth.signOut();
    showLogin(requestedRole === "admin" ? "Acest cont este de sub-flotă. Selectează „Sub-flotă” pentru autentificare." : "Acest cont este de administrator. Selectează „Admin” pentru autentificare.");
    return false;
  }
  profile.onboarding_login_count = await recordOnboardingLogin();
  if (profile.role === "subfleet") {
    subfleetPortal ??= await import("./subfleet.js?v=9");
    sessionLoading.hidden = true;
    loginView.hidden = true;
    dashboardView.hidden = true;
    logoutButton.hidden = false;
    loginForm.reset();
    await subfleetPortal.showSubfleetPortal(profile);
    showAccountGuide(profile);
    return true;
  }
  currentAdminUserId = user.id;
  showDashboard();
  await Promise.all([loadApplications(), loadTickets(), loadAvailability(), loadSubfleets()]);
  await reconcileStaleSubfleetClaims();
  await Promise.all([loadApplications(), loadSubfleets(), loadSubfleetAlerts(), loadDuplicateAlerts(), loadAdminMessages()]);
  subscribeToAvailabilityUpdates();
  subscribeToAdminNotifications();
  showAccountGuide(profile);
  return true;
}

function setSubfleetsFeedback(message = "", success = false) {
  subfleetsFeedback.classList.toggle("success", success);
  subfleetsFeedback.textContent = message;
}

function renderSubfleetAlerts() {
  const fleetNames = new Map(subfleets.map(item => [item.id, item.name]));
  subfleetAlerts.hidden = subfleetAlertsData.length === 0;
  subfleetAlerts.innerHTML = subfleetAlertsData.map(item => `<article><span aria-hidden="true">!</span><div><strong>Cerere neprocesată în 24h</strong><p>${escapeHtml(item.message)}</p><small>${escapeHtml(fleetNames.get(item.subfleet_id) ?? "Sub-flotă")} · ${escapeHtml(formatDate(item.created_at))}</small></div></article>`).join("");
}

async function reconcileStaleSubfleetClaims() {
  const { error } = await supabase.rpc("release_stale_subfleet_claims");
  if (error) console.warn("Verificarea cererilor neprocesate nu este disponibilă încă.", error);
}

async function loadSubfleetAlerts() {
  const { data, error } = await supabase.from("admin_alerts").select("id, alert_type, subfleet_id, message, created_at").is("read_at", null).eq("alert_type", "subfleet_claim_timeout").order("created_at", { ascending: false }).limit(20);
  if (error) { console.warn("Alertele sub-flotelor nu sunt disponibile încă.", error); return; }
  subfleetAlertsData = data ?? [];
  renderSubfleetAlerts();
}

function duplicateMatchLabel(fields) {
  return (fields ?? []).map(field => ({ email: "email", telefon: "telefon", "nume complet": "nume complet" }[field] ?? field)).join(", ") || "date de contact";
}

function updateDuplicateAlertBadge() {
  const unreadCount = duplicateAlerts.filter(item => !item.read_at).length;
  adminDuplicateAlertBadge.textContent = unreadCount;
  adminDuplicateAlertBadge.hidden = unreadCount === 0;
}

function renderDuplicateAlerts() {
  duplicateAlertsList.innerHTML = duplicateAlerts.map(alert => {
    const application = applications.find(item => item.id === alert.application_id);
    const ticket = ticketForDuplicateAlert(alert.ticket_id);
    const applicationName = application ? `${application.first_name} ${application.last_name}` : "Înregistrare indisponibilă";
    const ticketName = ticket ? `${ticket.first_name} ${ticket.last_name}` : "Ticket indisponibil";
    const ticketReference = ticket ? `#${ticket.id.slice(0, 8).toUpperCase()}` : "Ticket nou";
    return `<article class="duplicate-alert-card${alert.read_at ? " read" : ""}"><h3>Posibilă dublură detectată</h3><p class="duplicate-match-fields">Potrivire: ${escapeHtml(duplicateMatchLabel(alert.match_fields))}</p><div class="duplicate-records"><button class="duplicate-record" type="button" data-open-duplicate-application="${escapeHtml(alert.id)}"><small>Înregistrare existentă</small><strong>${escapeHtml(applicationName)}</strong><span>${escapeHtml(application?.email ?? "—")} · ${escapeHtml(application?.phone ?? "—")}</span><span>${escapeHtml(application?.city ?? "")}</span></button><button class="duplicate-record" type="button" data-open-duplicate-ticket="${escapeHtml(alert.id)}"><small>${escapeHtml(ticketReference)} · ticket nou</small><strong>${escapeHtml(ticketName)}</strong><span>${escapeHtml(ticket?.email ?? "—")} · ${escapeHtml(ticket?.phone ?? "—")}</span><span>${escapeHtml(ticket ? (ticketTypeLabels[ticket.request_type] ?? ticket.request_type) : "")}</span></button></div>${alert.read_at ? "" : `<button class="quiet-button" type="button" data-read-duplicate-alert="${escapeHtml(alert.id)}">Marchează citită</button>`}</article>`;
  }).join("") || '<p class="message-empty">Nu există alerte de dublură.</p>';
  duplicateAlertsList.querySelectorAll("[data-read-duplicate-alert]").forEach(button => button.addEventListener("click", () => markDuplicateAlertRead(button.dataset.readDuplicateAlert)));
  duplicateAlertsList.querySelectorAll("[data-open-duplicate-application]").forEach(button => button.addEventListener("click", () => openDuplicateApplication(button.dataset.openDuplicateApplication)));
  duplicateAlertsList.querySelectorAll("[data-open-duplicate-ticket]").forEach(button => button.addEventListener("click", () => openDuplicateTicket(button.dataset.openDuplicateTicket)));
}

async function loadDuplicateAlerts() {
  const { data, error } = await supabase.from("admin_alerts").select("id, application_id, ticket_id, match_fields, message, created_at, read_at").eq("alert_type", "ticket_duplicate_registration").order("created_at", { ascending: false }).limit(30);
  if (error) { console.warn("Alertele de dublură nu sunt disponibile încă.", error); return; }
  duplicateAlerts = data ?? [];
  const ticketIds = [...new Set(duplicateAlerts.map(item => item.ticket_id).filter(Boolean))];
  if (ticketIds.length) {
    const { data: alertTickets, error: alertTicketsError } = await supabase
      .from("tickets")
      .select("*, ticket_files(*)")
      .in("id", ticketIds);
    if (alertTicketsError) console.warn("Detaliile ticketelor semnalate nu sunt disponibile încă.", alertTicketsError);
    duplicateAlertTickets = alertTickets ?? [];
  } else {
    duplicateAlertTickets = [];
  }
  updateDuplicateAlertBadge();
  renderDuplicateAlerts();
}

async function markDuplicateAlertRead(alertId) {
  const { error } = await supabase.from("admin_alerts").update({ read_at: new Date().toISOString() }).eq("id", alertId);
  if (error) { console.warn("Alerta nu a putut fi marcată drept citită.", error); return; }
  duplicateAlerts = duplicateAlerts.map(item => item.id === alertId ? { ...item, read_at: new Date().toISOString() } : item);
  updateDuplicateAlertBadge();
  renderDuplicateAlerts();
}

async function openDuplicateApplication(alertId) {
  const alert = duplicateAlerts.find(item => item.id === alertId);
  if (!alert?.application_id) return;
  if (!alert.read_at) await markDuplicateAlertRead(alertId);
  duplicateAlertsDialog.close();
  setActiveAdminSection("applications-panel");
  await openApplication(alert.application_id);
}

async function openDuplicateTicket(alertId) {
  const alert = duplicateAlerts.find(item => item.id === alertId);
  if (!alert?.ticket_id) return;
  if (!alert.read_at) await markDuplicateAlertRead(alertId);
  duplicateAlertsDialog.close();
  setActiveAdminSection("tickets-panel");
  await openTicket(alert.ticket_id, ticketForDuplicateAlert(alert.ticket_id));
}

async function openDuplicateAlerts() {
  await Promise.all([loadApplications(), loadTickets(), loadDuplicateAlerts()]);
  duplicateAlertsDialog.showModal();
}

function updateAdminMessageBadge() {
  const unreadCount = subfleetMessages.filter(item => item.sender_role === "subfleet" && !item.read_at).length;
  adminMessageBadge.textContent = unreadCount;
  adminMessageBadge.hidden = unreadCount === 0;
}

function messagePreviewForSubfleet(subfleetId) {
  return subfleetMessages.filter(item => item.subfleet_id === subfleetId).at(-1);
}

function renderAdminMessageConversations() {
  const ordered = [...subfleets].sort((first, second) => {
    const firstMessage = messagePreviewForSubfleet(first.id)?.created_at ?? first.created_at;
    const secondMessage = messagePreviewForSubfleet(second.id)?.created_at ?? second.created_at;
    return new Date(secondMessage) - new Date(firstMessage);
  });
  adminMessageConversations.innerHTML = ordered.map(fleet => {
    const preview = messagePreviewForSubfleet(fleet.id);
    const unreadCount = subfleetMessages.filter(item => item.subfleet_id === fleet.id && item.sender_role === "subfleet" && !item.read_at).length;
    return `<button class="message-conversation${fleet.id === activeMessageSubfleetId ? " active" : ""}" type="button" data-admin-message-subfleet="${escapeHtml(fleet.id)}"><strong>${escapeHtml(fleet.name)}</strong><small>${escapeHtml(preview?.body ?? "Începe conversația")}</small>${unreadCount ? `<span>${unreadCount}</span>` : ""}</button>`;
  }).join("") || '<p class="message-empty">Nu există sub-flote.</p>';
  adminMessageConversations.querySelectorAll("[data-admin-message-subfleet]").forEach(button => button.addEventListener("click", () => openAdminConversation(button.dataset.adminMessageSubfleet)));
}

function renderAdminMessageThread() {
  const fleet = subfleets.find(item => item.id === activeMessageSubfleetId);
  const messages = subfleetMessages.filter(item => item.subfleet_id === activeMessageSubfleetId);
  adminMessageThreadTitle.textContent = fleet ? `Conversație · ${fleet.name}` : "Alege o sub-flotă";
  adminMessageInput.disabled = !fleet;
  adminMessageSend.disabled = !fleet;
  adminMessageThread.innerHTML = fleet
    ? (messages.length ? messages.map(item => `<article class="message-bubble${item.sender_role === "admin" ? " outgoing" : ""}">${escapeHtml(item.body)}<small>${item.sender_role === "admin" ? "CibeRO" : escapeHtml(fleet.name)} · ${escapeHtml(formatDate(item.created_at))}</small></article>`).join("") : '<p class="message-empty">Nu există încă mesaje. Trimite primul mesaj.</p>')
    : '<p class="message-empty">Selectează o sub-flotă pentru a deschide conversația.</p>';
  requestAnimationFrame(() => { adminMessageThread.scrollTop = adminMessageThread.scrollHeight; });
}

async function loadAdminMessages() {
  const { data, error } = await supabase.from("subfleet_messages").select("*").order("created_at", { ascending: true }).limit(500);
  if (error) { console.warn("Mesajele sub-flotelor nu sunt disponibile încă.", error); return; }
  subfleetMessages = data ?? [];
  updateAdminMessageBadge();
  renderAdminMessageConversations();
  renderAdminMessageThread();
}

async function openAdminConversation(subfleetId) {
  activeMessageSubfleetId = subfleetId;
  const unreadIds = subfleetMessages.filter(item => item.subfleet_id === subfleetId && item.sender_role === "subfleet" && !item.read_at).map(item => item.id);
  renderAdminMessageConversations();
  renderAdminMessageThread();
  await markAdminMessagesRead(unreadIds);
}

async function markAdminMessagesRead(unreadIds) {
  if (!unreadIds.length) return;
  const { error } = await supabase.rpc("mark_subfleet_messages_read", { p_message_ids: unreadIds });
  if (error) { console.warn("Mesajele nu au putut fi marcate drept citite.", error); return; }
  subfleetMessages = subfleetMessages.map(item => unreadIds.includes(item.id) ? { ...item, read_at: new Date().toISOString() } : item);
  updateAdminMessageBadge();
  renderAdminMessageConversations();
}

async function openAdminMessages() {
  await Promise.all([loadSubfleets(), loadAdminMessages()]);
  if (!activeMessageSubfleetId && subfleets.length) activeMessageSubfleetId = subfleets[0].id;
  await markAdminMessagesRead(subfleetMessages.filter(item => item.sender_role === "subfleet" && !item.read_at).map(item => item.id));
  renderAdminMessageConversations();
  renderAdminMessageThread();
  adminMessagesDialog.showModal();
}

async function sendAdminMessage(event) {
  event.preventDefault();
  if (!activeMessageSubfleetId || !adminMessageInput.value.trim()) return;
  adminMessageSend.disabled = true;
  adminMessageFeedback.classList.remove("success");
  adminMessageFeedback.textContent = "Se trimite mesajul…";
  const { data, error } = await supabase.rpc("send_subfleet_message", { p_subfleet_id: activeMessageSubfleetId, p_body: adminMessageInput.value });
  adminMessageSend.disabled = false;
  if (error) { console.error(error); adminMessageFeedback.textContent = "Mesajul nu a putut fi trimis."; return; }
  adminMessageInput.value = "";
  subfleetMessages = [...subfleetMessages, data];
  adminMessageFeedback.classList.add("success");
  adminMessageFeedback.textContent = "Mesaj trimis.";
  renderAdminMessageConversations();
  renderAdminMessageThread();
}

function renderSubfleets() {
  const accountsByFleet = new Map(subfleets.map(item => [item.id, subfleetAccounts.filter(account => account.subfleet_id === item.id)]));
  const query = subfleetSearch.value.trim().toLocaleLowerCase("ro-RO");
  const visibleSubfleets = subfleets.filter(item => !query || [item.name, item.description].join(" ").toLocaleLowerCase("ro-RO").includes(query));
  subfleetsList.innerHTML = visibleSubfleets.map(item => {
    const accounts = accountsByFleet.get(item.id) ?? [];
    const activeAccounts = accounts.filter(account => account.is_active).length;
    const members = applications.filter(application => application.subfleet_id === item.id);
    const claimed = members.filter(isSubfleetRegistration);
    const working = members.filter(application => ["reviewing", "sent_to_platform"].includes(application.status));
    const active = members.filter(application => application.status === "activated");
    return `<button class="subfleet-card" type="button" data-subfleet-id="${escapeHtml(item.id)}" aria-label="Deschide sub-flota ${escapeHtml(item.name)}"><span class="subfleet-card-icon" aria-hidden="true">⌘</span><span class="subfleet-card-heading"><strong>${escapeHtml(item.name)}</strong><small>Adăugată ${escapeHtml(formatDate(item.created_at))}</small></span><span class="subfleet-card-state ${item.is_active ? "active" : "inactive"}">${item.is_active ? "Activă" : "Inactivă"}</span><span class="subfleet-card-metrics"><span><small>Total curieri</small><b>${members.length}</b></span><span><small>Revendicați</small><b>${claimed.length}</b></span><span><small>În lucru</small><b>${working.length}</b></span><span><small>Activi</small><b>${active.length}</b></span></span><span class="subfleet-card-footer"><span>${activeAccounts} ${activeAccounts === 1 ? "cont activ" : "conturi active"}</span><span>Deschide →</span></span></button>`;
  }).join("");
  subfleetsEmpty.hidden = visibleSubfleets.length > 0;
  subfleetsEmpty.textContent = subfleets.length && !visibleSubfleets.length ? "Nu există sub-flote pentru această căutare." : "Nu există încă sub-flote.";
  subfleetsList.querySelectorAll("[data-subfleet-id]").forEach(button => button.addEventListener("click", () => openSubfleetDetails(button.dataset.subfleetId)));
}

function activeSubfleetMembers() {
  const query = subfleetMemberSearch.value.trim().toLocaleLowerCase("ro-RO");
  const status = subfleetMemberStatus.value;
  return applications.filter(item => item.subfleet_id === activeSubfleetId).filter(item => {
    const haystack = [item.first_name, item.last_name, item.email, item.phone, item.city].join(" ").toLocaleLowerCase("ro-RO");
    return (!query || haystack.includes(query)) && (!status || item.status === status);
  });
}

function renderSubfleetMembers() {
  const rows = activeSubfleetMembers();
  subfleetMembersList.innerHTML = rows.map(item => `<div class="application-row subfleet-member-row${isApplicationRead(item) ? "" : " unread"}"><button class="application-open" type="button" data-subfleet-member-id="${escapeHtml(item.id)}"><span class="date">${escapeHtml(formatDate(item.created_at))}</span><span class="platform">${escapeHtml(applicationTypeLabel(item))}</span><strong class="identity">${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</strong><span class="city">${escapeHtml(item.city)}</span><span class="arrow" aria-hidden="true">→</span></button><span class="status-pill">${escapeHtml(statusLabels[item.status] ?? item.status)}</span></div>`).join("");
  subfleetMembersEmpty.hidden = rows.length > 0;
  subfleetMembersList.querySelectorAll("[data-subfleet-member-id]").forEach(button => button.addEventListener("click", () => openApplication(button.dataset.subfleetMemberId)));
}

function openSubfleetDetails(subfleetId) {
  const fleet = subfleets.find(item => item.id === subfleetId);
  if (!fleet) return;
  activeSubfleetId = subfleetId;
  subfleetMemberSearch.value = "";
  subfleetMemberStatus.value = "";
  const members = applications.filter(item => item.subfleet_id === subfleetId);
  const claimed = members.filter(isSubfleetRegistration);
  const working = members.filter(item => ["reviewing", "sent_to_platform"].includes(item.status));
  const active = members.filter(item => item.status === "activated");
  subfleetDetailTitle.textContent = fleet.name;
  openSubfleetMessagesButton.setAttribute("aria-label", `Deschide conversația cu ${fleet.name}`);
  subfleetDetailCopy.textContent = fleet.description || "Membrii revendicați și activitatea acestei sub-flote.";
  document.querySelector("#subfleet-detail-total").textContent = members.length;
  document.querySelector("#subfleet-detail-claimed").textContent = claimed.length;
  document.querySelector("#subfleet-detail-working").textContent = working.length;
  document.querySelector("#subfleet-detail-active").textContent = active.length;
  setActiveAdminSection("subfleet-detail-panel");
  renderSubfleetMembers();
}

async function loadSubfleets() {
  const [fleetResult, accountResult] = await Promise.all([
    supabase.from("subfleets").select("*").order("created_at", { ascending: false }),
    supabase.from("admin_users").select("user_id, display_name, subfleet_id, is_active, role").eq("role", "subfleet"),
  ]);
  const error = fleetResult.error || accountResult.error;
  if (error) { console.error(error); setSubfleetsFeedback("Sub-flotele nu au putut fi încărcate."); return; }
  subfleets = fleetResult.data ?? [];
  subfleetAccounts = accountResult.data ?? [];
  renderSubfleets();
  renderSubfleetAlerts();
}

async function manageSubfleetAccount(payload) {
  const { data, error } = await supabase.functions.invoke("manage-subfleet-account", { body: payload });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error || "Acțiunea nu a putut fi finalizată.");
  return data;
}

async function loadApplications() {
  dashboardFeedback.classList.remove("success");
  dashboardFeedback.textContent = "Se încarcă cererile…";
  refreshButton.disabled = true;

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  refreshButton.disabled = false;
  if (error) {
    dashboardFeedback.textContent = "Cererile nu au putut fi încărcate.";
    console.error(error);
    return;
  }

  applications = data ?? [];
  dashboardFeedback.textContent = "";
  updateSummary();
  renderApplications();
  renderSubfleets();
}

async function loadTickets() {
  ticketsFeedback.classList.remove("success");
  ticketsFeedback.textContent = "Se încarcă ticketele…";
  refreshTicketsButton.disabled = true;
  const { data, error } = await supabase
    .from("tickets")
    .select("*, ticket_files(*)")
    .is("subfleet_id", null)
    .order("created_at", { ascending: false });
  refreshTicketsButton.disabled = false;
  if (error) {
    ticketsFeedback.textContent = "Ticketele nu au putut fi încărcate.";
    console.error(error);
    return;
  }
  tickets = data ?? [];
  ticketsFeedback.textContent = "";
  updateTicketSummary();
  renderTickets();
}

function updateTicketSummary() {
  const centralTickets = ciberoTickets();
  const viewTickets = centralTickets.filter(ticketMatchesActiveView);
  renderTicketNavigation();
  document.querySelector("#tickets-total-count").textContent = viewTickets.length;
  document.querySelector("#tickets-new-count").textContent = viewTickets.filter(item => item.status === "new").length;
  document.querySelector("#tickets-reviewing-count").textContent = viewTickets.filter(item => ["reviewing", "clarification", "sent_to_platform"].includes(item.status)).length;
  document.querySelector("#tickets-approved-count").textContent = viewTickets.filter(item => item.status === "approved").length;
  updatePrimaryUnreadBadge("tickets-panel", ticketsPrimaryCount, centralTickets.filter(item => item.status === "new").length);
}

function filteredTickets() {
  const query = ticketSearchFilter.value.trim().toLocaleLowerCase("ro-RO");
  const status = ticketStatusFilter.value;
  return ciberoTickets().filter(item => {
    const reference = item.id.slice(0, 8).toUpperCase();
    const haystack = [reference, item.first_name, item.last_name, item.email, item.phone, ticketTypeLabels[item.request_type]].join(" ").toLocaleLowerCase("ro-RO");
    return ticketMatchesActiveView(item) && (!query || haystack.includes(query)) && (!status || item.status === status);
  });
}

function renderTickets() {
  const rows = filteredTickets();
  ticketsList.innerHTML = rows.map(item => `
    <div class="ticket-row${isTicketRead(item) ? "" : " unread"}">
      <button class="ticket-open" type="button" data-ticket-id="${escapeHtml(item.id)}" aria-label="Deschide ticketul #${escapeHtml(item.id.slice(0, 8).toUpperCase())}">
        <span class="ticket-reference-small">#${escapeHtml(item.id.slice(0, 8).toUpperCase())}</span>
        <span class="date">${escapeHtml(formatDate(item.created_at))}</span>
        <span class="platform">${escapeHtml(ticketDisplayCategory(item))}</span>
        <strong class="identity">${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</strong>
        <span class="ticket-type">${escapeHtml(ticketTypeLabels[item.request_type] ?? item.request_type)}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>
      <div class="ticket-status-combobox" data-ticket-status-combobox>
        <button class="ticket-status-toggle status-pill" type="button" data-ticket-status-toggle data-status="${escapeHtml(item.status)}" aria-haspopup="listbox" aria-expanded="false" aria-label="Schimbă statusul ticketului #${escapeHtml(item.id.slice(0, 8).toUpperCase())}">
          <span>${escapeHtml(ticketStatusLabels[item.status] ?? item.status)}</span><b aria-hidden="true">⌄</b>
        </button>
        <span class="ticket-status-suggestions" role="listbox" hidden>
          ${Object.entries(ticketStatusLabels).filter(([value]) => value !== item.status).map(([value, label]) => `<button type="button" role="option" data-ticket-status-option="${escapeHtml(item.id)}" data-ticket-status-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`).join("")}
        </span>
      </div>
    </div>
  `).join("");
  ticketsEmptyState.hidden = rows.length > 0;
  ticketsEmptyState.textContent = `Nu există tickete în categoria ${ticketViewById(activeTicketView).label} pentru filtrele selectate.`;
  ticketsList.querySelectorAll("[data-ticket-id]").forEach(button => button.addEventListener("click", () => openTicket(button.dataset.ticketId)));
  ticketsList.querySelectorAll("[data-ticket-status-toggle]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    toggleTicketStatusMenu(button);
  }));
  ticketsList.querySelectorAll("[data-ticket-status-combobox]").forEach(bindStatusMenuScroll);
  ticketsList.querySelectorAll("[data-ticket-status-option]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    closeTicketStatusMenus();
    updateTicketStatus(button.dataset.ticketStatusOption, button.dataset.ticketStatusValue, button);
  }));
}

function closeTicketStatusMenus(except = null) {
  ticketsList.querySelectorAll("[data-ticket-status-combobox]").forEach(combobox => {
    if (combobox === except) return;
    const toggle = combobox.querySelector("[data-ticket-status-toggle]");
    const suggestions = combobox.querySelector(".ticket-status-suggestions");
    suggestions.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    combobox.classList.remove("status-menu-active");
    combobox.closest(".ticket-row")?.classList.remove("status-menu-active");
  });
  syncStatusMenuBackdrop();
}

function toggleTicketStatusMenu(toggle) {
  const combobox = toggle.closest("[data-ticket-status-combobox]");
  const suggestions = combobox?.querySelector(".ticket-status-suggestions");
  if (!combobox || !suggestions) return;
  const opening = suggestions.hidden;
  closeTicketStatusMenus(combobox);
  closeApplicationStatusMenus();
  suggestions.hidden = !opening;
  toggle.setAttribute("aria-expanded", String(opening));
  combobox.classList.toggle("status-menu-active", opening);
  combobox.closest(".ticket-row")?.classList.toggle("status-menu-active", opening);
  syncStatusMenuBackdrop();
  if (opening) positionStatusMenu(combobox);
}

function updateSummary() {
  const visibleApplications = applications.filter(matchesActiveRegistrationView);
  accountRequestPlatformTabs.hidden = activeRegistrationView !== "account_requests";
  registrationTabs.forEach(tab => {
    const view = tab.dataset.registrationView;
    updateTabUnreadBadge(tab, applications.filter(item => matchesRegistrationView(item, view) && item.status === "new").length);
  });
  platformTabs.forEach(tab => {
    const platform = tab.dataset.platformTab;
    const active = platform === activePlatform;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    updateTabUnreadBadge(tab, applications.filter(item => matchesRegistrationView(item, "account_requests", platform) && item.status === "new").length);
  });
  document.querySelector("#total-count").textContent = visibleApplications.length;
  document.querySelector("#new-count").textContent = visibleApplications.filter(item => item.status === "new").length;
  document.querySelector("#reviewing-count").textContent = visibleApplications.filter(item => item.status === "reviewing").length;
  document.querySelector("#activated-count").textContent = visibleApplications.filter(item => item.status === "activated").length;
  updatePrimaryUnreadBadge("applications-panel", applicationsPrimaryCount, applications.filter(item => item.status === "new").length);
}

function isSocialRegistration(item) {
  return item.platform === "social_media" && item.application_type === "social_registration";
}

function isSubfleetRegistration(item) {
  return isSocialRegistration(item) && ["new_courier", "experienced_courier"].includes(item.courier_type);
}

function matchesRegistrationView(item, view, platform = "all") {
  if (view === "all") return isSocialRegistration(item);
  if (view === "pfa") return isSocialRegistration(item) && item.courier_type === "pfa";
  if (view === "srl") return isSocialRegistration(item) && item.courier_type === "srl";
  if (view === "subfleets") return isSubfleetRegistration(item);
  return ["wolt", "glovo"].includes(item.platform) && (platform === "all" || item.platform === platform);
}

function applicationTypeLabel(item) {
  if (!isSocialRegistration(item)) return applicationPlatformLabel(item.platform);
  return ({ new_courier: "Curier nou", experienced_courier: "Curier cu experiență", pfa: "PFA", srl: "SRL" })[item.courier_type] ?? "Înregistrare";
}

function registrationViewLabel() {
  return ({ all: "toate înregistrările", pfa: "PFA", srl: "SRL", subfleets: "sub-flote", account_requests: activePlatform === "all" ? "Wolt și Glovo" : applicationPlatformLabel(activePlatform) })[activeRegistrationView];
}

function matchesActiveRegistrationView(item) {
  return matchesRegistrationView(item, activeRegistrationView, activePlatform);
}

function filteredApplications() {
  const query = searchFilter.value.trim().toLocaleLowerCase("ro-RO");
  const status = statusFilter.value;

  return applications.filter(item => {
    const haystack = [item.first_name, item.last_name, item.email, item.phone, item.city]
      .join(" ")
      .toLocaleLowerCase("ro-RO");
    return matchesActiveRegistrationView(item) &&
      (!query || haystack.includes(query)) &&
      (!status || item.status === status);
  });
}

function applicationPlatformLabel(platform) {
  return applicationPlatformLabels[platform] ?? platform;
}

function updateSelectionControls(rows = filteredApplications()) {
  const visibleIds = rows.map(item => item.id);
  const selectedVisibleCount = visibleIds.filter(id => selectedApplicationIds.has(id)).length;
  selectAllApplications.checked = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  selectAllApplications.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;
  selectAllApplications.disabled = visibleIds.length === 0;
  deleteSelectedButton.hidden = selectedApplicationIds.size === 0;
  deleteSelectedButton.querySelector("span").textContent = selectedApplicationIds.size;
}

function renderApplications() {
  const rows = filteredApplications();
  const visibleIds = new Set(rows.map(item => item.id));
  [...selectedApplicationIds].forEach(id => {
    if (!visibleIds.has(id)) selectedApplicationIds.delete(id);
  });
  applicationsList.innerHTML = rows.map(item => `
    <div class="application-row${selectedApplicationIds.has(item.id) ? " selected" : ""}${isApplicationRead(item) ? "" : " unread"}" data-application-row="${escapeHtml(item.id)}">
      <label class="row-selector" title="Selectează cererea">
        <input type="checkbox" data-select-application="${escapeHtml(item.id)}" aria-label="Selectează cererea lui ${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}"${selectedApplicationIds.has(item.id) ? " checked" : ""} />
        <span aria-hidden="true"></span>
      </label>
      <button class="application-open" type="button" data-application-id="${escapeHtml(item.id)}">
        <span class="date">${escapeHtml(formatDate(item.created_at))}</span>
        <span class="platform">${escapeHtml(applicationTypeLabel(item))}</span>
        <strong class="identity">${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</strong>
        <span class="city">${escapeHtml(item.city)}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>
      <div class="ticket-status-combobox application-status-combobox" data-application-status-combobox>
        <button class="ticket-status-toggle status-pill" type="button" data-application-status-toggle data-status="${escapeHtml(item.status)}" aria-haspopup="listbox" aria-expanded="false" aria-label="Schimbă statusul cererii lui ${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}">
          <span>${escapeHtml(statusLabels[item.status] ?? item.status)}</span><b aria-hidden="true">⌄</b>
        </button>
        <span class="ticket-status-suggestions" role="listbox" hidden>
          ${Object.entries(statusLabels).filter(([value]) => value !== item.status).map(([value, label]) => `<button type="button" role="option" data-application-status-option="${escapeHtml(item.id)}" data-application-status-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`).join("")}
        </span>
      </div>
    </div>
  `).join("");

  emptyState.hidden = rows.length > 0;
  emptyState.textContent = `Nu există înregistrări pentru ${registrationViewLabel()} cu filtrele selectate.`;
  applicationsList.querySelectorAll("[data-select-application]").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const id = checkbox.dataset.selectApplication;
      if (checkbox.checked) selectedApplicationIds.add(id);
      else selectedApplicationIds.delete(id);
      checkbox.closest(".application-row").classList.toggle("selected", checkbox.checked);
      updateSelectionControls(rows);
    });
  });
  applicationsList.querySelectorAll("[data-application-id]").forEach(button => {
    button.addEventListener("click", () => openApplication(button.dataset.applicationId));
  });
  applicationsList.querySelectorAll("[data-application-status-toggle]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    toggleApplicationStatusMenu(button);
  }));
  applicationsList.querySelectorAll("[data-application-status-combobox]").forEach(bindStatusMenuScroll);
  applicationsList.querySelectorAll("[data-application-status-option]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    closeApplicationStatusMenus();
    updateApplicationStatus(button.dataset.applicationStatusOption, button.dataset.applicationStatusValue, button);
  }));
  updateSelectionControls(rows);
}

function closeApplicationStatusMenus(except = null) {
  applicationsList.querySelectorAll("[data-application-status-combobox]").forEach(combobox => {
    if (combobox === except) return;
    const toggle = combobox.querySelector("[data-application-status-toggle]");
    const suggestions = combobox.querySelector(".ticket-status-suggestions");
    suggestions.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    combobox.classList.remove("status-menu-active");
    combobox.closest(".application-row")?.classList.remove("status-menu-active");
  });
  syncStatusMenuBackdrop();
}

function toggleApplicationStatusMenu(toggle) {
  const combobox = toggle.closest("[data-application-status-combobox]");
  const suggestions = combobox?.querySelector(".ticket-status-suggestions");
  if (!combobox || !suggestions) return;
  const opening = suggestions.hidden;
  closeApplicationStatusMenus(combobox);
  closeTicketStatusMenus();
  suggestions.hidden = !opening;
  toggle.setAttribute("aria-expanded", String(opening));
  combobox.classList.toggle("status-menu-active", opening);
  combobox.closest(".application-row")?.classList.toggle("status-menu-active", opening);
  syncStatusMenuBackdrop();
  if (opening) positionStatusMenu(combobox);
}

function bindStatusMenuScroll(combobox) {
  const suggestions = combobox.querySelector(".ticket-status-suggestions");
  if (!suggestions) return;

  suggestions.addEventListener("wheel", event => {
    if (event.ctrlKey) return;
    const scrollable = suggestions.scrollHeight > suggestions.clientHeight;
    const atTop = suggestions.scrollTop <= 0;
    const atBottom = suggestions.scrollTop + suggestions.clientHeight >= suggestions.scrollHeight - 1;
    const shouldContinuePageScroll = !scrollable || (event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom);
    if (!shouldContinuePageScroll) return;

    event.preventDefault();
    window.scrollBy({ top: event.deltaY, behavior: "auto" });
    positionStatusMenu(combobox);
  }, { passive: false });
}

function positionStatusMenu(combobox) {
  const suggestions = combobox.querySelector(".ticket-status-suggestions");
  if (!suggestions || suggestions.hidden) return;

  requestAnimationFrame(() => {
    if (suggestions.hidden) return;
    suggestions.classList.remove("opens-upward");
    suggestions.style.maxHeight = "";

    const gap = 12;
    const rect = combobox.getBoundingClientRect();
    const desiredHeight = Math.min(suggestions.scrollHeight, 230);
    const roomBelow = Math.max(0, window.innerHeight - rect.bottom - gap);
    const roomAbove = Math.max(0, rect.top - gap);
    const opensUpward = roomBelow < desiredHeight && roomAbove > roomBelow;
    const availableHeight = opensUpward ? roomAbove : roomBelow;

    suggestions.classList.toggle("opens-upward", opensUpward);
    suggestions.style.maxHeight = `${Math.max(84, Math.min(desiredHeight, availableHeight))}px`;
  });
}

function positionOpenStatusMenus() {
  document.querySelectorAll("[data-ticket-status-combobox], [data-application-status-combobox]").forEach(positionStatusMenu);
}

function syncStatusMenuBackdrop() {
  document.body.classList.toggle("status-menu-open", Boolean(document.querySelector(".ticket-status-suggestions:not([hidden])")));
}

function detailField(label, value, full = false) {
  return `<div class="detail-field${full ? " full" : ""}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "—")}</strong></div>`;
}

async function openApplication(id) {
  const item = applications.find(application => application.id === id);
  if (!item) return;

  applicationDetails.innerHTML = `
    <div class="detail-grid">
      ${item.platform === "social_media" ? "" : detailField("Platformă", applicationPlatformLabel(item.platform))}
      ${detailField("Status", statusLabels[item.status] ?? item.status)}
      ${detailField("Prenume", item.first_name)}
      ${detailField("Nume", item.last_name)}
      ${detailField("Email", item.email)}
      ${detailField("Telefon", item.phone)}
      ${detailField("Oraș", item.city)}
      ${detailField("Vehicul", item.vehicle)}
      ${item.platform === "social_media" ? `${detailField("Tip colaborare", ({ new_courier: "Curier nou", pfa: "PFA", experienced_courier: "Curier cu experiență", srl: "SRL" })[item.courier_type] ?? item.courier_type)}${detailField("Naționalitate", item.nationality)}${detailField("De unde a aflat", ({ facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", olx: "OLX", google: "Google", recommendation: "Recomandare", other: "Altă sursă" })[item.discovery_source] ?? item.discovery_source)}${detailField("Platforme dorite", (item.desired_platforms ?? []).map(value => ({ bolt: "Bolt Food", glovo: "Glovo", wolt: "Wolt" })[value] ?? value).join(", "), true)}` : ""}
      ${detailField("Data cererii", formatDate(item.created_at), true)}
      ${detailField("Mesaj", item.message, true)}
    </div>
    <div class="detail-actions">
      <label>Status
        <select id="detail-status">${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}"${item.status === value ? " selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>
      </label>
      <label>Observații interne<textarea id="detail-notes" maxlength="5000">${escapeHtml(item.admin_notes ?? "")}</textarea></label>
      ${item.proof_path ? '<button id="proof-button" class="quiet-button" type="button">Deschide captura Wolt</button>' : ""}
      <button id="save-application" class="primary-button" type="button">Salvează modificările</button>
      <p id="detail-feedback" class="feedback" role="status" aria-live="polite"></p>
    </div>
  `;

  applicationDialog.showModal();

  document.querySelector("#save-application").addEventListener("click", () => saveApplication(item));
  document.querySelector("#proof-button")?.addEventListener("click", () => openProof(item.proof_path));
  void markApplicationRead(item);
}

async function markApplicationRead(item) {
  if (isApplicationRead(item)) return;
  const openedAt = new Date().toISOString();
  rememberOpened(item.id, locallyOpenedApplicationIds, openedApplicationStorageKey);
  applications = applications.map(application => application.id === item.id ? { ...application, opened_at: openedAt } : application);
  updateSummary();
  renderApplications();

  const { data, error } = await supabase
    .from("applications")
    .update({ opened_at: openedAt })
    .eq("id", item.id)
    .select()
    .single();

  if (error) {
    console.warn("Application read state was saved locally only.", error);
    return;
  }

  applications = applications.map(application => application.id === data.id ? data : application);
  updateSummary();
  renderApplications();
}

async function saveApplication(item) {
  const button = document.querySelector("#save-application");
  const feedback = document.querySelector("#detail-feedback");
  const status = document.querySelector("#detail-status").value;
  const adminNotes = document.querySelector("#detail-notes").value.trim();
  button.disabled = true;
  feedback.textContent = "Se salvează…";

  const applicationUpdate = { status, admin_notes: adminNotes || null, ...readStateUpdateForStatus(item.status, status) };
  const { data, error } = await supabase
    .from("applications")
    .update(applicationUpdate)
    .eq("id", item.id)
    .select()
    .single();

  button.disabled = false;
  if (error) {
    feedback.textContent = "Modificările nu au putut fi salvate.";
    console.error(error);
    return;
  }

  applications = applications.map(application => application.id === data.id ? data : application);
  syncApplicationReadState(data);
  feedback.style.color = "var(--success)";
  feedback.textContent = "Modificările au fost salvate.";
  updateSummary();
  renderApplications();
}

async function updateApplicationStatus(id, status, control) {
  const item = applications.find(application => application.id === id);
  if (!item || control.disabled || !statusLabels[status] || status === item.status) return;

  const statusControls = [...(control.closest("[data-application-status-combobox]")?.querySelectorAll("button") ?? [])];
  statusControls.forEach(button => { button.disabled = true; });
  dashboardFeedback.classList.remove("success");
  dashboardFeedback.textContent = `Se schimbă statusul în „${statusLabels[status]}”…`;

  const applicationUpdate = { status, ...readStateUpdateForStatus(item.status, status) };
  const { data, error } = await supabase
    .from("applications")
    .update(applicationUpdate)
    .eq("id", item.id)
    .select()
    .single();

  if (error) {
    statusControls.forEach(button => { button.disabled = false; });
    dashboardFeedback.textContent = "Statusul cererii nu a putut fi actualizat.";
    console.error(error);
    return;
  }

  applications = applications.map(application => application.id === data.id ? data : application);
  syncApplicationReadState(data);
  dashboardFeedback.classList.add("success");
  dashboardFeedback.textContent = `Status actualizat: ${statusLabels[status]}.`;
  updateSummary();
  renderApplications();
}

function openDeleteConfirmation() {
  const count = selectedApplicationIds.size;
  if (!count) return;
  pendingTicketDeletion = null;
  deleteDialogTitle.textContent = count === 1 ? "Ștergi cererea selectată?" : "Ștergi cererile selectate?";
  deleteDialogCopy.textContent = count === 1
    ? "Cererea selectată și captura asociată vor fi șterse definitiv. Acțiunea nu poate fi anulată."
    : `Cele ${count} cereri selectate și capturile asociate vor fi șterse definitiv. Acțiunea nu poate fi anulată.`;
  deleteFeedback.textContent = "";
  confirmDeleteButton.disabled = false;
  deleteDialog.showModal();
}

function openTicketDeleteConfirmation(item) {
  pendingTicketDeletion = item;
  deleteDialogTitle.textContent = "Ștergi acest ticket?";
  deleteDialogCopy.textContent = `Ticketul #${item.id.slice(0, 8).toUpperCase()} și fișierele atașate vor fi șterse definitiv. Adresa de email va putea trimite imediat un ticket nou.`;
  deleteFeedback.textContent = "";
  confirmDeleteButton.disabled = false;
  cancelDeleteButton.disabled = false;
  deleteDialog.showModal();
}

async function deleteSelectedApplications() {
  const ids = [...selectedApplicationIds];
  if (!ids.length) return;

  const selectedItems = applications.filter(item => selectedApplicationIds.has(item.id));
  const proofPaths = selectedItems.map(item => item.proof_path).filter(Boolean);
  confirmDeleteButton.disabled = true;
  cancelDeleteButton.disabled = true;
  deleteFeedback.textContent = ids.length === 1 ? "Se șterge cererea…" : `Se șterg cele ${ids.length} cereri…`;

  const { data, error } = await supabase
    .from("applications")
    .delete()
    .in("id", ids)
    .select("id");

  if (error || data?.length !== ids.length) {
    confirmDeleteButton.disabled = false;
    cancelDeleteButton.disabled = false;
    deleteFeedback.textContent = "Cererile nu au putut fi șterse. Verifică permisiunile și încearcă din nou.";
    if (error) console.error(error);
    return;
  }

  let proofCleanupFailed = false;
  if (proofPaths.length) {
    const { error: proofError } = await supabase.storage
      .from("application-proofs")
      .remove(proofPaths);
    proofCleanupFailed = Boolean(proofError);
    if (proofError) console.error(proofError);
  }

  const deletedIds = new Set(data.map(item => item.id));
  applications = applications.filter(item => !deletedIds.has(item.id));
  selectedApplicationIds.clear();
  confirmDeleteButton.disabled = false;
  cancelDeleteButton.disabled = false;
  deleteDialog.close();
  dashboardFeedback.classList.toggle("success", !proofCleanupFailed);
  dashboardFeedback.textContent = proofCleanupFailed
    ? "Cererile au fost șterse, dar unele capturi nu au putut fi eliminate din spațiul de stocare."
    : ids.length === 1 ? "Cererea a fost ștearsă definitiv." : `Cele ${ids.length} cereri au fost șterse definitiv.`;
  updateSummary();
  renderApplications();
}

async function openTicket(id, suppliedTicket = null) {
  const item = tickets.find(ticket => ticket.id === id) ?? suppliedTicket;
  if (!item) return;
  const requestedValues = [
    ["Telefon nou", item.new_phone], ["Email nou", item.new_email], ["IBAN nou", item.new_iban],
    ["Oraș nou", item.new_city], ["Vehicul nou", item.new_vehicle], ["Nr. înmatriculare nou", item.new_plate],
    ["Telefon aplicație Wolt", item.wolt_app_phone], ["ID Curier Wolt", item.wolt_courier_id],
    ["Email Wolt", item.wolt_email], ["Cod comandă", item.order_code],
    ["Sumă declarată", item.declared_amount ? `${item.declared_amount} lei` : null], ["Descriere", item.description],
    ["Platforme", Array.isArray(item.platforms) ? item.platforms.join(", ") : item.platforms],
    ["Început inactivitate", item.inactive_start], ["Încheiere inactivitate", item.inactive_end],
  ].filter(([, value]) => value);
  const files = item.ticket_files ?? [];
  ticketAdminDetails.innerHTML = `
    <div class="detail-grid">
      ${detailField("Referință", `#${item.id.slice(0, 8).toUpperCase()}`)}
      ${detailField("Status", ticketStatusLabels[item.status] ?? item.status)}
      ${detailField("Categorie", ticketDisplayCategory(item))}
      ${detailField("Tip solicitare", ticketTypeLabels[item.request_type] ?? item.request_type)}
      ${detailField("Curier", `${item.first_name} ${item.last_name}`)}
      ${detailField("Telefon", item.phone)}
      ${detailField("Email", item.email, true)}
      ${requestedValues.map(([label, value]) => detailField(label, value, label === "Descriere")).join("")}
      ${detailField("Note solicitant", item.notes, true)}
      ${detailField("Data trimiterii", formatDate(item.created_at), true)}
    </div>
    ${files.length ? `<div class="ticket-files"><h3>Fișiere atașate</h3>${files.map(file => `<button class="quiet-button" type="button" data-ticket-file="${escapeHtml(file.storage_path)}">${escapeHtml(file.original_name)} <span>↗</span></button>`).join("")}</div>` : ""}
    <div class="detail-actions">
      <label>Status<select id="ticket-detail-status">${Object.entries(ticketStatusLabels).map(([value, label]) => `<option value="${value}"${item.status === value ? " selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select></label>
      <label>Observații interne<textarea id="ticket-detail-notes" maxlength="5000">${escapeHtml(item.admin_notes ?? "")}</textarea></label>
      <button id="save-ticket" class="primary-button" type="button">Salvează modificările</button>
      <button id="delete-ticket" class="danger-button" type="button">Șterge ticketul definitiv</button>
      <p id="ticket-detail-feedback" class="feedback" role="status" aria-live="polite"></p>
    </div>
  `;
  ticketAdminDialog.showModal();
  ticketDeleteHeader.hidden = false;
  ticketDeleteHeader.onclick = () => openTicketDeleteConfirmation(item);
  ticketAdminDetails.querySelector("#save-ticket").addEventListener("click", () => saveTicket(item));
  ticketAdminDetails.querySelector("#delete-ticket").addEventListener("click", () => openTicketDeleteConfirmation(item));
  ticketAdminDetails.querySelectorAll("[data-ticket-file]").forEach(button => button.addEventListener("click", () => openTicketFile(button.dataset.ticketFile)));
  void markTicketRead(item);
}

async function markTicketRead(item) {
  if (isTicketRead(item)) return;
  const openedAt = new Date().toISOString();
  rememberOpened(item.id, locallyOpenedTicketIds, openedTicketStorageKey);
  tickets = tickets.map(ticket => ticket.id === item.id ? { ...ticket, opened_at: openedAt } : ticket);
  updateTicketSummary();
  renderTickets();

  const { data, error } = await supabase
    .from("tickets")
    .update({ opened_at: openedAt })
    .eq("id", item.id)
    .select("*, ticket_files(*)")
    .single();

  if (error) {
    // Până este rulată migrarea, păstrăm starea în browserul administratorului.
    console.warn("Ticket read state was saved locally only.", error);
    return;
  }

  tickets = tickets.map(ticket => ticket.id === data.id ? data : ticket);
  updateTicketSummary();
  renderTickets();
}

async function updateTicketStatus(id, status, control) {
  const item = tickets.find(ticket => ticket.id === id);
  if (!item || control.disabled || !ticketStatusLabels[status] || status === item.status) return;

  const statusControls = [...(control.closest("[data-ticket-status-combobox]")?.querySelectorAll("button") ?? [])];
  statusControls.forEach(button => { button.disabled = true; });
  ticketsFeedback.classList.remove("success");
  ticketsFeedback.textContent = `Se schimbă statusul în „${ticketStatusLabels[status]}”…`;

  const ticketUpdate = { status, ...readStateUpdateForStatus(item.status, status) };
  const { data, error } = await supabase
    .from("tickets")
    .update(ticketUpdate)
    .eq("id", item.id)
    .select("*, ticket_files(*)")
    .single();

  if (error) {
    statusControls.forEach(button => { button.disabled = false; });
    ticketsFeedback.textContent = "Statusul nu a putut fi modificat.";
    console.error(error);
    return;
  }

  tickets = tickets.map(ticket => ticket.id === data.id ? data : ticket);
  syncTicketReadState(data);
  ticketsFeedback.classList.add("success");
  ticketsFeedback.textContent = `Status actualizat: ${ticketStatusLabels[status]}.`;
  updateTicketSummary();
  renderTickets();
}

async function deleteTicket(item) {
  const filePaths = (item.ticket_files ?? []).map(file => file.storage_path).filter(Boolean);
  confirmDeleteButton.disabled = true;
  cancelDeleteButton.disabled = true;
  deleteFeedback.textContent = "Se șterge ticketul…";

  const { data, error } = await supabase.from("tickets").delete().eq("id", item.id).select("id");
  if (error || data?.length !== 1) {
    confirmDeleteButton.disabled = false;
    cancelDeleteButton.disabled = false;
    deleteFeedback.textContent = "Ticketul nu a putut fi șters. Verifică permisiunile și încearcă din nou.";
    if (error) console.error(error);
    return;
  }

  let fileCleanupFailed = false;
  if (filePaths.length) {
    const { error: storageError } = await supabase.storage.from("ticket-files").remove(filePaths);
    fileCleanupFailed = Boolean(storageError);
    if (storageError) console.error(storageError);
  }

  tickets = tickets.filter(ticket => ticket.id !== item.id);
  pendingTicketDeletion = null;
  confirmDeleteButton.disabled = false;
  cancelDeleteButton.disabled = false;
  deleteDialog.close();
  ticketAdminDialog.close();
  ticketsFeedback.classList.toggle("success", !fileCleanupFailed);
  ticketsFeedback.textContent = fileCleanupFailed
    ? "Ticketul a fost șters, dar unele fișiere atașate nu au putut fi eliminate din spațiul de stocare."
    : "Ticketul a fost șters definitiv. Adresa de email poate trimite imediat un ticket nou.";
  updateTicketSummary();
  renderTickets();
}

async function saveTicket(item) {
  const button = ticketAdminDetails.querySelector("#save-ticket");
  const feedback = ticketAdminDetails.querySelector("#ticket-detail-feedback");
  const status = ticketAdminDetails.querySelector("#ticket-detail-status").value;
  const adminNotes = ticketAdminDetails.querySelector("#ticket-detail-notes").value.trim();
  button.disabled = true;
  feedback.textContent = "Se salvează…";
  const ticketUpdate = { status, admin_notes: adminNotes || null, ...readStateUpdateForStatus(item.status, status) };
  const { data, error } = await supabase.from("tickets").update(ticketUpdate).eq("id", item.id).select("*, ticket_files(*)").single();
  button.disabled = false;
  if (error) {
    feedback.textContent = "Modificările nu au putut fi salvate.";
    console.error(error);
    return;
  }
  tickets = tickets.map(ticket => ticket.id === data.id ? data : ticket);
  syncTicketReadState(data);
  feedback.style.color = "var(--success)";
  feedback.textContent = "Modificările au fost salvate.";
  updateTicketSummary();
  renderTickets();
}

async function openTicketFile(path) {
  const feedback = ticketAdminDetails.querySelector("#ticket-detail-feedback");
  const { data, error } = await supabase.storage.from("ticket-files").createSignedUrl(path, 60);
  if (error || !data?.signedUrl) {
    feedback.textContent = "Fișierul nu a putut fi deschis.";
    console.error(error);
    return;
  }
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

async function openProof(path) {
  const feedback = document.querySelector("#detail-feedback");
  const { data, error } = await supabase.storage
    .from("application-proofs")
    .createSignedUrl(path, 60);

  if (error || !data?.signedUrl) {
    feedback.textContent = "Captura nu a putut fi deschisă.";
    console.error(error);
    return;
  }

  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

function exportCsv() {
  const rows = filteredApplications();
  const columns = ["created_at", "platform", "status", "first_name", "last_name", "email", "phone", "city", "vehicle", "courier_type", "nationality", "discovery_source", "desired_platforms", "message", "admin_notes"];
  const quote = value => {
    const raw = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const csv = [columns.join(","), ...rows.map(item => columns.map(column => quote(item[column])).join(","))].join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cereri-cibero-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportTicketsCsv() {
  const rows = filteredTickets();
  const columns = ["id", "created_at", "category", "request_type", "status", "first_name", "last_name", "phone", "email", "new_phone", "new_email", "new_iban", "new_city", "new_vehicle", "new_plate", "description", "wolt_app_phone", "wolt_courier_id", "wolt_email", "order_code", "declared_amount", "platforms", "inactive_start", "inactive_end", "notes", "admin_notes"];
  const quote = value => {
    const raw = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const csv = [columns.join(","), ...rows.map(item => columns.map(column => quote(item[column])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `tickete-cibero-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const data = new FormData(loginForm);
  loginButton.disabled = true;
  loginFeedback.textContent = "Se verifică accesul…";

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: String(data.get("email") ?? "").trim(),
    password: String(data.get("password") ?? ""),
  });

  if (error || !authData.user) {
    loginButton.disabled = false;
    loginFeedback.textContent = "Emailul sau parola nu sunt corecte.";
    return;
  }

  try {
    await openAccessProfile(authData.user, String(data.get("requested_role") ?? ""));
  } catch (adminError) {
    console.error(adminError);
    await supabase.auth.signOut();
    loginButton.disabled = false;
    loginFeedback.textContent = "Accesul administrativ nu a putut fi verificat.";
  }
});

logoutButton.addEventListener("click", async () => {
  await supabase.auth.signOut();
  applications = [];
  tickets = [];
  availability = [];
  availabilityDraft = { glovo: [], wolt: [] };
  duplicateAlerts = [];
  subfleetMessages = [];
  activeMessageSubfleetId = "";
  currentAdminUserId = "";
  subfleetPortal?.hideSubfleetPortal();
  availabilityDraftDirty = false;
  if (availabilityRealtimeChannel) {
    await supabase.removeChannel(availabilityRealtimeChannel);
    availabilityRealtimeChannel = null;
  }
  if (adminRealtimeChannel) {
    await supabase.removeChannel(adminRealtimeChannel);
    adminRealtimeChannel = null;
  }
  selectedApplicationIds.clear();
  loginForm.reset();
  showLogin();
});

refreshButton.addEventListener("click", loadApplications);
exportButton.addEventListener("click", exportCsv);
refreshTicketsButton.addEventListener("click", loadTickets);
exportTicketsButton.addEventListener("click", exportTicketsCsv);
addSubfleetButton.addEventListener("click", () => {
  createSubfleetFeedback.textContent = "";
  createSubfleetForm.reset();
  subfleetCreateDialog.showModal();
});
createSubfleetForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = createSubfleetForm.querySelector("button[type='submit']");
  const formData = new FormData(createSubfleetForm);
  button.disabled = true; createSubfleetFeedback.textContent = "Se creează sub-flota și contul de acces…";
  try {
    await manageSubfleetAccount({ action: "create_subfleet_with_account", name: String(formData.get("name") ?? ""), description: String(formData.get("description") ?? ""), display_name: String(formData.get("display_name") ?? ""), email: String(formData.get("email") ?? ""), password: String(formData.get("password") ?? "") });
    subfleetCreateDialog.close(); createSubfleetForm.reset(); setSubfleetsFeedback("Sub-flota și contul ei au fost create.", true); await loadSubfleets();
  } catch (error) { console.error(error); createSubfleetFeedback.textContent = "Sub-flota nu a putut fi creată. Verifică datele și încearcă din nou."; }
  finally { button.disabled = false; }
});
backToSubfleetsButton.addEventListener("click", () => setActiveAdminSection("subfleets-panel"));
[subfleetMemberSearch, subfleetMemberStatus].forEach(control => control.addEventListener("input", renderSubfleetMembers));
subfleetSearch.addEventListener("input", renderSubfleets);
adminDuplicateAlertBell.addEventListener("click", openDuplicateAlerts);
adminMessageBell.addEventListener("click", openAdminMessages);
adminMessageForm.addEventListener("submit", sendAdminMessage);
openSubfleetMessagesButton.addEventListener("click", async () => {
  if (!activeSubfleetId) return;
  await loadAdminMessages();
  await openAdminConversation(activeSubfleetId);
  if (!adminMessagesDialog.open) adminMessagesDialog.showModal();
});
renderAvailability();
availabilityEditors.forEach(editor => {
  const platform = editor.dataset.availabilityEditor;
  const cityInput = availabilityEditorField(platform, "city");
  const slotsInput = availabilityEditorField(platform, "slots");
  const suggestions = availabilityEditorField(platform, "city-suggestions");
  cityInput.addEventListener("input", () => {
    updateAvailabilitySlotsLabel(platform);
    renderAvailabilityCitySuggestions(platform);
  });
  cityInput.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      suggestions.hidden = true;
      cityInput.setAttribute("aria-expanded", "false");
      return;
    }
    if (event.key !== "Enter") return;
    const exactCity = canonicalAvailabilityCity(cityInput.value);
    const matches = exactCity ? [exactCity] : matchingAvailabilityCities(cityInput.value);
    if (matches.length !== 1) return;
    event.preventDefault();
    cityInput.value = matches[0];
    suggestions.hidden = true;
    cityInput.setAttribute("aria-expanded", "false");
    focusAvailabilitySlotsAfterCitySelection(platform);
  });
  slotsInput.addEventListener("keydown", event => {
    if (event.key === "Enter") { event.preventDefault(); addAvailabilityCity(platform); }
  });
  availabilityEditorField(platform, "add-city").addEventListener("click", () => addAvailabilityCity(platform));
});
resetAvailabilityDraftButton.addEventListener("click", resetAvailabilityDraft);
publishAvailabilityButton.addEventListener("click", openAvailabilityPublishDialog);
[ticketSearchFilter, ticketStatusFilter].forEach(control => control.addEventListener("input", renderTickets));
ticketWorkspaceTabs.forEach(tab => tab.addEventListener("click", () => setActiveTicketWorkspace(tab.dataset.ticketWorkspace)));
adminSectionTabs.forEach(tab => tab.addEventListener("click", () => {
  setActiveAdminSection(tab.dataset.adminSection);
  if (tab.dataset.adminSection === "subfleets-panel") void loadSubfleets();
}));
adminAreaTabs.forEach(tab => tab.addEventListener("click", () => setActiveAdminArea(tab.dataset.adminArea)));
selectAllApplications.addEventListener("change", () => {
  filteredApplications().forEach(item => {
    if (selectAllApplications.checked) selectedApplicationIds.add(item.id);
    else selectedApplicationIds.delete(item.id);
  });
  renderApplications();
});
deleteSelectedButton.addEventListener("click", openDeleteConfirmation);
cancelDeleteButton.addEventListener("click", () => { pendingTicketDeletion = null; deleteDialog.close(); });
confirmDeleteButton.addEventListener("click", () => pendingTicketDeletion ? deleteTicket(pendingTicketDeletion) : deleteSelectedApplications());
[searchFilter, statusFilter].forEach(control => control.addEventListener("input", renderApplications));
platformTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    activePlatform = tab.dataset.platformTab;
    platformTabs.forEach(candidate => {
      const isActive = candidate === tab;
      candidate.classList.toggle("active", isActive);
      candidate.setAttribute("aria-selected", String(isActive));
    });
    updateSummary();
    renderApplications();
  });
});
registrationTabs.forEach(tab => tab.addEventListener("click", () => {
  activeRegistrationView = tab.dataset.registrationView;
  if (activeRegistrationView !== "account_requests") activePlatform = "all";
  registrationTabs.forEach(candidate => {
    const active = candidate === tab;
    candidate.classList.toggle("active", active);
    candidate.setAttribute("aria-selected", String(active));
  });
  selectedApplicationIds.clear();
  updateSummary();
  renderApplications();
}));
document.addEventListener("click", event => {
  if (!event.target.closest("[data-ticket-status-combobox]")) closeTicketStatusMenus();
  if (!event.target.closest("[data-application-status-combobox]")) closeApplicationStatusMenus();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeTicketStatusMenus();
    closeApplicationStatusMenus();
  }
});
window.addEventListener("scroll", positionOpenStatusMenus, { passive: true });
window.addEventListener("resize", positionOpenStatusMenus);

const { data: { session } } = await supabase.auth.getSession();
if (!session?.user) {
  showLogin();
} else {
  try {
    await openAccessProfile(session.user);
  } catch (error) {
    console.error(error);
    showLogin("Accesul administrativ nu a putut fi verificat.");
  }
}
