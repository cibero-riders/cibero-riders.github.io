const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const privacyHtml = fs.readFileSync(path.join(root, 'confidentialitate', 'index.html'), 'utf8');
const legalSource = fs.readFileSync(path.join(root, 'components', 'site', 'legal-page.tsx'), 'utf8');
const languageSources = [
  fs.readFileSync(path.join(root, 'site-language.js'), 'utf8'),
  fs.readFileSync(path.join(root, 'public', 'site-language.js'), 'utf8'),
];

const operatorSection = privacyHtml.split('<h2>1. Operatorul datelor</h2>')[1].split('</section>')[0];
assert.doesNotMatch(operatorSection, /\+40 736 364 334/);
assert.match(operatorSection, /Contact: cibero\.riders@gmail\.com\./);
assert.match(legalSource, /items: privacyContact/);
assert.match(legalSource, /privacyContact = contact\.filter\(\(item\) => !item\.startsWith\("Telefon:"\)\)/);

for (const languageSource of languageSources) {
  const privacyTranslation = languageSource.split("'1. Operatorul datelor': '1. Data controller'")[1].split("'2. Date și scopuri'")[0];
  assert.doesNotMatch(privacyTranslation, /\+40 736 364 334/);
  assert.match(privacyTranslation, /Contact: cibero\.riders@gmail\.com\./);
}

console.log('Privacy page: the phone number is absent from the data-controller section in RO and EN.');
