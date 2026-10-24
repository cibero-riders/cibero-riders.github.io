const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'campanii', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'campanii', 'campanii.js'), 'utf8');

assert.match(html, /data-i18n="biweeklyCampaign">Campanie bi-săptămânală/);
assert.match(html, /CAMPANIE BI-SĂPTĂMÂNALĂ/);
assert.match(html, /cele 2 săptămâni de desfășurare a campaniei/);
assert.match(html, /campanii\.js\?v=14/);
assert.doesNotMatch(html, /data-i18n="weeklyCampaign"/);

for (const expected of [
  "biweeklyCampaign: 'CAMPANIE BI-SĂPTĂMÂNALĂ'",
  "biweeklyCampaign: 'BIWEEKLY CAMPAIGN'",
  'Șanse bi-săptămânale automate pentru toți curierii activi.',
  'Automatic biweekly chances for all active couriers.',
  'La finalul celor 2 săptămâni',
  'At the end of the 2 weeks'
]) {
  assert.match(script, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.doesNotMatch(script, /^\s*weeklyCampaign:/m);
assert.doesNotMatch(script, /during the campaign week|following the campaign week|week in which the campaign takes place/);

console.log('Campaigns: the Raffle uses a two-week cadence in Romanian and English.');
