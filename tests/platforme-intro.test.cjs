const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'platforme', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'platforme', 'platforme.css'), 'utf8');
const translations = [
  fs.readFileSync(path.join(root, 'site-language.js'), 'utf8'),
  fs.readFileSync(path.join(root, 'public', 'site-language.js'), 'utf8'),
];

assert.doesNotMatch(html, /CibeRO · GHID PLATFORME|platforms-kicker/);
assert.match(html, /Află diferențele dintre platformele de delivery\./);
assert.doesNotMatch(html, /Află care platformă ți se potrivește cel mai mult\./);
assert.match(html, /platforme\.css\?v=10/);
assert.match(html, /site-language\.js\?v=16/);
assert.match(css, /\.platforms-page \{[^}]*padding: 44px 0 88px;/);
assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.platforms-page \{[^}]*padding: 28px 0 64px;/);

for (const source of translations) {
  assert.match(source, /'Află diferențele dintre platformele de delivery\.': 'Discover the differences between delivery platforms\.'/);
  assert.doesNotMatch(source, /CibeRO · GHID PLATFORME|Find out which platform suits you best\./);
}

console.log('Platforms intro: shorter heading block, updated subtitle and RO/EN copy passed.');
