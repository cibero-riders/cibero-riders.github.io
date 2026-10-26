const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const copies = ['onboarding', path.join('public', 'onboarding')];

for (const directory of copies) {
  const script = fs.readFileSync(path.join(root, directory, 'app.js'), 'utf8');
  const styles = fs.readFileSync(path.join(root, directory, 'styles.css'), 'utf8');
  const html = fs.readFileSync(path.join(root, directory, 'index.html'), 'utf8');

  assert.match(script, /hub: 'https:\/\/cibero\.delivery\/hub\/'/);
  assert.match(script, /Materiale de pregătire, instrumente și informații esențiale\./);
  assert.match(script, /Află din Hub/);
  assert.match(script, /Tombola bi-săptămânală/);
  assert.doesNotMatch(script, /Tombola săptămânală/);
  assert.match(script, /class="campaign-completion hub-completion" href="\$\{links\.hub\}" target="_blank" rel="noopener noreferrer"/);
  assert.match(styles, /\.campaign-completion\.hub-completion\{margin-top:14px;/);
  assert.match(styles, /\.hub-resource-badge\{/);
  assert.match(html, /styles\.css\?v=final-hub-1/);
  assert.match(html, /app\.js\?v=final-hub-1/);
}

console.log('Onboarding completion screen links to the original CIBERO Hub in both published copies.');
