const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const fleet = fs.readFileSync(path.join(root, 'hub', 'index.html'), 'utf8');
const subfleet = fs.readFileSync(path.join(root, 'subfleethub', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'hub', 'hub.js'), 'utf8');

assert.match(fleet, /Hub-ul Flotei CibeRO/);
assert.match(fleet, /data-hub-i18n="hubSubtitle"/);
assert.match(subfleet, /Hub-ul Sub-Flotelor CibeRO/);
assert.match(subfleet, /data-hub-variant="subfleet"/);
assert.match(subfleet, /href="https:\/\/cibero\.delivery\/subfleethub\/"/);
assert.match(subfleet, /\.\.\/hub\/hub\.js\?v=25/);

for (const id of ['aplicatii-mobile', 'ghiduri-video', 'reguli-cash-si-reset', 'decontare', 'faq-platforme', 'echipament-oficial']) {
  assert.match(subfleet, new RegExp(`id="${id}"`));
}
for (const id of ['plati', 'urmatoarea-plata', 'calendarul-de-plata', 'comunicare-whatsapp']) {
  assert.doesNotMatch(subfleet, new RegExp(`id="${id}"`));
}
for (const text of ['ControlFleet', 'Strada Farului', 'Strada Tudor Vladimirescu', 'eatsdelivery.bolt.host', 'data-card-payment', 'data-poster-link', 'hub-action-grid hub-essential-actions']) {
  assert.doesNotMatch(subfleet, new RegExp(text.replaceAll('.', '\\.')));
}

assert.equal((subfleet.match(/RO53182698/g) || []).length, 1, 'The site operator CUI belongs in the legal footer only');
assert.match(subfleet, /Întreabă administratorul flotei tale care este CUI-ul pentru decontare/);
assert.match(subfleet, /data-reimbursement-slug="ce-deconteaza"/);
assert.match(script, /CIBERO Sub-Fleets Hub/);
assert.match(script, /if\(!document\.querySelector\('\[data-card-payment\]'\)\)return/);

console.log('Sub-fleet Hub: general resources, fleet-specific exclusions, shared translations and deep links passed.');
