const choiceDialog = document.querySelector("#onboarding-choice-dialog");
const guideDialog = document.querySelector("#onboarding-dialog");
const choiceStart = document.querySelector("#onboarding-choice-start");
const choiceSkip = document.querySelector("#onboarding-choice-skip");
const roleLabel = document.querySelector("#onboarding-role-label");
const stepLabel = document.querySelector("#onboarding-step-label");
const stage = document.querySelector("#onboarding-stage");
const content = document.querySelector("#onboarding-content");
const spotlight = document.querySelector("#onboarding-spotlight");
const arrow = document.querySelector("#onboarding-arrow");
const backButton = document.querySelector("#onboarding-back");
const nextButton = document.querySelector("#onboarding-next");

const guides = {
  admin: {
    label: "GHID ADMIN CIBERO",
    steps: [
      { icon: "⌑", target: '[data-admin-section="applications-panel"]', title: "Registrul central", text: "Aici gestionezi toate înregistrările. PFA și SRL rămân la CibeRO, iar Curier nou și Curier cu experiență intră în pool-ul sub-flotelor.", points: ["Folosește tab-urile pentru PFA, SRL și Cereri Wolt/Glovo.", "Tab-ul Sub-Flote arată cererile care pot fi revendicate."] },
      { icon: "✦", target: '[data-admin-section="tickets-panel"]', prepare: '[data-admin-section="tickets-panel"]', title: "Coada centrală de tickete", text: "Aici rămân numai ticketele gestionate de CibeRO. Un ticket al unui membru revendicat este direcționat exclusiv la sub-flota lui.", points: ["Folosește arborele pentru platforme și tipuri de solicitări.", "Alertele de dubluri sunt separate, în partea de sus."] },
      { icon: "⌘", target: '[data-admin-area="subfleets"]', prepare: '[data-admin-area="subfleets"]', title: "Spațiul Sub-Flote", text: "De aici creezi conturi, verifici activitatea fiecărei echipe și intri în detaliile membrilor revendicați.", points: ["Caută o sub-flotă după nume.", "O cerere care rămâne Nouă 24 de ore revine automat în pool."] },
      { icon: "✉", target: "#admin-message-bell", title: "Inboxul CibeRO", text: "Clopoțelul deschide conversațiile cu sub-flotele. Poți citi istoricul și răspunde direct în același fir de mesaje.", points: ["Numărul arată mesajele necitite.", "Mesajele sunt private între CibeRO și sub-flota aleasă."] },
    ],
  },
  subfleet: {
    label: "GHID PORTAL SUB-FLOTĂ",
    steps: [
      { icon: "⌑", target: "#subfleet-pool-toolbar", prepare: '[data-subfleet-tab="pool"]', title: "Pool-ul de activări", text: "Aici apar doar Curier nou și Curier cu experiență. Sortează după timpul trimiterii și revendică activările potrivite pentru echipa ta.", points: ["Datele de contact devin vizibile după revendicare.", "PFA și SRL sunt gestionate exclusiv de CibeRO."] },
      { icon: "24", target: "#subfleet-status-tabs", prepare: '[data-subfleet-tab="claimed"]', title: "Regula de 24 de ore", text: "După revendicare, schimbă statusul cererii din Nouă în maximum 24 de ore. În caz contrar, cererea revine automat în pool.", points: ["În verificare arată că ai început prelucrarea.", "Arhiva păstrează separat cererile închise."] },
      { icon: "✓", target: '[data-subfleet-tab="claimed"]', prepare: '[data-subfleet-tab="claimed"]', title: "Membrii tăi", text: "Deschide un membru pentru datele complete din formular, apoi actualizează-i statusul direct din listă.", points: ["Sub-taburile organizează membrii pe status.", "Un status Nouă marchează cererea din nou ca de revizuit."] },
      { icon: "✦", target: "#subfleet-ticket-navigation", prepare: '[data-subfleet-tab="tickets"]', title: "Tickete direcționate", text: "Când un curier revendicat trimite un ticket cu emailul sau telefonul său, acesta ajunge doar aici — niciodată în coada CibeRO.", points: ["Arborele de tab-uri indică ramurile cu tickete noi.", "Actualizează statusul ticketului pe măsură ce îl procesezi."] },
      { icon: "✉", target: "#subfleet-message-bell", title: "Mesaje cu CibeRO", text: "Clopoțelul este conversația directă cu CibeRO. Mesajele rămân în istoric și pot fi citite sau continuate oricând.", points: ["Numărul arată mesajele necitite.", "Deschiderea inboxului marchează mesajele ca citite."] },
    ],
  },
};

let activeGuide = null;
let activeStep = 0;
let guideIsMandatory = false;
let positionTimer = null;

function targetForStep() {
  return document.querySelector(guides[activeGuide]?.steps[activeStep]?.target ?? "");
}

function prepareStep(step) {
  const control = step.prepare ? document.querySelector(step.prepare) : null;
  if (control && control.getAttribute("aria-selected") !== "true" && !control.classList.contains("active")) control.click();
}

function positionTour() {
  if (!guideDialog.open || !activeGuide) return;
  const target = targetForStep();
  if (!target) return;
  const targetBox = target.getBoundingClientRect();
  const padding = 8;
  spotlight.style.left = `${Math.max(4, targetBox.left - padding)}px`;
  spotlight.style.top = `${Math.max(4, targetBox.top - padding)}px`;
  spotlight.style.width = `${Math.min(window.innerWidth - 8, targetBox.width + padding * 2)}px`;
  spotlight.style.height = `${Math.min(window.innerHeight - 8, targetBox.height + padding * 2)}px`;

  content.style.visibility = "hidden";
  content.style.left = "16px";
  content.style.top = "16px";
  const contentBox = content.getBoundingClientRect();
  const targetCenterX = targetBox.left + targetBox.width / 2;
  const targetCenterY = targetBox.top + targetBox.height / 2;
  const placeRight = targetCenterX < window.innerWidth * .52;
  const left = placeRight
    ? Math.min(window.innerWidth - contentBox.width - 16, targetBox.right + 34)
    : Math.max(16, targetBox.left - contentBox.width - 34);
  const canPlaceBelow = targetBox.bottom + contentBox.height + 34 < window.innerHeight;
  const top = canPlaceBelow
    ? Math.max(16, targetBox.bottom + 34)
    : Math.max(16, Math.min(window.innerHeight - contentBox.height - 16, targetBox.top - contentBox.height - 34));
  content.style.left = `${left}px`;
  content.style.top = `${top}px`;
  content.style.visibility = "visible";

  const finalBox = content.getBoundingClientRect();
  const contentIsRightOfTarget = finalBox.left >= targetBox.right;
  const startX = contentIsRightOfTarget ? finalBox.left : finalBox.right;
  const startY = Math.max(finalBox.top + 30, Math.min(targetCenterY, finalBox.bottom - 30));
  const endX = targetCenterX;
  const endY = targetCenterY;
  const length = Math.max(28, Math.hypot(endX - startX, endY - startY) - 14);
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  arrow.style.left = `${startX}px`;
  arrow.style.top = `${startY}px`;
  arrow.style.width = `${length}px`;
  arrow.style.transform = `rotate(${angle}deg)`;
}

function schedulePositionTour() {
  window.clearTimeout(positionTimer);
  requestAnimationFrame(positionTour);
  positionTimer = window.setTimeout(positionTour, 260);
}

function renderGuide() {
  const guide = guides[activeGuide];
  const step = guide.steps[activeStep];
  roleLabel.textContent = guide.label;
  stepLabel.textContent = `${activeStep + 1} / ${guide.steps.length}`;
  stage.innerHTML = `<span class="onboarding-icon" aria-hidden="true">${step.icon}</span><h2 id="onboarding-title">${step.title}</h2><p>${step.text}</p><ul>${step.points.map(point => `<li>${point}</li>`).join("")}</ul>`;
  backButton.hidden = activeStep === 0;
  nextButton.textContent = activeStep === guide.steps.length - 1 ? "Încheie ghidul" : "Următorul pas";
  prepareStep(step);
  targetForStep()?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  schedulePositionTour();
}

function openGuide(role, mandatory) {
  activeGuide = role;
  activeStep = 0;
  guideIsMandatory = mandatory;
  guideDialog.showModal();
  renderGuide();
}

function closeGuide() {
  window.clearTimeout(positionTimer);
  guideDialog.close();
  activeGuide = null;
  activeStep = 0;
  guideIsMandatory = false;
}

choiceStart.addEventListener("click", () => {
  const role = choiceDialog.dataset.role;
  choiceDialog.close();
  openGuide(role, false);
});
choiceSkip.addEventListener("click", () => choiceDialog.close());
backButton.addEventListener("click", () => {
  if (!activeGuide || activeStep === 0) return;
  activeStep -= 1;
  renderGuide();
});
nextButton.addEventListener("click", () => {
  const stepCount = guides[activeGuide]?.steps.length ?? 0;
  if (activeStep < stepCount - 1) {
    activeStep += 1;
    renderGuide();
    return;
  }
  closeGuide();
});
choiceDialog.addEventListener("cancel", event => event.preventDefault());
guideDialog.addEventListener("cancel", event => {
  if (guideIsMandatory) event.preventDefault();
  else {
    event.preventDefault();
    closeGuide();
  }
});
window.addEventListener("resize", schedulePositionTour);
window.addEventListener("scroll", schedulePositionTour, { passive: true });

export function showAccountGuide(profile) {
  const role = profile?.role === "subfleet" ? "subfleet" : "admin";
  const loginCount = Number(profile?.onboarding_login_count ?? 1);
  if (loginCount <= 1) openGuide(role, true);
  else if (loginCount <= 3) {
    choiceDialog.dataset.role = role;
    choiceDialog.showModal();
  }
}
