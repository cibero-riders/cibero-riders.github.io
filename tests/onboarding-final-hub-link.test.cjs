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
  assert.match(script, /whatsappCommunity: 'https:\/\/chat\.whatsapp\.com\/L1P5tryfmsxG23HEjkO6bH'/);
  assert.match(script, /whatsappAnnouncements: 'https:\/\/chat\.whatsapp\.com\/HhF6ACi1A2YC7tDjoOxMwJ'/);
  assert.match(script, /function joinWhatsAppCommunity/);
  assert.match(script, /function joinWhatsAppAnnouncements/);
  assert.match(script, /Intră în grupurile flotei de WhatsApp/);
  assert.match(script, /Comunicarea o desfășurăm pe WhatsApp/);
  assert.doesNotMatch(script, /PLLEIvJ6LBUOs/);
  assert.doesNotMatch(script, /telegramGuides|joinTelegram|closeTelegramGuide/);
  assert.match(script, /function renderSelectionChange\(\)\{suppressNextSelectionAnimation=true;render\(\)\}/);
  assert.match(script, /confirmBoltPlaylist\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(script, /confirmEquipment\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(script, /confirmCalendarVideo\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(script, /confirmRegistrationReturn\(confirmed\)\{[^}]*renderSelectionChange\(\)/);
  assert.match(styles, /#app\.instant-selection-update \.guided-reveal/);
  assert.doesNotMatch(styles, /\.telegram-guide-option|\.telegram-video-modal/);
  assert.match(html, /styles\.css\?v=whatsapp-restore-1/);
  assert.match(html, /app\.js\?v=whatsapp-restore-1/);
}

console.log('Both onboarding copies use the WhatsApp handoff and keep instant checkbox updates.');
