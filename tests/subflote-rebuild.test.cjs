const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'subflote', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'subflote', 'subflote.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'subflote', 'subflote.js'), 'utf8');

const formUrl = 'https://cibero-manager-tool.bolt.host/inscriere';
assert.ok((html.match(new RegExp(formUrl, 'g')) || []).length >= 2, 'Both primary CTAs use the registration form');
assert.match(html, /selectează opțiunea „SRL”/i, 'The hero explains that applicants must select SRL');
assert.match(html, /CIBERO Manager/);
assert.match(html, /Tu îți dezvolți echipa —/);
assert.match(css, /\.sf-hero-heading \{[^}]*text-align: center/, 'The sub-fleet hero heading follows the centered sub-page format');
assert.doesNotMatch(html, /PARTENERIAT PENTRU SUB-FLOTE/, 'The hero opens directly with its main heading');
assert.match(css, /\.sf-hero h1 \{[^}]*font-size: clamp\(50px, 5\.8vw, 74px\)/, 'The main hero heading has stronger sub-page scale');
assert.match(css, /padding: clamp\(36px, 4\.5vw, 58px\) 0 58px/, 'The compact hero begins close to the site header');
assert.match(css, /font-size: clamp\(44px, 12vw, 60px\)/, 'The stronger hero scale carries through to mobile');
assert.match(html, /class="sf-hero-media"[\s\S]*?class="sf-infographic"[\s\S]*?class="sf-video-showcase"/, 'The infographic leads the hero media and the presentation video sits beside it');
assert.match(html, /data-video-src="\.\.\/assets\/cibero-subflote-promo\.mp4"/, 'The copyright-safe local presentation video is featured in the hero');
assert.doesNotMatch(html, /Descoperă parteneriatul CIBERO pentru sub-flote/, 'The long video heading was removed');
assert.doesNotMatch(html, /class="sf-video-eyebrow"|class="sf-video-arrow"/, 'The video is presented without the redundant heading and arrows');
assert.match(css, /\.sf-video-frame \{[\s\S]*?aspect-ratio: 9 \/ 16/, 'The local presentation video keeps a vertical frame');
assert.match(html, /assets\/cibero-subfleet-network-infographic\.png/, 'The new operational-network infographic is included');
assert.doesNotMatch(html, /CIBERO Manager îți oferă un singur loc/, 'The redundant hero description was removed');
assert.match(css, /\.subfleet-body \{[\s\S]*?margin: 0;/, 'The page removes the browser body margin so the header reaches every viewport edge');
assert.match(html, /subflote\.css\?v=15/, 'The refreshed Sub-fleet stylesheet version is loaded');
assert.match(html, /class="sf-infographic"[\s\S]*?target="_blank"/, 'The infographic can be opened at full size');
assert.match(css, /\.sf-infographic a \{[^}]*border-radius: 28px/, 'The infographic has rounded corners');
assert.doesNotMatch(html, /class="sf-platform-strip"/, 'The redundant platform strip was removed');
assert.doesNotMatch(html, /class="sf-section sf-summary"/, 'The repeated closing summary was removed');
assert.ok((html.match(/class="sf-check-list/g) || []).length >= 6, 'The compact information groups remain present');
assert.match(css, /\.sf-hero-media \{[^}]*grid-template-columns: minmax\(0, 1\.78fr\) minmax\(220px, \.5625fr\)/, 'The infographic receives the main desktop width while the vertical video sits beside it');
assert.match(css, /@media \(max-width: 980px\) \{[\s\S]*?\.sf-hero-media \{ grid-template-columns: 1fr; \}/, 'The infographic and video stack cleanly on smaller screens');
assert.match(html, /Administrarea curierilor Bolt Food/);
assert.match(html, /Control cash și protecție antifraudă/);
assert.match(html, /Liste de așteptare și înscrieri/);
assert.match(html, /Sprijin pentru recrutare și acces la leaduri/);
assert.match(html, /Sistem de tichete și suport/);
assert.match(html, /Rapoarte și administrare financiară/);
assert.match(html, /Sprijin pentru curierii din sub-flota ta/);
assert.doesNotMatch(html, /mailto:cibero\.riders@gmail\.com\?subject=Parteneriat/);

const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]);
for (const key of new Set(keys)) {
  assert.match(js, new RegExp(`\\b${key}:`), `English translation exists for ${key}`);
}

assert.match(css, /@media \(max-width: 760px\)/, 'Mobile layout is present');
assert.match(css, /html\[data-theme="light"\] \.subfleet-body/, 'Light theme is explicitly styled');
assert.match(css, /html\[data-theme="midday"\] \.subfleet-body/, 'Midday theme is explicitly styled');

console.log('Sub-fleet landing page checks passed.');
