const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const footerStyles = [
  fs.readFileSync(path.join(root, 'site-footer.css'), 'utf8'),
  fs.readFileSync(path.join(root, 'public', 'site-footer.css'), 'utf8'),
];

for (const css of footerStyles) {
  assert.match(css, /html\[data-theme\] footer\.site-footer \{ background: transparent; \}/);
  assert.match(css, /border-top: 1px solid #d7b95342;/);
  assert.match(css, /\.site-footer \.footer-legal-links a \+ a \{ border-left:/);
}

const htmlFiles = [];
function collectHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', 'out'].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(fullPath);
    else if (entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}
collectHtml(root);

const linkedPages = htmlFiles.filter(file => /site-footer\.css\?v=/.test(fs.readFileSync(file, 'utf8')));
assert.ok(linkedPages.length > 0, 'At least one public page must use the shared footer stylesheet.');
for (const file of linkedPages) {
  const html = fs.readFileSync(file, 'utf8');
  assert.match(html, /site-footer\.css\?v=2/, `${path.relative(root, file)} must load the current footer stylesheet.`);
}

const appLayout = fs.readFileSync(path.join(root, 'app', 'layout.tsx'), 'utf8');
assert.match(appLayout, /site-footer\.css\?v=2/);

console.log(`Transparent footer background verified across ${linkedPages.length} public page files.`);
