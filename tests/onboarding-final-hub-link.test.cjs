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
  assert.match(script, /button:'Vezi ghidul pentru crearea unui cont Telegram',id:'juBx-JwoBaA',format:'short'/);
  assert.match(script, /button:'Vezi ghidul pentru onboarding-ul pe Telegram',id:'44GbSXgUQV0',format:'wide'/);
  assert.match(script, /button:'Vezi ghidul pentru folosirea Hub-ului CIBERO',id:'D1gdobmjeDY',format:'wide'/);
  assert.match(script, /onclick="if\(event\.target===this\)closeTelegramGuide\(\)"/);
  assert.match(script, /Înapoi la ghiduri/);
  assert.match(script, /event\.key==='Escape'/);
  assert.match(script, /function renderSelectionChange\(\)\{suppressNextSelectionAnimation=true;render\(\)\}/);
  assert.match(script, /confirmBoltPlaylist\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(script, /confirmEquipment\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(script, /confirmCalendarVideo\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(script, /confirmRegistrationReturn\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(script, /toggleTelegramGuides/);
  assert.match(script, /Afișează ghidurile/);
  assert.match(styles, /\.telegram-guide-option\{/);
  assert.match(styles, /\.telegram-guide-trigger\{/);
  assert.match(styles, /\.telegram-video-modal\{/);
  assert.match(styles, /\.telegram-video-dialog\.is-short \.playlist-player\{[^}]*aspect-ratio:9\/16/);
  assert.match(styles, /#app\.instant-selection-update \.guided-reveal/);
  assert.match(html, /styles\.css\?v=onboarding-checkboxes-1/);
  assert.match(html, /app\.js\?v=onboarding-checkboxes-1/);
}

console.log('Onboarding completion screen links to the original CIBERO Hub in both published copies.');
