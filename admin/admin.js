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

let applications = [];
let activePlatform = "wolt";
const selectedApplicationIds = new Set();

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

function updateSummary() {
  const platformApplications = applications.filter(item => item.platform === activePlatform);
  document.querySelector("#wolt-tab-count").textContent = applications.filter(item => item.platform === "wolt").length;
  document.querySelector("#glovo-tab-count").textContent = applications.filter(item => item.platform === "glovo").length;
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
    <div class="application-row${selectedApplicationIds.has(item.id) ? " selected" : ""}" data-application-row="${escapeHtml(item.id)}">
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
  deleteDialogTitle.textContent = count === 1 ? "Ștergi cererea selectată?" : "Ștergi cererile selectate?";
  deleteDialogCopy.textContent = count === 1
    ? "Cererea selectată și captura asociată vor fi șterse definitiv. Acțiunea nu poate fi anulată."
    : `Cele ${count} cereri selectate și capturile asociate vor fi șterse definitiv. Acțiunea nu poate fi anulată.`;
  deleteFeedback.textContent = "";
  confirmDeleteButton.disabled = false;
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
    await loadApplications();
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
  selectedApplicationIds.clear();
  loginForm.reset();
  showLogin();
});

refreshButton.addEventListener("click", loadApplications);
exportButton.addEventListener("click", exportCsv);
selectAllApplications.addEventListener("change", () => {
  filteredApplications().forEach(item => {
    if (selectAllApplications.checked) selectedApplicationIds.add(item.id);
    else selectedApplicationIds.delete(item.id);
  });
  renderApplications();
});
deleteSelectedButton.addEventListener("click", openDeleteConfirmation);
cancelDeleteButton.addEventListener("click", () => deleteDialog.close());
confirmDeleteButton.addEventListener("click", deleteSelectedApplications);
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
      await loadApplications();
    } else {
      await supabase.auth.signOut();
      showLogin("Acest utilizator nu are acces administrativ.");
    }
  } catch (error) {
    console.error(error);
    showLogin("Accesul administrativ nu a putut fi verificat.");
  }
}
