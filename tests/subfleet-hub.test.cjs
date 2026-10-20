const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const fleet = fs.readFileSync(path.join(root, 'hub', 'index.html'), 'utf8');
const subfleet = fs.readFileSync(path.join(root, 'subfleethub', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'hub', 'hub.js'), 'utf8');
const categoryStyles = fs.readFileSync(path.join(root, 'hub', 'hub-categories.css'), 'utf8');
const themeScript = fs.readFileSync(path.join(root, 'site-theme.js'), 'utf8');
const subfleetNavigation = fs.readFileSync(path.join(root, 'subfleethub', 'subfleet-navigation.js'), 'utf8');
const subfleetStyles = fs.readFileSync(path.join(root, 'subfleethub', 'subfleet.css'), 'utf8');

assert.match(fleet, /Hub-ul Flotei CibeRO/);
assert.match(fleet, /data-hub-i18n="hubSubtitle"/);
assert.match(subfleet, /<h1 id="hub-title" data-hub-i18n="hubTitle">Courier Hub<\/h1>/);
assert.match(subfleet, /data-hub-variant="subfleet"/);
assert.match(subfleet, /href="https:\/\/cibero\.delivery\/subfleethub\/"/);
assert.match(subfleet, /subfleet-navigation\.js\?v=2/);
assert.match(subfleet, /subfleet\.css\?v=5/);
assert.match(subfleet, /\.\.\/hub\/hub\.js\?v=29/);
assert.match(subfleet, /\.\.\/hub\/hub-categories\.css\?v=5/);
assert.match(fleet, /hub-categories\.css\?v=5/);
for (const html of [fleet, subfleet]) {
  assert.doesNotMatch(html, /hub-quick-actions|hub-quick-button|data-hub-quick|has-quick-actions/);
  for (const id of ['aplicatii-mobile', 'plati', 'ghiduri-si-informatii', 'echipament-oficial']) {
    assert.match(html, new RegExp(`<details id="${id}" class="hub-category-accordion`));
  }
  assert.match(html, /data-app-platform="controlfleet"/);
  assert.match(html, /id="urmatoarea-plata"/);
  assert.match(html, /id="ghiduri-video"/);
}
assert.match(categoryStyles, /text-transform: uppercase/);
assert.doesNotMatch(script, /data-hub-quick/);
const header = subfleet.split('<header class="subfleet-header"')[1].split('</header>')[0];
assert.match(header, /public-language-switch/);
assert.doesNotMatch(header, /brand|social|main-nav|menu-toggle|nav-account|<nav|href=/);
assert.match(themeScript, /\.subfleet-header/);
assert.match(subfleet, /\.\.\/site-theme\.js\?v=4/);
assert.doesNotMatch(subfleet, /site-navigation\.css|site-footer\.css|main-page\.js/);
assert.match(subfleet, /<footer class="subfleet-footer">© Powered by Cibero - 2026 \| All rights reserved<\/footer>/);

for (const id of ['aplicatii-mobile', 'plati', 'urmatoarea-plata', 'calendarul-de-plata', 'ghiduri-video', 'reguli-cash-si-reset', 'decontare', 'faq-platforme', 'echipament-oficial']) {
  assert.match(subfleet, new RegExp(`id="${id}"`));
}
for (const id of ['comunicare-whatsapp']) {
  assert.doesNotMatch(subfleet, new RegExp(`id="${id}"`));
}
for (const text of ['Strada Farului', 'Strada Tudor Vladimirescu', 'eatsdelivery.bolt.host', 'CUI-ul CibeRO din footer', 'flotei CibeRO fără confirmare']) {
  assert.doesNotMatch(subfleet, new RegExp(text.replaceAll('.', '\\.')));
}

assert.match(subfleet, /data-app-platform="controlfleet"/);
assert.match(subfleet, /data-app-panel="controlfleet"/);
assert.match(subfleet, /https:\/\/play\.google\.com\/store\/apps\/details\?id=ro\.controlfleet\.employee/);
assert.match(subfleet, /id="suport-si-solicitari"/);
assert.ok(subfleet.indexOf('id="suport-si-solicitari"') < subfleet.indexOf('id="instrumente-si-suport"'), 'Support actions appear above the four menu categories');
assert.match(subfleet, /class="hub-action-grid hub-essential-actions hub-subfleet-support-actions"/);
assert.match(subfleet, /<button class="hub-action" type="button" disabled>[\s\S]*?Deschide un ticket[\s\S]*?În curând[\s\S]*?<\/button>/);
assert.match(subfleet, /<a class="hub-action" href="https:\/\/cibero-manager-tool\.bolt\.host\/cibero-curieri-vehicle" target="_blank" rel="noopener noreferrer"/);
assert.match(script, /subfleetTicketComingSoon:'Coming soon'/);
assert.match(subfleetNavigation, /location\.hash = route/);
assert.match(subfleetNavigation, /window\.addEventListener\('hashchange', sync\)/);
assert.match(subfleetNavigation, /document\.addEventListener\('cibero:language-change', refreshLabels\)/);
assert.match(subfleetNavigation, /menuReturn\.addEventListener\('click'/);
assert.match(subfleetStyles, /grid-template-columns: minmax\(235px, 290px\) minmax\(0, 1fr\)/);
assert.match(subfleetStyles, /@media \(max-width: 900px\)/);

assert.equal((subfleet.match(/RO53182698/g) || []).length, 0, 'The standalone sub-fleet interface has no site-operator footer');
assert.match(subfleet, /Întreabă administratorul flotei tale care este CUI-ul pentru decontare/);
assert.match(subfleet, /Oricând faci achiziții de produse sau servicii corespunzătoare domeniului de livrări/);
assert.match(subfleet, /Termenul, metoda de predare și momentul plății sunt stabilite de sub-flota ta\./);
assert.match(subfleet, /Ce decontează flota/);
assert.match(subfleet, /Ce NU decontează flota/);
assert.match(subfleet, /data-reimbursement-slug="ce-deconteaza"/);
assert.match(script, /hubTitle:'Courier Hub'/);
assert.match(script, /if\(!document\.querySelector\('\[data-card-payment\]'\)\)return/);

const paymentBlock = html => html.split('        <details id="plati"')[1].split('        <details id="ghiduri-si-informatii"')[0];
assert.equal(paymentBlock(subfleet).replaceAll('../hub/assets/calendar-', 'assets/calendar-'), paymentBlock(fleet));

console.log('Sub-fleet Hub: standalone header/footer, shared payments, general reimbursement, ControlFleet and support actions passed.');
