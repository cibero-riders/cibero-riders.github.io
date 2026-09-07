import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

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

const ticketStatusLabels = {
  new: "Nou",
  reviewing: "În lucru",
  clarification: "Clarificare necesară",
  sent_to_platform: "Trimis platformei",
  approved: "Aprobat",
  rejected: "Respins",
  archived: "Arhivat",
};

const ticketStatusCycle = ["new", "reviewing", "clarification", "sent_to_platform", "approved", "archived"];

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
  deactivate_chas: "Dezactivează CASH", transfer_cont: "Transfer cont Wolt", other: "Altă problemă",
  suma_incorecta: "Sumă incorectă", lipsa_plata: "Plată lipsă", clarificare_decont: "Clarificare decont",
  alta_problema_plata: "Altă problemă cu plata", actualizare_documente: "Actualizare documente",
  problema_contract: "Problemă cu contractul", alta_problema_admin: "Altă problemă administrativă",
  comanda_anulata: "Comandă Glovo anulată", deconturi: "Deconturi", inactivitate: "Concediu/Inactivitate",
  problema_decontare: "Problemă cu decontarea", trimite_bonuri_pdf: "Trimitere bonuri PDF",
};

const sessionLoading = document.querySelector("#session-loading");
const loginView = document.querySelector("#login-view");
const dashboardView = document.querySelector("#dashboard-view");
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
const refreshTicketsButton = document.querySelector("#refresh-tickets-button");
const ticketsFeedback = document.querySelector("#tickets-feedback");
const ticketsList = document.querySelector("#tickets-list");
const ticketsEmptyState = document.querySelector("#tickets-empty-state");
const ticketSearchFilter = document.querySelector("#ticket-search-filter");
const ticketStatusFilter = document.querySelector("#ticket-status-filter");
const ticketCategoryTabs = [...document.querySelectorAll("[data-ticket-category-tab]")];
const exportTicketsButton = document.querySelector("#export-tickets-button");
const ticketAdminDialog = document.querySelector("#ticket-admin-dialog");
const ticketAdminDetails = document.querySelector("#ticket-admin-details");
const ticketDeleteHeader = document.querySelector("#delete-ticket-header");

let applications = [];
let activePlatform = "wolt";
const selectedApplicationIds = new Set();
let tickets = [];
let activeTicketCategory = "bolt";
let pendingTicketDeletion = null;
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

function showLogin(message = "") {
  sessionLoading.hidden = true;
  loginView.hidden = false;
  dashboardView.hidden = true;
  logoutButton.hidden = true;
  loginButton.disabled = false;
  loginFeedback.textContent = message;
}

function showDashboard() {
  sessionLoading.hidden = true;
  loginView.hidden = true;
  dashboardView.hidden = false;
  logoutButton.hidden = false;
  loginForm.reset();
  loginFeedback.textContent = "";
}

async function isAdmin(userId) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
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
}

async function loadTickets() {
  ticketsFeedback.classList.remove("success");
  ticketsFeedback.textContent = "Se încarcă ticketele…";
  refreshTicketsButton.disabled = true;
  const { data, error } = await supabase
    .from("tickets")
    .select("*, ticket_files(*)")
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
  const categoryTickets = tickets.filter(item => item.category === activeTicketCategory);
  ticketCategoryTabs.forEach(tab => {
    const category = tab.dataset.ticketCategoryTab;
    const count = document.querySelector(`#ticket-category-count-${category}`);
    const unreadCount = tickets.filter(item => item.category === category && !isTicketRead(item)).length;
    if (count) {
      count.textContent = unreadCount;
      count.hidden = unreadCount === 0;
    }
    tab.classList.toggle("has-unread", unreadCount > 0);
  });
  document.querySelector("#tickets-total-count").textContent = categoryTickets.length;
  document.querySelector("#tickets-new-count").textContent = categoryTickets.filter(item => item.status === "new").length;
  document.querySelector("#tickets-reviewing-count").textContent = categoryTickets.filter(item => ["reviewing", "clarification", "sent_to_platform"].includes(item.status)).length;
  document.querySelector("#tickets-approved-count").textContent = categoryTickets.filter(item => item.status === "approved").length;
}

function filteredTickets() {
  const query = ticketSearchFilter.value.trim().toLocaleLowerCase("ro-RO");
  const status = ticketStatusFilter.value;
  return tickets.filter(item => {
    const reference = item.id.slice(0, 8).toUpperCase();
    const haystack = [reference, item.first_name, item.last_name, item.email, item.phone, ticketTypeLabels[item.request_type]].join(" ").toLocaleLowerCase("ro-RO");
    return item.category === activeTicketCategory && (!query || haystack.includes(query)) && (!status || item.status === status);
  });
}

function nextTicketStatus(status) {
  if (status === "rejected") return "archived";
  const currentIndex = ticketStatusCycle.indexOf(status);
  return ticketStatusCycle[(currentIndex + 1 + ticketStatusCycle.length) % ticketStatusCycle.length];
}

function renderTickets() {
  const rows = filteredTickets();
  ticketsList.innerHTML = rows.map(item => `
    <div class="ticket-row${isTicketRead(item) ? "" : " unread"}">
      <button class="ticket-open" type="button" data-ticket-id="${escapeHtml(item.id)}" aria-label="Deschide ticketul #${escapeHtml(item.id.slice(0, 8).toUpperCase())}">
        <span class="ticket-reference-small">#${escapeHtml(item.id.slice(0, 8).toUpperCase())}</span>
        <span class="date">${escapeHtml(formatDate(item.created_at))}</span>
        <span class="platform">${escapeHtml(ticketCategoryLabels[item.category] ?? item.category)}</span>
        <strong class="identity">${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</strong>
        <span class="ticket-type">${escapeHtml(ticketTypeLabels[item.request_type] ?? item.request_type)}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>
      <button class="ticket-status-cycle status-pill" type="button" data-ticket-status-cycle="${escapeHtml(item.id)}" data-status="${escapeHtml(item.status)}" title="Următorul status: ${escapeHtml(ticketStatusLabels[nextTicketStatus(item.status)])}" aria-label="Status curent: ${escapeHtml(ticketStatusLabels[item.status] ?? item.status)}. Apasă pentru: ${escapeHtml(ticketStatusLabels[nextTicketStatus(item.status)])}">
        <span class="status-current">${escapeHtml(ticketStatusLabels[item.status] ?? item.status)}</span>
        <span class="status-next">${escapeHtml(ticketStatusLabels[nextTicketStatus(item.status)])} <b aria-hidden="true">→</b></span>
      </button>
    </div>
  `).join("");
  ticketsEmptyState.hidden = rows.length > 0;
  ticketsEmptyState.textContent = `Nu există tickete în categoria ${ticketCategoryLabels[activeTicketCategory] ?? activeTicketCategory} pentru filtrele selectate.`;
  ticketsList.querySelectorAll("[data-ticket-id]").forEach(button => button.addEventListener("click", () => openTicket(button.dataset.ticketId)));
  ticketsList.querySelectorAll("[data-ticket-status-cycle]").forEach(button => button.addEventListener("click", () => advanceTicketStatus(button.dataset.ticketStatusCycle, button)));
}

function updateSummary() {
  const platformApplications = applications.filter(item => item.platform === activePlatform);
  platformTabs.forEach(tab => {
    const platform = tab.dataset.platformTab;
    const unreadCount = applications.filter(item => item.platform === platform && !isApplicationRead(item)).length;
    const count = tab.querySelector("span");
    count.textContent = unreadCount;
    count.hidden = unreadCount === 0;
    tab.classList.toggle("has-unread", unreadCount > 0);
  });
  document.querySelector("#total-count").textContent = platformApplications.length;
  document.querySelector("#new-count").textContent = platformApplications.filter(item => item.status === "new").length;
  document.querySelector("#reviewing-count").textContent = platformApplications.filter(item => item.status === "reviewing").length;
  document.querySelector("#activated-count").textContent = platformApplications.filter(item => item.status === "activated").length;
}

function filteredApplications() {
  const query = searchFilter.value.trim().toLocaleLowerCase("ro-RO");
  const status = statusFilter.value;

  return applications.filter(item => {
    const haystack = [item.first_name, item.last_name, item.email, item.phone, item.city]
      .join(" ")
      .toLocaleLowerCase("ro-RO");
    return item.platform === activePlatform &&
      (!query || haystack.includes(query)) &&
      (!status || item.status === status);
  });
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
        <span class="platform">${escapeHtml(item.platform)}</span>
        <strong class="identity">${escapeHtml(item.first_name)} ${escapeHtml(item.last_name)}</strong>
        <span class="city">${escapeHtml(item.city)}</span>
        <span class="status-pill" data-status="${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] ?? item.status)}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>
    </div>
  `).join("");

  emptyState.hidden = rows.length > 0;
  emptyState.textContent = `Nu există cereri ${activePlatform === "wolt" ? "Wolt" : "Glovo"} pentru filtrele selectate.`;
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
  updateSelectionControls(rows);
}

function detailField(label, value, full = false) {
  return `<div class="detail-field${full ? " full" : ""}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "—")}</strong></div>`;
}

async function openApplication(id) {
  const item = applications.find(application => application.id === id);
  if (!item) return;

  applicationDetails.innerHTML = `
    <div class="detail-grid">
      ${detailField("Platformă", item.platform.toUpperCase())}
      ${detailField("Status", statusLabels[item.status] ?? item.status)}
      ${detailField("Prenume", item.first_name)}
      ${detailField("Nume", item.last_name)}
      ${detailField("Email", item.email)}
      ${detailField("Telefon", item.phone)}
      ${detailField("Oraș", item.city)}
      ${detailField("Vehicul", item.vehicle)}
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

  const { data, error } = await supabase
    .from("applications")
    .update({ status, admin_notes: adminNotes || null })
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
  feedback.style.color = "var(--success)";
  feedback.textContent = "Modificările au fost salvate.";
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

async function openTicket(id) {
  const item = tickets.find(ticket => ticket.id === id);
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
      ${detailField("Categorie", ticketCategoryLabels[item.category] ?? item.category)}
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

async function advanceTicketStatus(id, button) {
  const item = tickets.find(ticket => ticket.id === id);
  if (!item || button.disabled) return;

  const nextStatus = nextTicketStatus(item.status);
  button.disabled = true;
  ticketsFeedback.classList.remove("success");
  ticketsFeedback.textContent = `Se schimbă statusul în „${ticketStatusLabels[nextStatus]}”…`;

  const { data, error } = await supabase
    .from("tickets")
    .update({ status: nextStatus })
    .eq("id", item.id)
    .select("*, ticket_files(*)")
    .single();

  if (error) {
    button.disabled = false;
    ticketsFeedback.textContent = "Statusul nu a putut fi modificat.";
    console.error(error);
    return;
  }

  tickets = tickets.map(ticket => ticket.id === data.id ? data : ticket);
  ticketsFeedback.classList.add("success");
  ticketsFeedback.textContent = `Status actualizat: ${ticketStatusLabels[nextStatus]}.`;
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
  const { data, error } = await supabase.from("tickets").update({ status, admin_notes: adminNotes || null }).eq("id", item.id).select("*, ticket_files(*)").single();
  button.disabled = false;
  if (error) {
    feedback.textContent = "Modificările nu au putut fi salvate.";
    console.error(error);
    return;
  }
  tickets = tickets.map(ticket => ticket.id === data.id ? data : ticket);
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
  const columns = ["created_at", "platform", "status", "first_name", "last_name", "email", "phone", "city", "vehicle", "message", "admin_notes"];
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
    if (!await isAdmin(authData.user.id)) {
      await supabase.auth.signOut();
      loginButton.disabled = false;
      loginFeedback.textContent = "Acest utilizator nu are acces administrativ.";
      return;
    }
    showDashboard();
    await Promise.all([loadApplications(), loadTickets()]);
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
  selectedApplicationIds.clear();
  loginForm.reset();
  showLogin();
});

refreshButton.addEventListener("click", loadApplications);
exportButton.addEventListener("click", exportCsv);
refreshTicketsButton.addEventListener("click", loadTickets);
exportTicketsButton.addEventListener("click", exportTicketsCsv);
[ticketSearchFilter, ticketStatusFilter].forEach(control => control.addEventListener("input", renderTickets));
ticketCategoryTabs.forEach(tab => tab.addEventListener("click", () => {
  activeTicketCategory = tab.dataset.ticketCategoryTab;
  ticketCategoryTabs.forEach(candidate => {
    const active = candidate === tab;
    candidate.classList.toggle("active", active);
    candidate.setAttribute("aria-selected", String(active));
  });
  updateTicketSummary();
  renderTickets();
}));
adminSectionTabs.forEach(tab => tab.addEventListener("click", () => {
  adminSectionTabs.forEach(candidate => {
    const active = candidate === tab;
    candidate.classList.toggle("active", active);
    candidate.setAttribute("aria-selected", String(active));
    document.querySelector(`#${candidate.dataset.adminSection}`).hidden = !active;
  });
}));
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

const { data: { session } } = await supabase.auth.getSession();
if (!session?.user) {
  showLogin();
} else {
  try {
    if (await isAdmin(session.user.id)) {
      showDashboard();
      await Promise.all([loadApplications(), loadTickets()]);
    } else {
      await supabase.auth.signOut();
      showLogin("Acest utilizator nu are acces administrativ.");
    }
  } catch (error) {
    console.error(error);
    showLogin("Accesul administrativ nu a putut fi verificat.");
  }
}
