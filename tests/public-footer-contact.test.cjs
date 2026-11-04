const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = [
  'index.html',
  'beneficii/index.html',
  'campanii/index.html',
  'confidentialitate/index.html',
  'cookie-uri/index.html',
  'homepage-test/index.html',
  'hub/index.html',
  'onboarding/index.html',
  'orase/index.html',
  'platforme/index.html',
  'subfleethub/index.html',
  'subflote/index.html',
  'termeni/index.html'
];

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  assert.match(html, /href="tel:\+40736364334"/, `${page} exposes the clickable administrator phone number`);
  assert.match(html, /href="https:\/\/wa\.me\/40736364334"/, `${page} sends Contact to the administrator on WhatsApp`);
  assert.match(html, /Powered by CibeRO – 2026 \| Toate drepturile rezervate/, `${page} uses the unified Romanian copyright`);
  assert.doesNotMatch(html, /mailto:cibero\.riders@gmail\.com">Contact/, `${page} no longer sends Contact to email`);
}

console.log('Public footer and contact checks passed.');
