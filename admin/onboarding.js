const choiceDialog = document.querySelector("#onboarding-choice-dialog");
const guideDialog = document.querySelector("#onboarding-dialog");
const choiceStart = document.querySelector("#onboarding-choice-start");
const choiceSkip = document.querySelector("#onboarding-choice-skip");
const roleLabel = document.querySelector("#onboarding-role-label");
const stepLabel = document.querySelector("#onboarding-step-label");
const stage = document.querySelector("#onboarding-stage");
const content = document.querySelector("#onboarding-content");
const spotlight = document.querySelector("#onboarding-spotlight");
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
      { target: '[data-subfleet-tab="pool"]', prepare: '[data-subfleet-tab="pool"]', title: "Activări disponibile", text: "În acest tab vezi lista cu cererile de activare actualizată în timp real. Cererile ajung instant, cum sunt trimise de aplicanți." },
      { target: '[data-subfleet-tab="claimed"]', prepare: '[data-subfleet-tab="claimed"]', title: "Revendicări", text: "Aici vezi toți membrii pe care i-ai revendicat, cu status „Nou”. După ce avansezi cu procesarea, poți modifica statusul cererii pentru a o muta într-un alt tab." },
      { target: '[data-subfleet-tab="tickets"]', prepare: '[data-subfleet-tab="tickets"]', title: "Tickete", text: "Aici primești ticketele de la curierii tăi." },
      { target: "#subfleet-ticket-display-switch", prepare: '[data-subfleet-tab="tickets"]', title: "Afișarea ticketelor", text: "Alege dacă vezi ticketele organizate sau toate la grămadă." },
      { statusExample: true, prepare: '[data-subfleet-tab="claimed"]', title: "Statusul cererii", text: "De aici poți schimba statusul unei cereri pentru a ține evidența progresului. Când schimbi statusul, cererea se mută în sub-tab-ul corespunzător. Dacă statusul nu avansează în 24 de ore, cererea se va întoarce în pool." },
      { target: "#subfleet-message-bell", title: "Chat cu adminul", text: "De aici poți accesa chat-ul cu adminul." },
    ],
  },
};

let activeGuide = null;
let activeStep = 0;
let guideIsMandatory = false;
let positionTimer = null;
let typingStartTimer = null;
let typingTimer = null;

function setTourScrollLock(locked) {
  document.documentElement.classList.toggle("onboarding-tour-active", locked);
  document.body.classList.toggle("onboarding-tour-active", locked);
}

function removeStatusTourExample() {
  const example = document.querySelector("#onboarding-status-example");
  if (!example) return;
  const empty = document.querySelector("#subfleet-empty");
  if (empty) empty.hidden = example.dataset.emptyWasHidden === "true";
  example.remove();
}

function statusTargetForTour() {
  const demonstration = document.querySelector("#onboarding-status-target");
  if (demonstration) return demonstration;
  const existing = document.querySelector("#subfleet-list [data-application-status]");
  if (existing) return existing;
  const list = document.querySelector("#subfleet-list");
  const empty = document.querySelector("#subfleet-empty");
  if (!list) return null;
  const example = document.createElement("article");
  example.id = "onboarding-status-example";
  example.className = "subfleet-row claimed-member-row onboarding-status-example";
  example.dataset.emptyWasHidden = String(empty?.hidden ?? true);
  example.setAttribute("aria-label", "Exemplu de cerere afișat doar în ghid");
  example.innerHTML = '<div class="subfleet-member-open"><span><strong>Exemplu curier</strong><small>cerere demonstrativă · București</small><small>Wolt · revendicată acum</small></span><b aria-hidden="true">→</b></div><select id="onboarding-status-target" aria-label="Exemplu status cerere"><option>Nouă</option><option>În verificare</option><option>Trimisă platformei</option><option>Activată</option></select>';
  list.prepend(example);
  if (empty) empty.hidden = true;
  return example.querySelector("#onboarding-status-target");
}

function targetForStep() {
  const step = guides[activeGuide]?.steps[activeStep];
  return step?.statusExample ? statusTargetForTour() : document.querySelector(step?.target ?? "");
}

function prepareStep(step) {
  const control = step.prepare ? document.querySelector(step.prepare) : null;
  if (control && control.getAttribute("aria-selected") !== "true" && !control.classList.contains("active")) control.click();
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
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
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const targetCenterX = targetBox.left + targetBox.width / 2;
  const targetCenterY = targetBox.top + targetBox.height / 2;
  const edgeGap = 46;
  const pageMargin = 16;
  const availableRight = viewportWidth - targetBox.right - edgeGap - pageMargin;
  const availableLeft = targetBox.left - edgeGap - pageMargin;
  const canPlaceBeside = Math.max(availableRight, availableLeft) >= contentBox.width;
  let left;
  let top;

  if (canPlaceBeside) {
    const placeRight = availableRight >= contentBox.width || availableRight >= availableLeft;
    left = placeRight ? targetBox.right + edgeGap : targetBox.left - contentBox.width - edgeGap;
    top = clamp(targetCenterY - contentBox.height / 2, pageMargin, viewportHeight - contentBox.height - pageMargin);
  } else {
    const availableBelow = viewportHeight - targetBox.bottom - edgeGap - pageMargin;
    const availableAbove = targetBox.top - edgeGap - pageMargin;
    const placeBelow = availableBelow >= contentBox.height || availableBelow >= availableAbove;
    left = clamp(targetCenterX - contentBox.width / 2, pageMargin, viewportWidth - contentBox.width - pageMargin);
    top = placeBelow ? targetBox.bottom + edgeGap : targetBox.top - contentBox.height - edgeGap;
    top = clamp(top, pageMargin, viewportHeight - contentBox.height - pageMargin);
  }

  content.style.left = `${left}px`;
  content.style.top = `${top}px`;
  content.style.visibility = "visible";

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

function stopTypewriter() {
  window.clearTimeout(typingStartTimer);
  window.clearInterval(typingTimer);
  typingStartTimer = null;
  typingTimer = null;
}

function typewriteDescription(text) {
  const paragraph = stage.querySelector("[data-onboarding-description]");
  if (!paragraph) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    paragraph.textContent = text;
    return;
  }

  const characters = Array.from(text);
  let characterIndex = 0;
  paragraph.textContent = "";
  paragraph.classList.add("typing");
  typingTimer = window.setInterval(() => {
    paragraph.textContent += characters[characterIndex] ?? "";
    characterIndex += 1;
    if (characterIndex >= characters.length) {
      window.clearInterval(typingTimer);
      typingTimer = null;
      paragraph.classList.remove("typing");
    }
  }, 24);
}

function renderGuide() {
  stopTypewriter();
  const guide = guides[activeGuide];
  const step = guide.steps[activeStep];
  if (!step.statusExample) removeStatusTourExample();
  roleLabel.textContent = guide.label;
  stepLabel.textContent = `${activeStep + 1} / ${guide.steps.length}`;
  stage.innerHTML = `<h2 id="onboarding-title">${step.title}</h2><p data-onboarding-description aria-label="${step.text}">${step.text}</p>`;
  backButton.hidden = activeStep === 0;
  nextButton.textContent = "ok";
  prepareStep(step);
  revealTarget();
  typingStartTimer = window.setTimeout(() => typewriteDescription(step.text), 160);
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
  stopTypewriter();
  removeStatusTourExample();
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
