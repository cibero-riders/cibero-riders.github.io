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
  assert.doesNotMatch(script, /PLLEIvJ6LBUOs/);
  assert.match(script, /telegramGuideCard\(1,'Cum îți creezi cont pe Telegram','juBx-JwoBaA'\)/);
  assert.match(script, /telegramGuideCard\(2,'Cum faci onboarding-ul pe Telegram','44GbSXgUQV0'\)/);
  assert.match(script, /telegramGuideCard\(3,'Cum să folosești Hub-ul CIBERO de pe Telegram','D1gdobmjeDY'\)/);
  assert.match(script, /toggleTelegramGuides/);
  assert.match(script, /Afișează ghidurile/);
  assert.match(styles, /\.telegram-guide-option\{/);
  assert.match(styles, /\.telegram-guide-card\{/);
  assert.match(html, /styles\.css\?v=telegram-guides-2/);
  assert.match(html, /app\.js\?v=telegram-guides-2/);
}

console.log('Onboarding completion screen links to the original CIBERO Hub in both published copies.');
