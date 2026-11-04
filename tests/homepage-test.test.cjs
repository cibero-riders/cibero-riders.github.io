const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'homepage-test', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'homepage-test', 'homepage-test.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'homepage-test', 'homepage-test.js'), 'utf8');

assert.match(html, /name="robots" content="noindex, nofollow"/, 'The demo is excluded from search indexing');
assert.match(html, /role="tablist"/);
assert.match(html, /data-choice="courier"/);
assert.match(html, /data-choice="subfleet"/);
assert.match(html, /data-choice-panel="courier"[^>]*hidden/);
assert.match(html, /data-choice-panel="subfleet"[^>]*hidden/);
assert.match(html, /Ce primești ca sub-flotă/);
assert.match(html, /Întrebări frecvente pentru sub-flote/);
assert.match(html, /cibero-subfleet-network-infographic\.png/);
assert.match(css, /\.choice-toggle-slider::after/);
assert.match(css, /animation: choice-shine/);
assert.match(js, /ArrowLeft/);
assert.match(js, /history\.replaceState/);
assert.match(js, /fetch\('\.\.\/index\.html'/, 'The courier tab mirrors the current public homepage');
assert.match(js, /benefitTitle\.textContent = 'Ce primești ca și curier'/);
assert.doesNotMatch(js, /activate\([^)]*false\)/, 'No audience is selected automatically on entry');
assert.match(html, /https:\/\/wa\.me\/40736364334/);

console.log('Homepage audience demo checks passed.');
