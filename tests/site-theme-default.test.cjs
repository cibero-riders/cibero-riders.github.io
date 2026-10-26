const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const scripts = [
  fs.readFileSync(path.join(root, 'site-theme.js'), 'utf8'),
  fs.readFileSync(path.join(root, 'public', 'site-theme.js'), 'utf8'),
];

function runTheme(script, pathname, initialStorage = {}) {
  const values = new Map(Object.entries(initialStorage));
  const listeners = {};
  const document = {
    documentElement: { dataset: {} },
    querySelectorAll: () => [],
    querySelector: () => null,
    readyState: 'complete',
  };
  const localStorage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
  };
  const window = {
    location: { pathname },
    addEventListener: (type, callback) => { listeners[type] = callback; },
  };

  vm.runInNewContext(script, { document, localStorage, window, console });
  return { document, listeners, values };
}

for (const script of scripts) {
  const standard = runTheme(script, '/hub/');
  assert.equal(standard.document.documentElement.dataset.theme, 'night');
  assert.equal(standard.values.size, 0, 'the default must not be persisted as a user choice');

  const onboarding = runTheme(script, '/onboarding/');
  assert.equal(onboarding.document.documentElement.dataset.theme, 'midday');

  const legacyAutomaticMidday = runTheme(script, '/', { 'cibero-public-theme': 'midday' });
  assert.equal(legacyAutomaticMidday.document.documentElement.dataset.theme, 'night');

  const legacyDayChoice = runTheme(script, '/', { 'cibero-public-theme': 'light' });
  assert.equal(legacyDayChoice.document.documentElement.dataset.theme, 'light');
  assert.equal(legacyDayChoice.values.get('cibero-public-theme-user-choice'), '1');

  const explicitMidday = runTheme(script, '/', {
    'cibero-public-theme': 'midday',
    'cibero-public-theme-user-choice': '1',
  });
  assert.equal(explicitMidday.document.documentElement.dataset.theme, 'midday');

  explicitMidday.values.set('cibero-public-theme', 'night');
  explicitMidday.listeners.storage({ key: 'cibero-public-theme' });
  assert.equal(explicitMidday.document.documentElement.dataset.theme, 'night');
}

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.next' || entry.name === 'node_modules' || entry.name === '.git') return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

for (const file of htmlFiles(root)) {
  const html = fs.readFileSync(file, 'utf8');
  if (!/site-theme\.js\?v=5/.test(html)) continue;
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const expected = /(^|\/)onboarding\/index\.html$/.test(relative) ? 'midday' : 'night';
  assert.match(html, new RegExp(`<html lang="ro" data-theme="${expected}">`), relative);
  assert.match(html, /site-theme\.css\?v=13/, relative);
}

for (const cssPath of ['site-theme.css', path.join('public', 'site-theme.css')]) {
  const css = fs.readFileSync(path.join(root, cssPath), 'utf8');
  assert.match(css, /body:not\(\.onboarding-page\)::before/);
  assert.match(css, /onboarding\/assets\/onboarding-ornamental-background\.png/);
  assert.match(css, /html\[data-theme="light"\] body:not\(\.onboarding-page\)::before/);
  assert.match(css, /html\[data-theme="night"\] body:not\(\.onboarding-page\)::before/);
}

console.log('Site theme: Night default, onboarding exception, explicit cross-tab choice and ornamental background passed.');
