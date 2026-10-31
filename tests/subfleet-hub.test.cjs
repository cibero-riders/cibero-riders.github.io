const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const fleet = fs.readFileSync(path.join(root, 'hub', 'index.html'), 'utf8');
const subfleet = fs.readFileSync(path.join(root, 'subfleethub', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'hub', 'hub.js'), 'utf8');
const categoryStyles = fs.readFileSync(path.join(root, 'hub', 'hub-categories.css'), 'utf8');
const essentialStyles = fs.readFileSync(path.join(root, 'hub', 'hub-essential.css'), 'utf8');
const cashStyles = fs.readFileSync(path.join(root, 'hub', 'hub-cash-bubbles.css'), 'utf8');
const themeScript = fs.readFileSync(path.join(root, 'site-theme.js'), 'utf8');
const subfleetStyles = fs.readFileSync(path.join(root, 'subfleethub', 'subfleet.css'), 'utf8');
const supportScript = fs.readFileSync(path.join(root, 'subfleethub', 'subfleet-support.js'), 'utf8');

assert.match(fleet, /<h1 id="hub-title" data-hub-i18n="hubTitle">CIBERO Hub<\/h1>/);
assert.match(fleet, /<title>CIBERO Hub \| Informații pentru curieri<\/title>/);
assert.match(script, /hubTitle:'CIBERO Hub'/);
assert.match(script, /document\.title=isSubfleet\?'Courier Hub':'CIBERO Hub'/);
assert.match(fleet, /data-hub-i18n="hubSubtitle"/);
assert.match(subfleet, /<h1 id="hub-title" data-hub-i18n="hubTitle">Courier Hub<\/h1>/);
assert.match(subfleet, /data-hub-variant="subfleet"/);
assert.match(subfleet, /href="https:\/\/cibero\.delivery\/subfleethub\/"/);
assert.doesNotMatch(subfleet, /subfleet-navigation\.js/);
assert.match(subfleet, /subfleet\.css\?v=8/);
assert.match(subfleet, /\.\.\/hub\/hub\.js\?v=51/);
assert.match(fleet, /hub\.js\?v=51/);
assert.match(fleet, /\.\.\/subfleethub\/subfleet-support\.js\?v=1/);
assert.match(fleet, /\.\.\/subfleethub\/subfleet\.css\?v=8/);
assert.match(subfleet, /subfleet-support\.js\?v=1/);
assert.match(subfleet, /\.\.\/hub\/hub-categories\.css\?v=29/);
assert.match(fleet, /hub-categories\.css\?v=29/);
assert.match(subfleet, /\.\.\/hub\/hub-essential\.css\?v=29/);
assert.match(fleet, /hub-essential\.css\?v=29/);
for (const html of [fleet, subfleet]) {
  const structuralTags = /<\/?(?:div|section|details)\b[^>]*>/g;
  const openElements = [];
  let tag;
  while ((tag = structuralTags.exec(html))) {
    const closing = tag[0].startsWith('</');
    const name = tag[0].match(/^<\/?(\w+)/)[1];
    if (closing) {
      assert.equal(openElements.pop()?.name, name, `Balanced ${name} markup in the hub`);
      continue;
    }
    const id = tag[0].match(/\bid="([^"]+)"/)?.[1];
    if (['aplicatii-mobile', 'plati', 'reguli-cash-si-reset', 'decontare', 'faq-platforme', 'echipament-oficial'].includes(id)) {
      assert.match(openElements.at(-1)?.classes || '', /\bhub-essential-list\b/, `${id} stays in the evenly spaced hub menu`);
    }
    openElements.push({ name, classes: tag[0].match(/\bclass="([^"]+)"/)?.[1] || '' });
  }
  assert.equal(openElements.length, 0, 'The hub keeps all sections inside their intended containers');
  assert.doesNotMatch(html, /hub-quick-actions|hub-quick-button|data-hub-quick|has-quick-actions/);
  for (const id of ['aplicatii-mobile', 'plati', 'reguli-cash-si-reset', 'decontare', 'faq-platforme', 'echipament-oficial']) {
    assert.match(html, new RegExp(`<details id="${id}" class="hub-category-accordion`));
  }
  assert.match(html, /data-app-platform="controlfleet"/);
  assert.match(html, /<section id="urmatoarea-plata" class="hub-payment-panel">/);
  assert.match(html, /class="hub-calendar-button hub-youtube-button" href="https:\/\/youtu\.be\/iBThwch_Tn0"/);
  assert.doesNotMatch(html, /class="hub-payment-panel-head"/);
  assert.match(html, /class="hub-youtube-button" href="https:\/\/(?:www\.)?youtube\.com\/shorts\//);
  assert.match(html, /class="hub-video-category" href="https:\/\/www\.youtube\.com\/@CibeRORiders\/"/);
  assert.match(html, /hub-cash-bubbles\.css\?v=2/);
  assert.doesNotMatch(html, /class="hub-rule-section"|data-hub-i18n="cashKnowTitle"|data-hub-i18n="cashDoTitle"/);
  for (const key of ['boltCashIntro', 'boltCashRule1', 'boltCashRule2', 'boltCashRule3', 'boltCashRule4', 'boltCashRule5', 'boltCashRule6', 'glovoCashRule', 'glovoDepositRule', 'glovoResetRule1', 'woltCashRule', 'woltResetRule1', 'woltAircashAccountSetup', 'woltDepositInfo', 'woltDepositRule2', 'woltResetAction', 'woltNoNextDayDeposit']) {
    assert.match(html, new RegExp(`class="hub-cash-fact(?: hub-cash-fact-deadline)?" data-hub-i18n(?:-html)?="${key}"`));
  }
  const boltFacts = html.match(/<article class="hub-rule hub-rule-bolt"[\s\S]*?<\/article>/)[0];
  for (let index = 1; index < 6; index += 1) {
    assert.ok(boltFacts.indexOf(`"boltCashRule${index}"`) < boltFacts.indexOf(`"boltCashRule${index + 1}"`));
  }
  assert.match(boltFacts, /<div class="hub-cash-head">[\s\S]*?Vezi ghidul de depunere[\s\S]*?<\/div>/);
  const glovoFacts = html.match(/<article class="hub-rule hub-rule-glovo"[\s\S]*?<\/article>/)[0];
  const woltFacts = html.match(/<article class="hub-rule hub-rule-wolt"[\s\S]*?<\/article>/)[0];
  assert.match(glovoFacts, /<div class="hub-cash-head">[\s\S]*?Găsește o stație SelfPay[\s\S]*?<\/div>\s*<ul/);
  assert.match(woltFacts, /<div class="hub-cash-head">[\s\S]*?Vezi ghidul de depunere[\s\S]*?<\/div>\s*<ul/);
  assert.doesNotMatch(woltFacts, /Deschide Aircash|Vezi locațiile Aircash/);
  for (const [facts, key] of [[boltFacts, 'boltCashRule4'], [glovoFacts, 'glovoResetRule1'], [woltFacts, 'woltResetAction']]) {
    assert.match(facts, new RegExp(`class="hub-cash-fact hub-cash-fact-deadline" data-hub-i18n-html="${key}"`));
  }
  assert.match(html, /src="\.\.\/assets\/social-youtube\.svg"/);
  assert.doesNotMatch(html, /calendar-(bolt|glovo|wolt)-ro\.png|data-calendar-tab|data-poster-link/);
}
for (const html of [fleet, subfleet]) {
  assert.match(html, /Resetul principal la Glovo are loc în fiecare <strong>Marți, până în ora 14:00<\/strong>/);
  assert.doesNotMatch(html, /Glovo mai efectuează un reset și luni|glovoResetRule2/);
  assert.match(html, /data-hub-i18n="paymentResetGlovoLabel">RESET: Depune integral balanța până<\/span> <strong data-card-reset="glovo"/);
  assert.doesNotMatch(html, /până la<\/span> <strong data-card-reset="glovo"/);
  assert.doesNotMatch(html, /până la<\/span> <strong data-card-reset="(?:bolt|wolt)"/);
}
assert.match(script, /glovoResetDate\(now\)/);
assert.match(script, /resetDate=capitalizeDate\(formatWeekdayDate\(schedule\.reset\)\)/);
assert.doesNotMatch(script, /platform==='glovo'\?formatWeekdayDate\(schedule\.reset\)/);
assert.match(script, /platform==='glovo'\?\(language==='en'\?'[,] 14:00':'[,] ora 14:00'\)/);
assert.match(categoryStyles, /text-transform: uppercase/);
assert.match(categoryStyles, /\.hub-platform-tabs \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);[\s\S]*?overflow: visible;/);
assert.match(categoryStyles, /data-payment-platform="bolt"[\s\S]*?--platform-tab-accent: #2dce8a/);
assert.match(categoryStyles, /\.hub-category-accordion \{[\s\S]*?grid-column: 1 \/ -1/);
assert.match(categoryStyles, /\.hub-essential-actions \{\s*grid-template-columns: minmax\(0, 1fr\)/);
assert.match(categoryStyles, /\.hub-category-dialog \{[\s\S]*?width: min\(1040px/);
assert.match(categoryStyles, /\.hub-video-category \{\s*grid-column: 1 \/ -1;/);
assert.match(categoryStyles, /\.hub-video-category \{[\s\S]*?grid-template-columns: 52px minmax\(0, 1fr\) 38px;[\s\S]*?min-height: 106px;/);
assert.match(categoryStyles, /\.hub-video-category \.hub-youtube-mark img \{[\s\S]*?width: 44px;[\s\S]*?height: 44px;/);
assert.match(categoryStyles, /\.hub-category-whatsapp:not\(\[open\]\) > summary \{\s*min-height: 116px;/);
assert.match(categoryStyles, /\.hub-video-category \{[\s\S]*?grid-template-columns: 42px minmax\(0, 1fr\) 34px;[\s\S]*?min-height: 118px;/);
assert.match(categoryStyles, /--hub-category-fill: linear-gradient\(132deg, #230a38/);
assert.match(categoryStyles, /html\[data-theme="light"\] body\.hub-body/);
assert.match(categoryStyles, /html\[data-theme="night"\] body\.hub-body/);
assert.match(cashStyles, /\.hub-category-cash \.hub-cash-facts/);
assert.match(cashStyles, /\.hub-cash-fact\.hub-cash-fact-deadline:nth-child\(n\)/);
assert.match(categoryStyles, /html\[data-theme="midday"\] body\.hub-body \{[\s\S]*?--hb-bg: #12091b/);
assert.match(categoryStyles, /html\[data-theme="night"\] body\.hub-body \{[\s\S]*?--hb-bg: #0d0e0c/);
assert.match(fleet, /src="\.\.\/assets\/social-whatsapp\.svg"/);
assert.doesNotMatch(fleet, /eatsdelivery\.bolt\.host\/modification-flow/);
assert.match(fs.readFileSync(path.join(root, 'assets', 'social-whatsapp.svg'), 'utf8'), /viewBox="0 0 24 24"/);
assert.match(categoryStyles, /\.hub-video-category \{[\s\S]*?background: var\(--hub-button-fill\)/);
assert.doesNotMatch(script, /data-hub-quick/);
const header = subfleet.split('<header class="subfleet-header"')[1].split('</header>')[0];
assert.match(header, /public-language-switch/);
assert.doesNotMatch(header, /brand|social|main-nav|menu-toggle|nav-account|<nav|href=/);
assert.match(themeScript, /\.subfleet-header/);
assert.match(subfleet, /\.\.\/site-theme\.js\?v=5/);
assert.doesNotMatch(subfleet, /site-navigation\.css|site-footer\.css|main-page\.js/);
assert.match(subfleet, /<footer class="subfleet-footer">© Powered by Cibero - 2026 \| All rights reserved<\/footer>/);

for (const id of ['aplicatii-mobile', 'plati', 'urmatoarea-plata', 'ghiduri-video', 'reguli-cash-si-reset', 'decontare', 'faq-platforme', 'echipament-oficial']) {
  assert.match(subfleet, new RegExp(`id="${id}"`));
}
assert.doesNotMatch(subfleet, /id="calendarul-de-plata"|id="ghiduri-si-informatii"/);
assert.match(fleet, /<button id="consultanta-financiara" class="hub-action hub-consulting-trigger"[^>]*data-consulting-open/);
assert.match(fleet, /<dialog id="consulting-dialog" class="hub-consulting-dialog"/);
assert.match(fleet, /data-consulting-close[^>]*>[\s\S]*?Înapoi la Hub/);
assert.match(fleet, /href="https:\/\/wa\.me\/40741946373"/);
assert.ok(fleet.indexOf('data-hub-i18n="benefitsTitle"') < fleet.indexOf('id="consultanta-financiara"'), 'Consultancy appears after Benefits');
assert.ok(fleet.indexOf('id="consultanta-financiara"') < fleet.indexOf('data-hub-i18n="referralTitle"'), 'Consultancy stays next to the benefit actions');
assert.doesNotMatch(fleet, /<details id="consultanta-financiara"/);
assert.doesNotMatch(subfleet, /id="consultanta-financiara"/);
assert.match(script, /wireStandaloneDialog\('consultanta-financiara','consulting-dialog'/);
assert.match(script, /if\(!entry\.dialog\.open\)entry\.dialog\.showModal\(\)/);
assert.match(script, /event\.target===dialog/);
assert.doesNotMatch(essentialStyles, /\.hub-consulting-trigger\{[^}]*grid-column/);
assert.match(script, /document\.querySelectorAll\('\.hub-category-accordion'\)/);
assert.match(script, /dialog\.className=`hub-category-dialog/);
assert.match(script, /const categoryDialogCopy=/);
assert.match(script, /faqDialogCaveat/);
assert.doesNotMatch(script, /heading\.className='hub-category-dialog-heading'/);
assert.doesNotMatch(script, /appsDialogNote|paymentsDialogNote|cashDialogNote|reimbursementDialogNote|faqDialogNote|whatsappDialogNote/);
assert.match(script, /entry\.summary\.addEventListener\('click',event=>\{event\.preventDefault\(\);showCategoryDialog\(section\);\}\)/);
assert.match(script, /if\(event\.target===entry\.dialog\)entry\.dialog\.close\(\)/);
assert.ok(fleet.indexOf('id="echipament-oficial"') < fleet.indexOf('id="instrumente-si-suport"'), 'Official gear stays with the information sections');
for (const id of ['comunicare-whatsapp']) {
  assert.doesNotMatch(subfleet, new RegExp(`id="${id}"`));
}
for (const text of ['Strada Farului', 'Strada Tudor Vladimirescu', 'eatsdelivery.bolt.host', 'CUI-ul CibeRO din footer', 'flotei CibeRO fără confirmare']) {
  assert.doesNotMatch(subfleet, new RegExp(text.replaceAll('.', '\\.')));
}

assert.match(subfleet, /data-app-platform="controlfleet"/);
assert.match(subfleet, /data-app-panel="controlfleet"/);
assert.match(subfleet, /https:\/\/play\.google\.com\/store\/apps\/details\?id=ro\.controlfleet\.employee/);
for (const html of [fleet, subfleet]) {
  assert.match(html, /id="suport-si-solicitari"/);
  assert.ok(html.indexOf('id="suport-si-solicitari"') < html.indexOf('id="aplicatii-mobile"'), 'Support actions appear above the hub menu');
  assert.match(html, /class="hub-action-grid hub-essential-actions hub-subfleet-support-actions"/);
  assert.match(html, /<button class="hub-action" type="button" data-vehicle-toggle aria-expanded="false" aria-controls="subfleet-vehicle-options"/);
  assert.match(html, /id="subfleet-vehicle-options"[\s\S]*?Alege platforma la care vrei să schimbi vehiculul/);
  const vehicleOptions = html.match(/<div id="subfleet-vehicle-options"[\s\S]*?<\/div>\s*<\/div>/)[0];
  assert.match(vehicleOptions, /href="https:\/\/cibero-manager-tool\.bolt\.host\/cibero-curieri-vehicle"[\s\S]*?Bolt Food/);
  assert.match(html, /Când e următoarea plată/);
}
assert.match(fleet, /<a class="hub-action" href="https:\/\/cibero-manager-tool\.bolt\.host\/suport-curieri\?cod=RLDE" target="_blank" rel="noopener noreferrer"[\s\S]*?Deschide un ticket[\s\S]*?<\/a>/);
assert.equal((fleet.match(/href="https:\/\/cibero-manager-tool\.bolt\.host\/suport-curieri\?cod=RLDE"/g) || []).length, 3);
assert.match(subfleet, /<a class="hub-action" href="https:\/\/cibero-manager-tool\.bolt\.host\/suport-curieri" target="_blank" rel="noopener noreferrer"[\s\S]*?Deschide un ticket[\s\S]*?<\/a>/);
assert.equal((subfleet.match(/href="https:\/\/cibero-manager-tool\.bolt\.host\/suport-curieri"/g) || []).length, 3);
assert.doesNotMatch(subfleet, /suport-curieri\?cod=RLDE/);
assert.match(supportScript, /aria-expanded/);
assert.match(supportScript, /options\.hidden = expanded/);
assert.match(script, /subfleetVehiclePrompt:'Choose the platform where you want to change your vehicle'/);
assert.match(script, /paymentsCategory:'When is the next payment\?'/);
assert.match(script, /schedule\.delayed\?\(language==='en'\?'Friday, ':'Vineri, '\):\(language==='en'\?'no later than Friday, ':'cel târziu Vineri, '\)/);
assert.match(subfleetStyles, /\.hub-subfleet-support \{[\s\S]*?border-bottom: 1px solid var\(--hb-line\)/);
assert.doesNotMatch(subfleetStyles, /subfleet-browser|subfleet-sidebar|subfleet-view/);

assert.equal((subfleet.match(/RO53182698/g) || []).length, 0, 'The standalone sub-fleet interface has no site-operator footer');
assert.match(subfleet, /Întreabă administratorul flotei tale care este CUI-ul pentru decontare/);
assert.match(subfleet, /Oricând faci achiziții de produse sau servicii corespunzătoare domeniului de livrări/);
assert.match(subfleet, /Termenul, metoda de predare și momentul plății sunt stabilite de sub-flota ta\./);
assert.match(subfleet, /Ce decontează flota/);
assert.match(subfleet, /Ce NU decontează flota/);
assert.match(subfleet, /data-reimbursement-slug="ce-deconteaza"/);
assert.match(script, /hubTitle:'Courier Hub'/);
assert.match(script, /if\(!document\.querySelector\('\[data-card-payment\]'\)\)return/);

for (const html of [fleet, subfleet]) {
  assert.doesNotMatch(html, /Perioadele de plăți și ziua următoarei plăți/);
  assert.match(html, /Aplicațiile mobile oficiale/);
  assert.match(html, /Ghiduri Video și Tutoriale/);
}
assert.match(categoryStyles, /hub-category-shine/);
assert.match(categoryStyles, /hub-calendar-button/);
assert.match(categoryStyles, /hub-video-category/);

console.log('Sub-fleet Hub: standalone header/footer, shared payments, general reimbursement, ControlFleet and support actions passed.');
