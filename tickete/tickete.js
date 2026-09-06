const API_URL = "https://xpzgvknnrkyvcnncfqrq.supabase.co/functions/v1/submit-ticket";
const PUBLISHABLE_KEY = "sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN";

const copy = {
  ro: {
    steps: ["Categorie", "Identitate", "Tip", "Detalii", "Confirmare"],
    categoryTitle: "Alege categoria solicitării",
    categorySubtitle: "Selectează platforma sau categoria pentru care ai o solicitare.",
    adminSeparator: "Solicitări administrative și financiare",
    continue: "Continuă",
    back: "Pasul anterior",
    identityTitle: "Datele tale de contact",
    identitySubtitle: "Introdu datele cu care ești înregistrat în flotă.",
    firstName: "Prenume",
    lastName: "Nume",
    phone: "Numărul tău de telefon",
    phoneHint: "Numărul cu care ești înregistrat în flotă",
    email: "Email de contact",
    emailHint: "Vei primi notificări despre statusul cererii pe acest email",
    typeTitle: "Ce tip de solicitare ai?",
    typeSubtitle: "Selectează tipul solicitării — un singur ticket pentru fiecare cerere.",
    detailsSubtitle: "Completează valoarea nouă sau informațiile necesare.",
    currentValue: "Valoare actuală",
    newValue: "Valoare nouă",
    unfilled: "Necompletat",
    newPhone: "Număr de telefon nou",
    newEmail: "Email nou",
    newIban: "IBAN nou",
    newVehicle: "Tip vehicul nou",
    newPlate: "Număr de înmatriculare nou",
    newCity: "Oraș nou",
    choose: "Selectează…",
    describe: "Descrie problema ta",
    describePlaceholder: "Descrie situația cât mai clar și include toate detaliile utile.",
    orderCode: "Codul comenzii (12 cifre)",
    receipt: "Poză cu bonul fiscal",
    receiptHelp: "JPG, PNG sau WEBP — maximum 10 MB",
    transferPhone: "Număr telefon din aplicația Wolt",
    transferPhoneHint: "Telefonul înregistrat în Wolt Courier — Profil → Date personale",
    courierId: "ID Curier Wolt",
    courierIdHint: "ID-ul din aplicația Wolt Courier — Profil → ID Curier",
    woltEmail: "Email înregistrat în Wolt",
    woltEmailHint: "Emailul din Wolt Courier — Profil → Date personale",
    amount: "Suma totală a bonurilor (lei)",
    receiptsPdf: "Document PDF cu toate bonurile",
    receiptsHelp: "Un singur fișier PDF — maximum 20 MB",
    confirmTitle: "Verifică și confirmă ticketul",
    confirmSubtitle: "Asigură-te că datele sunt corecte înainte de trimitere.",
    supportFiles: "Documente suport",
    supportHelp: "Atașează capturi sau documente care pot ajuta la procesarea cererii (opțional, maximum 5).",
    addFiles: "Adaugă fișiere",
    notes: "Note suplimentare (opțional)",
    notesPlaceholder: "Orice alte informații utile pentru echipă…",
    confirmation: "Confirm că informațiile completate sunt corecte și că această solicitare aparține contului meu.",
    submit: "Trimite ticketul",
    submitting: "Se trimite…",
    successTitle: "Ticket trimis!",
    successText: "Cererea ta a fost înregistrată. Echipa CibeRO o va analiza și te va contacta în cel mai scurt timp.",
    reference: "Referință ticket",
    another: "Trimite alt ticket",
    required: "Completează toate câmpurile obligatorii.",
    invalidPhone: "Introdu un număr de telefon valid, de minimum 10 cifre.",
    invalidEmail: "Introdu o adresă de email validă.",
    duplicate: "Ai deja o solicitare activă pentru acest număr. Poți deschide alta după procesarea celei existente.",
    submitError: "Ticketul nu a putut fi trimis. Încearcă din nou.",
    remove: "Elimină",
  },
  en: {
    steps: ["Category", "Identity", "Type", "Details", "Confirm"],
    categoryTitle: "Choose request category",
    categorySubtitle: "Select the platform or category for your request.",
    adminSeparator: "Administrative and financial requests",
    continue: "Continue",
    back: "Previous step",
    identityTitle: "Your contact details",
    identitySubtitle: "Enter the details registered with the fleet.",
    firstName: "First name",
    lastName: "Last name",
    phone: "Your phone number",
    phoneHint: "The number registered with the fleet",
    email: "Contact email",
    emailHint: "You will receive ticket status notifications at this address",
    typeTitle: "What type of request do you have?",
    typeSubtitle: "Select the request type — one ticket per request.",
    detailsSubtitle: "Enter the new value or the required information.",
    currentValue: "Current value",
    newValue: "New value",
    unfilled: "Not filled",
    newPhone: "New phone number",
    newEmail: "New email",
    newIban: "New IBAN",
    newVehicle: "New vehicle type",
    newPlate: "New registration number",
    newCity: "New city",
    choose: "Select…",
    describe: "Describe your issue",
    describePlaceholder: "Describe the situation clearly and include all useful details.",
    orderCode: "Order code (12 digits)",
    receipt: "Receipt photo",
    receiptHelp: "JPG, PNG or WEBP — maximum 10 MB",
    transferPhone: "Phone number in the Wolt app",
    transferPhoneHint: "Wolt Courier — Profile → Personal data",
    courierId: "Wolt Courier ID",
    courierIdHint: "Wolt Courier — Profile → Courier ID",
    woltEmail: "Email registered in Wolt",
    woltEmailHint: "Wolt Courier — Profile → Personal data",
    amount: "Total receipt amount (RON)",
    receiptsPdf: "PDF containing all receipts",
    receiptsHelp: "One PDF file — maximum 20 MB",
    confirmTitle: "Review and confirm your ticket",
    confirmSubtitle: "Make sure all details are correct before submitting.",
    supportFiles: "Support documents",
    supportHelp: "Attach screenshots or documents that can help process the request (optional, maximum 5).",
    addFiles: "Add files",
    notes: "Additional notes (optional)",
    notesPlaceholder: "Any other useful information for the team…",
    confirmation: "I confirm that the information is correct and that this request belongs to my account.",
    submit: "Submit ticket",
    submitting: "Submitting…",
    successTitle: "Ticket submitted!",
    successText: "Your request has been registered. The CibeRO team will review it and contact you as soon as possible.",
    reference: "Ticket reference",
    another: "Submit another ticket",
    required: "Complete all required fields.",
    invalidPhone: "Enter a valid phone number with at least 10 digits.",
    invalidEmail: "Enter a valid email address.",
    duplicate: "You already have an active request for this phone number. You can open another after it is processed.",
    submitError: "The ticket could not be submitted. Please try again.",
    remove: "Remove",
  },
};

const categories = [
  { id: "bolt", label: { ro: "Bolt Food", en: "Bolt Food" }, desc: { ro: "Solicitări procesate în 24–48h", en: "Requests processed in 24–48h" }, icon: "BO", accent: "#38d188" },
  { id: "glovo", label: { ro: "Glovo", en: "Glovo" }, desc: { ro: "Solicitări procesate în 24–48h", en: "Requests processed in 24–48h" }, icon: "GL", accent: "#ffc244" },
  { id: "wolt", label: { ro: "Wolt", en: "Wolt" }, desc: { ro: "Solicitări procesate în 24–48h", en: "Requests processed in 24–48h" }, icon: "WO", accent: "#20c4e7" },
  { separator: true },
  { id: "rapoarte_plati", label: { ro: "Rapoarte și Plăți", en: "Reports and Payments" }, desc: { ro: "Probleme cu plata sau raportul săptămânal", en: "Issues with payment or weekly report" }, icon: "▤", accent: "#65a1ff" },
  { id: "probleme_admin", label: { ro: "Probleme Administrative", en: "Administrative Issues" }, desc: { ro: "Documente, contract, date cont, alte solicitări", en: "Documents, contract, account details, other requests" }, icon: "◇", accent: "#c49ac8" },
  { id: "deconturi", label: { ro: "Deconturi", en: "Reimbursements" }, desc: { ro: "Toate bonurile într-un singur PDF", en: "All receipts in a single PDF" }, icon: "RON", accent: "#7bdca9" },
];

const typeCatalog = {
  phone: ["Număr de telefon", "Phone number", "Schimbă numărul înregistrat pe platformă", "Change the phone number registered on the platform", "☎"],
  email: ["Adresă de email", "Email address", "Schimbă emailul asociat contului de curier", "Change the email associated with your courier account", "@"],
  iban: ["IBAN cont bancar", "Bank account IBAN", "Actualizează contul bancar pentru plăți", "Update the bank account for payments", "IB"],
  city: ["Oraș activ", "Active city", "Schimbă orașul în care livrezi", "Change the city where you deliver", "⌖"],
  vehicle: ["Tip vehicul", "Vehicle type", "Schimbă tipul vehiculului cu care livrezi", "Change the type of vehicle you deliver with", "◉"],
  plate_number: ["Nr. înmatriculare", "Registration number", "Actualizează numărul de înmatriculare al vehiculului", "Update the vehicle registration number", "№"],
  activate_chas: ["Activare CHAS", "Activate CHAS", "Activează opțiunea CHAS pe contul tău", "Activate the CHAS option on your account", "+"],
  deactivate_chas: ["Dezactivare CHAS", "Deactivate CHAS", "Dezactivează opțiunea CHAS pe contul tău", "Deactivate the CHAS option on your account", "−"],
  transfer_cont: ["Solicită transfer cont", "Request account transfer", "Transferă contul Wolt Courier în flota noastră", "Transfer your Wolt Courier account to our fleet", "⇄"],
  other: ["Altă problemă", "Other issue", "Cont blocat, deblocare sau altă solicitare", "Blocked account, unblocking or another request", "?"],
  suma_incorecta: ["Sumă incorectă în raport", "Incorrect amount in report", "Suma din raportul săptămânal nu este corectă", "The amount in my weekly report is incorrect", "∑"],
  lipsa_plata: ["Plată lipsă", "Missing payment", "Nu am primit plata pentru una sau mai multe săptămâni", "I did not receive payment for one or more weeks", "RON"],
  clarificare_decont: ["Clarificare decont", "Payment clarification", "Am o întrebare despre sumele din decont", "I have a question about the amounts in my statement", "i"],
  alta_problema_plata: ["Altă problemă cu plata", "Other payment issue", "Altă problemă legată de plăți sau rapoarte", "Another issue related to payments or reports", "?"],
  actualizare_documente: ["Actualizare documente", "Update documents", "Trebuie să încarc sau să actualizez un document", "I need to upload or update a document", "▧"],
  problema_contract: ["Problemă cu contractul", "Contract issue", "Întrebare sau problemă legată de contract", "Question or issue related to my contract", "§"],
  alta_problema_admin: ["Altă problemă administrativă", "Other administrative issue", "Altă solicitare administrativă", "Another administrative request", "?"],
  comanda_anulata: ["Comandă anulată", "Cancelled order", "Raportează o comandă Glovo anulată, cu cod și bon", "Report a cancelled Glovo order with code and receipt", "×"],
};

const platformBaseTypes = ["phone", "email", "iban", "city", "vehicle", "plate_number", "activate_chas", "deactivate_chas", "other"];
const typeSets = {
  bolt: platformBaseTypes,
  glovo: [...platformBaseTypes, "comanda_anulata"],
  wolt: ["transfer_cont", "phone", "email", "iban", "city", "vehicle", "other"],
  rapoarte_plati: ["suma_incorecta", "lipsa_plata", "clarificare_decont", "alta_problema_plata"],
  probleme_admin: ["actualizare_documente", "problema_contract", "alta_problema_admin"],
};

const vehicles = ["Bicicletă", "Scuter / Moped", "Motocicletă", "Mașină", "Pe jos"];
const cities = ["Alba Iulia", "Alexandria", "Arad", "Bacău", "Baia Mare", "Bistrița", "Botoșani", "Brăila", "Brașov", "București", "Buzău", "Călărași", "Cluj-Napoca", "Constanța", "Craiova", "Dej", "Deva", "Făgăraș", "Focșani", "Galați", "Giurgiu", "Iași", "Mediaș", "Miercurea-Ciuc", "Oradea", "Piatra Neamț", "Pitești", "Ploiești", "Râmnicu Vâlcea", "Reșița", "Satu Mare", "Sfântu Gheorghe", "Sibiu", "Sinaia", "Slatina", "Slobozia", "Suceava", "Târgoviște", "Târgu Jiu", "Târgu Mureș", "Timișoara", "Tulcea", "Turda", "Vaslui", "Zalău"];

const stage = document.querySelector("#ticket-stage");
const stepper = document.querySelector("#stepper");
const dialog = document.querySelector("#ticket-dialog");
const dialogContent = document.querySelector("#ticket-dialog-content");
const state = {
  language: "ro", step: 1, category: "", type: "", firstName: "", lastName: "", phone: "", email: "",
  details: {}, files: [], receipt: null, receiptsPdf: null, notes: "", confirmed: false, error: "", reference: "",
};

function t(key) { return copy[state.language][key] ?? key; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function categoryById(id) { return categories.find(item => item.id === id); }
function typeText(id, index) { const values = typeCatalog[id]; return values ? values[state.language === "ro" ? index : index + 1] : id; }
function typeLabel(id) { return typeText(id, 0); }
function typeDescription(id) { return typeText(id, 2); }
function scrollTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

function renderStepper() {
  stepper.innerHTML = t("steps").map((label, index) => {
    const number = index + 1;
    const completed = state.step > number || (state.category === "deconturi" && number === 3 && state.step > 2);
    return `<div class="step-item${state.step === number ? " active" : ""}${completed ? " complete" : ""}"><span class="step-number">${completed ? "✓" : number}</span><span class="step-label">${escapeHtml(label)}</span></div>`;
  }).join("");
}

function heading(title, subtitle) {
  return `<header class="stage-heading"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></header>`;
}

function actions(showBack = true, nextLabel = t("continue"), nextId = "next") {
  return `<div class="actions">${showBack ? `<button class="secondary-action" type="button" data-action="back">← ${escapeHtml(t("back"))}</button>` : ""}<button class="primary-action" type="button" data-action="${nextId}">${escapeHtml(nextLabel)} →</button></div><p class="stage-error" role="alert">${escapeHtml(state.error)}</p>`;
}

function renderCategories() {
  stage.innerHTML = `${heading(t("categoryTitle"), t("categorySubtitle"))}<div class="stage-body"><div class="category-grid">${categories.map(item => {
    if (item.separator) return `<div class="category-separator">${escapeHtml(t("adminSeparator"))}</div>`;
    const selected = state.category === item.id;
    return `<button class="choice-card${selected ? " selected" : ""}" style="--accent:${item.accent};--accent-soft:${item.accent}35" type="button" data-category="${item.id}"><span class="radio-mark"></span><span class="choice-icon">${escapeHtml(item.icon)}</span><strong>${escapeHtml(item.label[state.language])}</strong><span>${escapeHtml(item.desc[state.language])}</span></button>`;
  }).join("")}</div>${actions(false)}</div>`;
}

function field(name, label, value, options = {}) {
  const full = options.full ? " full" : "";
  const required = options.required === false ? "" : ` <span class="required">*</span>`;
  const hint = options.hint ? `<small>${escapeHtml(options.hint)}</small>` : "";
  if (options.select) {
    return `<label class="form-field${full}">${escapeHtml(label)}${required}<select name="${name}"><option value="">${escapeHtml(t("choose"))}</option>${options.select.map(option => `<option value="${escapeHtml(option)}"${value === option ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>${hint}</label>`;
  }
  if (options.textarea) return `<label class="form-field${full}">${escapeHtml(label)}${required}<textarea name="${name}" maxlength="2000" placeholder="${escapeHtml(options.placeholder || "")}">${escapeHtml(value)}</textarea>${hint}</label>`;
  return `<label class="form-field${full}">${escapeHtml(label)}${required}<input name="${name}" type="${options.type || "text"}" value="${escapeHtml(value)}" placeholder="${escapeHtml(options.placeholder || "")}" />${hint}</label>`;
}

function renderIdentity() {
  stage.innerHTML = `${heading(t("identityTitle"), t("identitySubtitle"))}<div class="stage-body"><div class="form-grid">${field("firstName", t("firstName"), state.firstName, { placeholder: "Ion" })}${field("lastName", t("lastName"), state.lastName, { placeholder: "Popescu" })}${field("phone", t("phone"), state.phone, { type: "tel", placeholder: "07XX XXX XXX", hint: t("phoneHint"), full: true })}${field("email", t("email"), state.email, { type: "email", placeholder: "email@exemplu.com", hint: t("emailHint"), full: true })}</div>${actions()}</div>`;
}

function renderTypes() {
  const ids = typeSets[state.category] || [];
  const woltGuide = state.category === "wolt" ? `<div class="info-note wolt-guide"><b>W</b><div><strong>${state.language === "ro" ? "Schimbarea vehiculului la Wolt" : "Changing your vehicle on Wolt"}</strong><div>${state.language === "ro" ? "Se face direct din aplicația Wolt Client: Asistență Curieri → Contul meu de partener → schimbare vehicul → chat." : "It is completed directly in Wolt Client: Courier Assistance → My partner account → change vehicle → chat."}</div></div></div>` : "";
  stage.innerHTML = `${heading(t("typeTitle"), t("typeSubtitle"))}<div class="stage-body"><div class="category-grid">${woltGuide}${ids.map(id => `<button class="choice-card${state.type === id ? " selected" : ""}" type="button" data-type="${id}"><span class="radio-mark"></span><span class="choice-icon">${escapeHtml(typeCatalog[id][4])}</span><strong>${escapeHtml(typeLabel(id))}</strong><span>${escapeHtml(typeDescription(id))}</span></button>`).join("")}</div>${actions()}</div>`;
}

function detailValue() {
  const map = { phone: "newPhone", email: "newEmail", iban: "newIban", city: "newCity", vehicle: "newVehicle", plate_number: "newPlate" };
  return state.details[map[state.type]] || "";
}

function valueComparison() {
  const current = state.type === "phone" ? state.phone : state.type === "email" ? state.email : "—";
  return `<div class="current-value"><div class="value-panel"><span>${escapeHtml(t("currentValue"))}</span><strong>${escapeHtml(current)}</strong></div><div class="value-panel new"><span>${escapeHtml(t("newValue"))}</span><strong>${escapeHtml(detailValue() || t("unfilled"))}</strong></div></div>`;
}

function uploadField(kind, label, help, accept, file, multiple = false) {
  return `<label class="upload-zone"><input type="file" data-upload="${kind}" accept="${accept}"${multiple ? " multiple" : ""} /><strong>＋ ${escapeHtml(label)}</strong><span>${escapeHtml(help)}</span></label>${file ? `<div class="file-list"><div class="file-pill"><span>${escapeHtml(file.name)}</span><button type="button" data-remove-file="${kind}">${escapeHtml(t("remove"))}</button></div></div>` : ""}`;
}

function renderDetails() {
  let content = "";
  const simpleFields = ["phone", "email", "iban", "city", "vehicle", "plate_number"];
  if (simpleFields.includes(state.type)) {
    content += valueComparison();
    if (state.type === "phone") content += field("newPhone", t("newPhone"), state.details.newPhone || "", { type: "tel", placeholder: "07XX XXX XXX", full: true });
    if (state.type === "email") content += field("newEmail", t("newEmail"), state.details.newEmail || "", { type: "email", placeholder: "email@nou.com", full: true });
    if (state.type === "iban") content += field("newIban", t("newIban"), state.details.newIban || "", { placeholder: "RO00 XXXX XXXX XXXX XXXX XXXX", full: true });
    if (state.type === "city") content += field("newCity", t("newCity"), state.details.newCity || "", { select: cities, full: true });
    if (state.type === "vehicle") content += field("newVehicle", t("newVehicle"), state.details.newVehicle || "", { select: vehicles, full: true });
    if (state.type === "plate_number") content += field("newPlate", t("newPlate"), state.details.newPlate || "", { placeholder: "B 123 ABC", full: true });
  } else if (state.type === "other") {
    content += field("description", t("describe"), state.details.description || "", { textarea: true, placeholder: t("describePlaceholder"), full: true });
  } else if (state.type === "transfer_cont") {
    content += `<div class="info-note wolt-guide"><b>W</b><div>${state.language === "ro" ? "Completează datele exacte din aplicația Wolt Courier. Ele sunt necesare pentru transferul contului în flota noastră." : "Enter the exact details from Wolt Courier. They are required to transfer your account to our fleet."}</div></div>`;
    content += field("woltAppPhone", t("transferPhone"), state.details.woltAppPhone || "", { type: "tel", hint: t("transferPhoneHint"), full: true });
    content += field("woltCourierId", t("courierId"), state.details.woltCourierId || "", { hint: t("courierIdHint"), full: true });
    content += field("woltEmail", t("woltEmail"), state.details.woltEmail || "", { type: "email", hint: t("woltEmailHint"), full: true });
  } else if (state.type === "comanda_anulata") {
    content += field("orderCode", t("orderCode"), state.details.orderCode || "", { placeholder: "123456789012", full: true });
    content += uploadField("receipt", t("receipt"), t("receiptHelp"), "image/jpeg,image/png,image/webp", state.receipt);
  } else if (state.category === "deconturi") {
    content += field("declaredAmount", t("amount"), state.details.declaredAmount || "", { type: "number", placeholder: "0,00", full: true });
    content += uploadField("receiptsPdf", t("receiptsPdf"), t("receiptsHelp"), "application/pdf", state.receiptsPdf);
  }
  stage.innerHTML = `${heading(state.category === "deconturi" ? categoryById(state.category).label[state.language] : typeLabel(state.type), t("detailsSubtitle"))}<div class="stage-body"><div class="form-grid">${content}</div>${actions()}</div>`;
}

function summaryItem(label, value, full = false) { return `<div class="summary-item${full ? " full" : ""}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "—")}</strong></div>`; }

function renderConfirm() {
  const category = categoryById(state.category);
  const details = [];
  if (state.details.newPhone) details.push(summaryItem(t("newPhone"), state.details.newPhone));
  if (state.details.newEmail) details.push(summaryItem(t("newEmail"), state.details.newEmail));
  if (state.details.newIban) details.push(summaryItem(t("newIban"), state.details.newIban));
  if (state.details.newCity) details.push(summaryItem(t("newCity"), state.details.newCity));
  if (state.details.newVehicle) details.push(summaryItem(t("newVehicle"), state.details.newVehicle));
  if (state.details.newPlate) details.push(summaryItem(t("newPlate"), state.details.newPlate));
  if (state.details.description) details.push(summaryItem(t("describe"), state.details.description, true));
  if (state.details.woltAppPhone) details.push(summaryItem(t("transferPhone"), state.details.woltAppPhone));
  if (state.details.woltCourierId) details.push(summaryItem(t("courierId"), state.details.woltCourierId));
  if (state.details.woltEmail) details.push(summaryItem(t("woltEmail"), state.details.woltEmail, true));
  if (state.details.orderCode) details.push(summaryItem(t("orderCode"), state.details.orderCode));
  if (state.details.declaredAmount) details.push(summaryItem(t("amount"), `${state.details.declaredAmount} lei`));
  const fileNames = [...state.files.map(file => file.name), state.receipt?.name, state.receiptsPdf?.name].filter(Boolean).join(", ");
  stage.innerHTML = `${heading(t("confirmTitle"), t("confirmSubtitle"))}<div class="stage-body"><div class="summary-list">${summaryItem(state.language === "ro" ? "Curier" : "Courier", `${state.firstName} ${state.lastName}`)}${summaryItem(t("phone"), state.phone)}${summaryItem(state.language === "ro" ? "Categorie" : "Category", category.label[state.language])}${summaryItem(state.language === "ro" ? "Tip solicitare" : "Request type", state.category === "deconturi" ? category.label[state.language] : typeLabel(state.type))}${details.join("")}${fileNames ? summaryItem(t("supportFiles"), fileNames, true) : ""}</div><div class="form-grid" style="margin-top:18px">${uploadField("support", t("addFiles"), t("supportHelp"), "image/jpeg,image/png,image/webp,application/pdf", null, true)}<div class="file-list">${state.files.map((file, index) => `<div class="file-pill"><span>${escapeHtml(file.name)}</span><button type="button" data-remove-support="${index}">${escapeHtml(t("remove"))}</button></div>`).join("")}</div>${field("notes", t("notes"), state.notes, { textarea: true, placeholder: t("notesPlaceholder"), required: false, full: true })}</div><label class="confirm-control"><input name="confirmed" type="checkbox"${state.confirmed ? " checked" : ""} /><span>${escapeHtml(t("confirmation"))}</span></label>${actions(true, state.submitting ? t("submitting") : t("submit"), "submit")}</div>`;
  stage.querySelector('[data-action="submit"]').disabled = state.submitting;
}

function renderSuccess() {
  stepper.hidden = true;
  stage.innerHTML = `<div class="success-card"><span class="success-mark">✓</span><p class="eyebrow">CibeRO Operations</p><h2>${escapeHtml(t("successTitle"))}</h2><p>${escapeHtml(t("successText"))}</p><div class="ticket-reference"><span>${escapeHtml(t("reference"))}</span><strong>#${escapeHtml(state.reference)}</strong></div><button class="primary-action" type="button" data-action="restart">${escapeHtml(t("another"))} →</button></div>`;
}

function render() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-language]").forEach(button => {
    const active = button.dataset.language === state.language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  stepper.hidden = Boolean(state.reference);
  if (!state.reference) renderStepper();
  if (state.reference) renderSuccess();
  else if (state.step === 1) renderCategories();
  else if (state.step === 2) renderIdentity();
  else if (state.step === 3) renderTypes();
  else if (state.step === 4) renderDetails();
  else renderConfirm();
  bindStageEvents();
}

function syncInputs() {
  stage.querySelectorAll("input[name], select[name], textarea[name]").forEach(input => {
    const name = input.name;
    if (name === "firstName" || name === "lastName" || name === "phone" || name === "email" || name === "notes") state[name] = input.type === "checkbox" ? input.checked : input.value;
    else if (name === "confirmed") state.confirmed = input.checked;
    else state.details[name] = input.value;
  });
}

function validateIdentity() {
  if (!state.firstName.trim() || !state.lastName.trim() || !state.phone.trim() || !state.email.trim()) return t("required");
  if (state.phone.replace(/\D/g, "").length < 10) return t("invalidPhone");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) return t("invalidEmail");
  return "";
}

function validateDetails() {
  const d = state.details;
  if (state.category === "deconturi") {
    if (!d.declaredAmount || Number(String(d.declaredAmount).replace(",", ".")) <= 0 || !state.receiptsPdf) return t("required");
  } else if (state.type === "phone" && d.newPhone?.replace(/\D/g, "").length < 10) return t("invalidPhone");
  else if (state.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.newEmail || "")) return t("invalidEmail");
  else if (state.type === "iban" && !/^RO[A-Z0-9]{22}$/.test((d.newIban || "").replace(/\s/g, "").toUpperCase())) return state.language === "ro" ? "IBAN-ul trebuie să înceapă cu RO și să conțină 24 de caractere." : "The IBAN must start with RO and contain 24 characters.";
  else if (["city", "vehicle", "plate_number", "other"].includes(state.type) && !detailValue() && !d.description) return t("required");
  else if (state.type === "transfer_cont" && (!d.woltAppPhone || !d.woltCourierId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.woltEmail || ""))) return t("required");
  else if (state.type === "comanda_anulata" && (!/^\d{12}$/.test(d.orderCode || "") || !state.receipt)) return t("required");
  return "";
}

async function checkDuplicate() {
  const form = new FormData();
  form.set("action", "check");
  form.set("phone", state.phone.trim());
  const response = await fetch(API_URL, { method: "POST", headers: { apikey: PUBLISHABLE_KEY }, body: form });
  if (!response.ok) throw new Error("check_failed");
  const result = await response.json();
  return Boolean(result.active);
}

function warningForType() {
  const warnings = {
    phone: { ro: `Numărul nou va fi folosit pentru comunicările cu ${categoryById(state.category).label.ro}. Procesarea poate dura 24–72h.`, en: `The new number will be used for communication with ${categoryById(state.category).label.en}. Processing may take 24–72 hours.` },
    email: { ro: "Emailul nou trebuie să fie exact cel folosit la următoarea autentificare. Procesarea poate dura 24–48h.", en: "The new email must match the one used at your next login. Processing may take 24–48 hours." },
    iban: { ro: "Noul IBAN va fi activ la următorul ciclu de plată. Verifică-l atent — o eroare poate întârzia plata.", en: "The new IBAN becomes active in the next payment cycle. Check it carefully — an error may delay payment." },
    city: { ro: "Schimbarea orașului poate dura până la 7 zile lucrătoare și poate necesita reverificarea documentelor.", en: "Changing the active city may take up to 7 business days and may require document verification." },
    vehicle: { ro: "Schimbarea vehiculului poate necesita documente actualizate. Le poți atașa la confirmare.", en: "Changing the vehicle may require updated documents. You can attach them during confirmation." },
    plate_number: { ro: "Schimbarea vehiculului poate necesita documente actualizate. Le poți atașa la confirmare.", en: "Changing the vehicle may require updated documents. You can attach them during confirmation." },
    other: { ro: "Descrie situația cât mai detaliat și atașează capturi dacă este posibil.", en: "Describe the situation in detail and attach screenshots if possible." },
  };
  return warnings[state.type]?.[state.language] || "";
}

function showInfoDialog(title, message, onConfirm, options = {}) {
  dialogContent.innerHTML = `<div class="dialog-content"><span class="dialog-icon">${escapeHtml(options.icon || "i")}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p>${options.guide || ""}<div class="dialog-actions">${options.cancel ? `<button class="secondary-action" type="button" data-dialog="cancel">${escapeHtml(options.cancel)}</button>` : ""}<button class="primary-action" type="button" data-dialog="confirm">${escapeHtml(options.confirm || t("continue"))}</button></div></div>`;
  dialog.showModal();
  dialogContent.querySelector('[data-dialog="confirm"]').addEventListener("click", () => { dialog.close(); onConfirm(); });
  dialogContent.querySelector('[data-dialog="cancel"]')?.addEventListener("click", () => dialog.close());
}

function categoryIntro() {
  const item = categoryById(state.category);
  const descriptions = {
    rapoarte_plati: { ro: "Raportează o sumă plătită incorect, un raport săptămânal greșit sau o plată lipsă.", en: "Report an incorrect paid amount, weekly report or missing payment." },
    probleme_admin: { ro: "Trimite o cerere legată de documente, contract, datele contului sau alte probleme administrative.", en: "Submit a request about documents, contract, account details or another administrative issue." },
    deconturi: { ro: "Adună toate bonurile într-un singur document PDF înainte de a continua.", en: "Combine all receipts into a single PDF document before continuing." },
  };
  return descriptions[state.category]?.[state.language] || item.desc[state.language];
}

async function next() {
  syncInputs();
  state.error = "";
  if (state.step === 1) {
    if (!state.category) { state.error = state.language === "ro" ? "Selectează o categorie." : "Select a category."; render(); return; }
    const item = categoryById(state.category);
    showInfoDialog(item.label[state.language], categoryIntro(), () => { state.step = 2; render(); scrollTop(); }, { icon: item.icon, confirm: state.language === "ro" ? "Am înțeles, continuă" : "I understand, continue" });
    return;
  }
  if (state.step === 2) {
    state.error = validateIdentity();
    if (state.error) { render(); return; }
    try {
      if (await checkDuplicate()) { state.error = t("duplicate"); render(); return; }
    } catch (error) { console.warn("Duplicate check unavailable", error); }
    state.step = state.category === "deconturi" ? 4 : 3;
  } else if (state.step === 3) {
    if (!state.type) { state.error = state.language === "ro" ? "Selectează tipul solicitării." : "Select the request type."; render(); return; }
    if (["activate_chas", "deactivate_chas", "suma_incorecta", "lipsa_plata", "clarificare_decont", "alta_problema_plata", "actualizare_documente", "problema_contract", "alta_problema_admin"].includes(state.type)) state.step = 5;
    else {
      const warning = warningForType();
      if (warning) {
        showInfoDialog(typeLabel(state.type), warning, () => { state.step = 4; render(); scrollTop(); }, { confirm: state.language === "ro" ? "Am înțeles, continuă" : "I understand, continue" });
        return;
      }
      state.step = 4;
    }
  } else if (state.step === 4) {
    state.error = validateDetails();
    if (state.error) { render(); return; }
    state.step = 5;
  }
  render(); scrollTop();
}

function back() {
  syncInputs(); state.error = "";
  if (state.step === 5) {
    const skipsDetails = ["activate_chas", "deactivate_chas", "suma_incorecta", "lipsa_plata", "clarificare_decont", "alta_problema_plata", "actualizare_documente", "problema_contract", "alta_problema_admin"].includes(state.type);
    state.step = skipsDetails ? 3 : 4;
  } else if (state.step === 4) state.step = state.category === "deconturi" ? 2 : 3;
  else if (state.step === 3) state.step = 2;
  else if (state.step === 2) state.step = 1;
  render(); scrollTop();
}

function validateFile(file, kind) {
  const imageTypes = ["image/jpeg", "image/png", "image/webp"];
  if (kind === "receiptsPdf") return file.type === "application/pdf" && file.size <= 20 * 1024 * 1024;
  if (kind === "receipt") return imageTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
  return [...imageTypes, "application/pdf"].includes(file.type) && file.size <= 10 * 1024 * 1024;
}

async function submitTicket() {
  syncInputs();
  if (!state.confirmed) { state.error = state.language === "ro" ? "Confirmarea corectitudinii datelor este obligatorie." : "You must confirm that the information is correct."; render(); return; }
  state.submitting = true; state.error = ""; render();
  const form = new FormData();
  form.set("action", "submit");
  form.set("category", state.category);
  form.set("request_type", state.category === "deconturi" ? "deconturi" : state.type);
  form.set("first_name", state.firstName.trim());
  form.set("last_name", state.lastName.trim());
  form.set("phone", state.phone.trim());
  form.set("email", state.email.trim());
  form.set("notes", state.notes.trim());
  form.set("confirmed", "true");
  Object.entries(state.details).forEach(([key, value]) => form.set(key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`), String(value).trim()));
  state.files.forEach(file => form.append("files", file));
  if (state.receipt) form.set("receipt", state.receipt);
  if (state.receiptsPdf) form.set("receipts_pdf", state.receiptsPdf);
  try {
    const response = await fetch(API_URL, { method: "POST", headers: { apikey: PUBLISHABLE_KEY }, body: form });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || t("submitError"));
    state.reference = result.reference || String(result.ticket_id || "").slice(0, 8).toUpperCase();
  } catch (error) {
    state.error = error.message || t("submitError");
  } finally {
    state.submitting = false; render(); scrollTop();
  }
}

function resetState() {
  Object.assign(state, { step: 1, category: "", type: "", firstName: "", lastName: "", phone: "", email: "", details: {}, files: [], receipt: null, receiptsPdf: null, notes: "", confirmed: false, error: "", reference: "", submitting: false });
  render(); scrollTop();
}

function bindStageEvents() {
  stage.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => { state.category = button.dataset.category; state.type = ""; state.error = ""; render(); }));
  stage.querySelectorAll("[data-type]").forEach(button => button.addEventListener("click", () => { state.type = button.dataset.type; state.error = ""; render(); }));
  stage.querySelector('[data-action="next"]')?.addEventListener("click", next);
  stage.querySelector('[data-action="back"]')?.addEventListener("click", back);
  stage.querySelector('[data-action="submit"]')?.addEventListener("click", submitTicket);
  stage.querySelector('[data-action="restart"]')?.addEventListener("click", resetState);
  stage.querySelectorAll("input[name], select[name], textarea[name]").forEach(input => input.addEventListener("input", syncInputs));
  stage.querySelectorAll("[data-upload]").forEach(input => input.addEventListener("change", () => {
    const kind = input.dataset.upload;
    const files = [...input.files];
    if (kind === "support") state.files = [...state.files, ...files.filter(file => validateFile(file, kind))].slice(0, 5);
    else if (files[0] && validateFile(files[0], kind)) state[kind] = files[0];
    else state.error = state.language === "ro" ? "Fișierul nu are un format sau o dimensiune acceptată." : "The file format or size is not accepted.";
    render();
  }));
  stage.querySelectorAll("[data-remove-file]").forEach(button => button.addEventListener("click", () => { state[button.dataset.removeFile] = null; render(); }));
  stage.querySelectorAll("[data-remove-support]").forEach(button => button.addEventListener("click", () => { state.files.splice(Number(button.dataset.removeSupport), 1); render(); }));
}

document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => { syncInputs(); state.language = button.dataset.language; state.error = ""; render(); }));
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle.addEventListener("click", () => { const open = mainNav.classList.toggle("open"); menuToggle.setAttribute("aria-expanded", String(open)); });
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { mainNav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); }));

render();
