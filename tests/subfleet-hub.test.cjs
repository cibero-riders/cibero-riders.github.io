const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const fleet = fs.readFileSync(path.join(root, 'hub', 'index.html'), 'utf8');
const subfleet = fs.readFileSync(path.join(root, 'subfleethub', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'hub', 'hub.js'), 'utf8');

assert.match(fleet, /Hub-ul Flotei CibeRO/);
assert.match(fleet, /data-hub-i18n="hubSubtitle"/);
assert.match(subfleet, /HUB Sub-flote Cibero/);
assert.match(subfleet, /data-hub-variant="subfleet"/);
assert.match(subfleet, /href="https:\/\/cibero\.delivery\/subfleethub\/"/);
assert.match(subfleet, /\.\.\/hub\/hub\.js\?v=27/);

for (const id of ['aplicatii-mobile', 'plati', 'urmatoarea-plata', 'calendarul-de-plata', 'ghiduri-video', 'reguli-cash-si-reset', 'decontare', 'faq-platforme', 'echipament-oficial']) {
  assert.match(subfleet, new RegExp(`id="${id}"`));
}
for (const id of ['comunicare-whatsapp']) {
  assert.doesNotMatch(subfleet, new RegExp(`id="${id}"`));
}
for (const text of ['Strada Farului', 'Strada Tudor Vladimirescu', 'eatsdelivery.bolt.host', 'CUI-ul CibeRO din footer', 'flotei CibeRO fără confirmare']) {
  assert.doesNotMatch(subfleet, new RegExp(text.replaceAll('.', '\\.')));
}

assert.match(subfleet, /data-hub-quick="aplicatii-mobile\/controlfleet"/);
assert.match(subfleet, /data-app-platform="controlfleet"/);
assert.match(subfleet, /data-app-panel="controlfleet"/);
assert.match(subfleet, /https:\/\/play\.google\.com\/store\/apps\/details\?id=ro\.controlfleet\.employee/);
assert.match(subfleet, /id="suport-si-solicitari"/);
assert.match(subfleet, /class="hub-action-grid hub-essential-actions hub-subfleet-support-actions"/);
assert.match(subfleet, /<button class="hub-action" type="button" disabled>[\s\S]*?Deschide un ticket[\s\S]*?În curând[\s\S]*?<\/button>/);
assert.match(subfleet, /<a class="hub-action" href="https:\/\/cibero-manager-tool\.bolt\.host\/cibero-curieri-vehicle"/);
assert.match(script, /subfleetTicketComingSoon:'Coming soon'/);

assert.equal((subfleet.match(/RO53182698/g) || []).length, 1, 'The site operator CUI belongs in the legal footer only');
assert.match(subfleet, /Întreabă administratorul flotei tale care este CUI-ul pentru decontare/);
assert.match(subfleet, /Oricând faci achiziții de produse sau servicii corespunzătoare domeniului de livrări/);
assert.match(subfleet, /Termenul, metoda de predare și momentul plății sunt stabilite de sub-flota ta\./);
assert.match(subfleet, /Ce decontează flota/);
assert.match(subfleet, /Ce NU decontează flota/);
assert.match(subfleet, /data-reimbursement-slug="ce-deconteaza"/);
assert.match(script, /CIBERO Sub-Fleets Hub/);
assert.match(script, /if\(!document\.querySelector\('\[data-card-payment\]'\)\)return/);

const paymentBlock = html => html.split('        <details id="plati"')[1].split('        <details id="ghiduri-si-informatii"')[0];
assert.equal(paymentBlock(subfleet).replaceAll('../hub/assets/calendar-', 'assets/calendar-'), paymentBlock(fleet));

console.log('Sub-fleet Hub: shared payments, general reimbursement, ControlFleet and support actions passed.');
