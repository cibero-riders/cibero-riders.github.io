const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const copies = [
  ['campanii/campaigns-natural.css', 'campanii/index.html'],
  ['public/campanii/campaigns-natural.css', 'public/campanii/index.html'],
];

for (const [cssPath, htmlPath] of copies) {
  const css = fs.readFileSync(path.join(root, cssPath), 'utf8');
  const html = fs.readFileSync(path.join(root, htmlPath), 'utf8');
  assert.match(css, /\.campaign-shell \{ padding: 12px; border: 1px solid #d8b45270; border-radius: 22px;/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.campaign-shell \{ padding: 9px; border-radius: 18px; \}/);
  assert.doesNotMatch(css, /\.campaign-shell \{ padding: 0; border: 0; border-radius: 0;/);
  assert.match(html, /campaigns-natural\.css\?v=2/);
}

console.log('Campaign tabs container spacing and rounded outline verified for desktop and mobile.');
