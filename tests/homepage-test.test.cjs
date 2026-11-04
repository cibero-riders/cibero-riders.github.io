const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'homepage-test', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'homepage-test', 'homepage-test.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'homepage-test', 'homepage-test.js'), 'utf8');

assert.match(html, /name="robots" content="noindex, nofollow"/, 'The demo is excluded from search indexing');
assert.match(html, /role="tablist"/);
assert.match(html, /data-audience-tab="courier"/);
assert.match(html, /data-audience-tab="subfleet"/);
assert.match(html, /data-audience-panel="courier"/);
assert.match(html, /data-audience-panel="subfleet"/);
assert.match(html, /Ce oferim/);
assert.match(html, /Ce cerem \/ Condiții/);
assert.match(html, /Ce e bine să știi dinainte/);
assert.match(html, /cibero-subfleet-network-infographic\.png/);
assert.match(css, /\.audience-tab-glow::after/);
assert.match(css, /animation: audience-shine/);
assert.match(js, /ArrowLeft/);
assert.match(js, /history\.replaceState/);
assert.match(html, /https:\/\/wa\.me\/40736364334/);

console.log('Homepage audience demo checks passed.');
