import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://xpzgvknnrkyvcnncfqrq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const containers = { glovo: document.querySelector("#glovo-slots"), wolt: document.querySelector("#wolt-slots") };
const citySearches = { glovo: document.querySelector("#glovo-city-search"), wolt: document.querySelector("#wolt-city-search") };
const updatedLabel = document.querySelector("#availability-updated");
const names = { glovo: "Glovo", wolt: "Wolt" };
const applicationDialog = document.querySelector("#application-confirmation-dialog");
const confirmationKicker = document.querySelector("#confirmation-platform-kicker");
const confirmationTitle = document.querySelector("#confirmation-platform-title");
const confirmationInline = document.querySelector("#confirmation-platform-inline");
const confirmationCheck = document.querySelector("#application-confirmation-check");
const goToApplicationForm = document.querySelector("#go-to-application-form");
let selectedApplicationPlatform = "";
let availabilityRows = [];

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function normalizeSearch(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("ro-RO");
}

function render(platform, rows) {
  const query = normalizeSearch(citySearches[platform].value.trim());
  const filteredRows = query ? rows.filter(row => normalizeSearch(row.city).includes(query)) : rows;
  if (!filteredRows.length) {
    containers[platform].innerHTML = `<p class="slots-empty">${query ? "Nu există un oraș disponibil care corespunde căutării." : `Momentan nu sunt locuri disponibile la ${names[platform]}.`}</p>`;
    return;
  }
  containers[platform].innerHTML = filteredRows.map(row => `<article class="slot-row"><strong class="slot-city">${escapeHtml(row.city)}</strong><span class="slot-count">${row.slots} ${row.slots === 1 ? "loc" : "locuri"}</span></article>`).join("");
}

function renderAvailabilityRows() {
  render("glovo", availabilityRows.filter(row => row.platform === "glovo"));
  render("wolt", availabilityRows.filter(row => row.platform === "wolt"));
}

async function loadAvailability() {
  const { data, error } = await supabase.from("available_slots").select("platform, city, slots, sort_order, updated_at").order("platform").order("sort_order").order("city");
  if (error) {
    console.error(error);
    Object.values(containers).forEach(container => { container.innerHTML = '<p class="slots-empty">Disponibilitatea nu poate fi afișată momentan.</p>'; });
    updatedLabel.textContent = "";
    return;
  }
  availabilityRows = data ?? [];
  renderAvailabilityRows();
  const latest = availabilityRows.map(row => row.updated_at).filter(Boolean).sort().at(-1);
  updatedLabel.textContent = latest ? `Actualizat: ${new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(latest))}` : "";
}

await loadAvailability();
supabase.channel("cibero-public-availability").on("postgres_changes", { event: "*", schema: "public", table: "available_slots" }, loadAvailability).subscribe();
Object.values(citySearches).forEach(search => search.addEventListener("input", renderAvailabilityRows));

document.querySelectorAll("[data-application-platform]").forEach(button => button.addEventListener("click", () => {
  selectedApplicationPlatform = button.dataset.applicationPlatform;
  const platform = names[selectedApplicationPlatform];
  confirmationKicker.textContent = platform;
  confirmationTitle.textContent = platform;
  confirmationInline.textContent = platform;
  confirmationCheck.checked = false;
  goToApplicationForm.disabled = true;
  applicationDialog.showModal();
}));

confirmationCheck.addEventListener("change", () => { goToApplicationForm.disabled = !confirmationCheck.checked; });
goToApplicationForm.addEventListener("click", () => {
  if (!selectedApplicationPlatform || !confirmationCheck.checked) return;
  window.location.assign(`../deschide-cont.html?platform=${encodeURIComponent(selectedApplicationPlatform)}`);
});
