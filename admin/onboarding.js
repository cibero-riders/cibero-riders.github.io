const choiceDialog = document.querySelector("#onboarding-choice-dialog");
const guideDialog = document.querySelector("#onboarding-dialog");
const choiceStart = document.querySelector("#onboarding-choice-start");
const choiceSkip = document.querySelector("#onboarding-choice-skip");
const roleLabel = document.querySelector("#onboarding-role-label");
const stepLabel = document.querySelector("#onboarding-step-label");
const stage = document.querySelector("#onboarding-stage");
const backButton = document.querySelector("#onboarding-back");
const nextButton = document.querySelector("#onboarding-next");

const guides = {
  admin: {
    label: "GHID ADMIN CIBERO",
    steps: [
      { icon: "⌑", title: "Înregistrările au fluxuri separate", text: "PFA și SRL sunt gestionate central de CibeRO. Cererile de Curier nou și Curier cu experiență intră în pool-ul disponibil sub-flotelor.", points: ["Folosește tab-urile Înregistrări pentru filtrare.", "Cereri Wolt/Glovo se gestionează separat."] },
      { icon: "✦", title: "Controlezi doar ticketele CibeRO", text: "Un ticket al unui membru revendicat ajunge direct în portalul sub-flotei lui și nu intră în coada operațională centrală.", points: ["Control Tickete păstrează doar cazurile fără sub-flotă.", "Alertele de dubluri rămân vizibile separat pentru verificare."] },
      { icon: "⌘", title: "Administrezi sub-flotele", text: "În Sub-Flote poți crea conturi, verifica activitatea și vedea membrii fiecărei echipe. Cererile neprocesate cu status Nou timp de 24 de ore se întorc în pool.", points: ["Deschide o sub-flotă pentru lista ei de membri.", "Folosește căutarea pentru a găsi rapid o echipă."] },
      { icon: "✉", title: "Mesajele țin echipele conectate", text: "Clopoțelul deschide inboxul. Alege sub-flota, vezi istoricul conversației și răspunde direct; fiecare mesaj ajunge doar la cealaltă parte.", points: ["Mesajele noi apar cu număr pe clopoțel.", "Notele din cereri rămân doar pentru evidență internă."] },
    ],
  },
  subfleet: {
    label: "GHID PORTAL SUB-FLOTĂ",
    steps: [
      { icon: "⌑", title: "Preiei activări din pool", text: "Activări disponibile conține numai înscrieri de Curier nou și Curier cu experiență. Vezi informațiile de bază, sortează după timpul trimiterii și revendică persoanele potrivite.", points: ["Datele de contact devin vizibile după revendicare.", "PFA și SRL rămân în gestionarea CibeRO."] },
      { icon: "24", title: "Procesează rapid cererea revendicată", text: "După revendicare, schimbă statusul membrului din Nou în maximum 24 de ore. Altfel, cererea revine automat în pool-ul comun și CibeRO primește o alertă.", points: ["Folosește În verificare când începi prelucrarea.", "Arhiva ascunde membrii din lista Toți."] },
      { icon: "✓", title: "Gestionezi membrii echipei tale", text: "În Membrii mei ai sub-taburi pentru fiecare status. Deschide un membru pentru datele complete din formular și actualizează statusul direct din listă.", points: ["Poți filtra rapid membri noi, activi sau respinși.", "Un status Nou marchează din nou cererea ca de revizuit."] },
      { icon: "✦", title: "Ticketele vin direct la echipa ta", text: "Când un curier revendicat trimite un ticket cu emailul sau telefonul său, acesta ajunge doar în Tickete direcționate, organizat pe platforme și categorii.", points: ["Actualizează statusul din listă.", "CibeRO nu îl primește în coada centrală."] },
      { icon: "✉", title: "Comunici direct cu CibeRO", text: "Apasă clopoțelul pentru conversația cu CibeRO. Mesajele rămân în istoric, iar răspunsurile și notificările sunt vizibile pentru ambele părți.", points: ["Clopoțelul arată numărul mesajelor necitite.", "Deschide-l pentru a marca mesajele ca citite."] },
    ],
  },
};

let activeGuide = null;
let activeStep = 0;
let guideIsMandatory = false;

function renderGuide() {
  const guide = guides[activeGuide];
  const step = guide.steps[activeStep];
  roleLabel.textContent = guide.label;
  stepLabel.textContent = `${activeStep + 1} / ${guide.steps.length}`;
  stage.innerHTML = `<span class="onboarding-icon" aria-hidden="true">${step.icon}</span><h2 id="onboarding-title">${step.title}</h2><p>${step.text}</p><ul>${step.points.map(point => `<li>${point}</li>`).join("")}</ul>`;
  backButton.hidden = activeStep === 0;
  nextButton.textContent = activeStep === guide.steps.length - 1 ? "Încheie ghidul" : "Continuă";
}

function openGuide(role, mandatory) {
  activeGuide = role;
  activeStep = 0;
  guideIsMandatory = mandatory;
  renderGuide();
  guideDialog.showModal();
}

function closeGuide() {
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
});

export function showAccountGuide(profile) {
  const role = profile?.role === "subfleet" ? "subfleet" : "admin";
  const loginCount = Number(profile?.onboarding_login_count ?? 1);
  if (loginCount <= 1) {
    openGuide(role, true);
  } else if (loginCount <= 3) {
    choiceDialog.dataset.role = role;
    choiceDialog.showModal();
  }
}
