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
      { icon: "⌑", target: '[data-admin-section="applications-panel"]', title: "Registrul central", text: "Verifică înscrierile și filtrează-le după tip." },
      { icon: "✦", target: '[data-admin-section="tickets-panel"]', prepare: '[data-admin-section="tickets-panel"]', title: "Tickete CibeRO", text: "Aici rămân doar ticketele gestionate de CibeRO." },
      { icon: "⌘", target: '.admin-space-tabs [data-admin-area="subfleets"]', prepare: '.admin-space-tabs [data-admin-area="subfleets"]', title: "Sub-Flote", text: "Creezi conturi și urmărești activitatea echipelor." },
      { icon: "✉", target: "#admin-message-bell", title: "Inboxul CibeRO", text: "Deschide conversațiile și răspunde direct sub-flotelor." },
    ],
  },
  subfleet: {
    label: "GHID PORTAL SUB-FLOTĂ",
    steps: [
      { icon: "⌑", target: "#subfleet-pool-toolbar", prepare: '[data-subfleet-tab="pool"]', title: "Activări disponibile", text: "Sortează și revendică activările potrivite." },
      { icon: "24", target: "#subfleet-status-tabs", prepare: '[data-subfleet-tab="claimed"]', title: "Regula de 24 de ore", text: "Schimbă statusul unei revendicări în cel mult 24 de ore." },
      { icon: "✓", target: '[data-subfleet-tab="claimed"]', prepare: '[data-subfleet-tab="claimed"]', title: "Membrii tăi", text: "Deschide membrul și actualizează-i statusul." },
      { icon: "✦", target: '[data-subfleet-tab="tickets"]', prepare: '[data-subfleet-tab="tickets"]', title: "Tickete direcționate", text: "Procesează aici ticketele membrilor revendicați." },
      { icon: "✉", target: "#subfleet-message-bell", title: "Mesaje cu CibeRO", text: "Conversația rămâne în același fir de mesaje." },
    ],
  },
};

let activeGuide = null;
let activeStep = 0;
let guideIsMandatory = false;
let positionTimer = null;

function setTourScrollLock(locked) {
  document.documentElement.classList.toggle("onboarding-tour-active", locked);
  document.body.classList.toggle("onboarding-tour-active", locked);
}

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

function revealTarget() {
  const target = targetForStep();
  if (!target) return schedulePositionTour();
  setTourScrollLock(false);
  target.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setTourScrollLock(true);
    positionTour();
  }));
}

function renderGuide() {
  const guide = guides[activeGuide];
  const step = guide.steps[activeStep];
  roleLabel.textContent = guide.label;
  stepLabel.textContent = `${activeStep + 1} / ${guide.steps.length}`;
  stage.innerHTML = `<span class="onboarding-icon" aria-hidden="true">${step.icon}</span><h2 id="onboarding-title">${step.title}</h2><p>${step.text}</p>`;
  backButton.hidden = activeStep === 0;
  nextButton.textContent = activeStep === guide.steps.length - 1 ? "Încheie ghidul" : "Următorul pas";
  prepareStep(step);
  revealTarget();
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
  setTourScrollLock(false);
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

export function showAccountGuide(profile) {
  const role = profile?.role === "subfleet" ? "subfleet" : "admin";
  const loginCount = Number(profile?.onboarding_login_count ?? 1);
  // During the current testing phase, show the contextual tour at every login.
  // Only a brand-new account must finish it without closing it.
  openGuide(role, loginCount <= 1);
}
