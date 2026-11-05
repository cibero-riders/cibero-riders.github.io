const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const scripts = ['site-theme.js', 'public/site-theme.js'].map(file => fs.readFileSync(path.join(root, file), 'utf8'));

function runTheme(script, initialSession = {}) {
  const values = new Map(Object.entries(initialSession));
  const listeners = {};
  const messages = [];
  let receive;
  let navigate;
  let channelClosed = false;
  const document = {
    documentElement: { dataset: {} },
    querySelectorAll: () => [],
    querySelector: () => null,
    readyState: 'complete',
  };
  const sessionStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
  class BroadcastChannel {
    addEventListener(type, callback) { receive = callback; }
    postMessage(data) { messages.push(data); }
    close() { channelClosed = true; }
  }
  const window = {
    location: { origin: 'https://cibero.delivery' },
    navigation: { addEventListener: (type, callback) => { navigate = callback; } },
    addEventListener: (type, callback) => { listeners[type] = callback; },
  };
  vm.runInNewContext(script, { document, sessionStorage, BroadcastChannel, window, URL, console });
  return { document, values, listeners, messages, receive: data => receive({ data }), navigate: url => navigate({ destination: { url } }), isClosed: () => channelClosed };
}

for (const script of scripts) {
  const visit = runTheme(script);
  assert.equal(visit.document.documentElement.dataset.theme, 'midday');
  assert.equal(visit.values.size, 0, 'the default is not saved permanently');
  assert.equal(visit.messages[0].type, 'request', 'new tabs ask existing tabs for their current theme');
  visit.receive({ type: 'choice', theme: 'night' });
  assert.equal(visit.document.documentElement.dataset.theme, 'night');
  assert.equal(visit.values.get('cibero-session-theme'), 'night');
  visit.receive({ type: 'request' });
  assert.equal(visit.messages.at(-1).theme, 'night', 'existing tabs share the selected theme');
  visit.receive({ type: 'choice', theme: 'invalid' });
  assert.equal(visit.document.documentElement.dataset.theme, 'night');
  const internalNavigation = runTheme(script, Object.fromEntries(visit.values));
  assert.equal(internalNavigation.document.documentElement.dataset.theme, 'night', 'navigation and refresh preserve this visit');
  internalNavigation.navigate('https://cibero.delivery/hub/');
  assert.equal(internalNavigation.values.get('cibero-session-theme'), 'night');
  internalNavigation.navigate('https://example.com/');
  assert.equal(internalNavigation.values.size, 0, 'leaving the site clears the visit preference');
  visit.listeners.pagehide();
  assert.equal(visit.isClosed(), true, 'departed tabs no longer respond to other tabs');
  assert.equal(runTheme(script).document.documentElement.dataset.theme, 'midday', 'reopening after all tabs close starts at Midday');
  assert.equal(runTheme(script, Object.fromEntries(internalNavigation.values)).document.documentElement.dataset.theme, 'midday');
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
  if (!/site-theme\.js\?v=7/.test(html)) continue;
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const expected = 'midday';
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

for (const cssPath of ['site-navigation.css', path.join('public', 'site-navigation.css')]) {
  const css = fs.readFileSync(path.join(root, cssPath), 'utf8');
  assert.match(css, /html\[data-theme\] \.global-header \.brand-wordmark img \{[\s\S]*?filter: none;[\s\S]*?opacity: 1;/);
  assert.doesNotMatch(css, /html\[data-theme="night"\] \.global-header \.brand-wordmark img[\s\S]*?grayscale/);
}

const onboardingDisplayThemes = fs.readFileSync(path.join(root, 'onboarding', 'display-themes.css'), 'utf8');
assert.match(onboardingDisplayThemes, /html\[data-theme="night"\] \.onboarding-page \.site-title \.header-art \{[\s\S]*?grayscale\(1\)/);

console.log('Site theme: Midday default, session lifetime, cross-tab choice and ornamental background passed.');
