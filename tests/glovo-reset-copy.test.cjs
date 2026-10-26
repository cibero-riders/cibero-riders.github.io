const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');
const platformHtml = read('platforme/index.html');
const languageSources = [read('site-language.js'), read('public/site-language.js')];
const hubHtmlSources = [read('hub/index.html'), read('subfleethub/index.html')];
const hubScript = read('hub/hub.js');

const cashRow = platformHtml.match(/<th scope="row">Cash \/ bani numerar<\/th>([\s\S]*?)<\/tr>/)?.[1];
assert.ok(cashRow, 'The platform cash comparison row must exist.');
const platformCells = [...cashRow.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(match => match[1]);
assert.equal(platformCells.length, 3, 'The cash row must keep one cell per platform.');
assert.match(platformCells[0], /duminică, ora 23:59/, 'Bolt must keep its Sunday deadline.');
assert.match(platformCells[1], /resetul Glovo de marți, până la ora 14:00/, 'Glovo must show its Tuesday 14:00 reset.');
assert.doesNotMatch(platformCells[1], /duminică|23:59/i, 'Glovo must not inherit Bolt’s Sunday deadline.');
assert.match(platformHtml, /site-language\.js\?v=17/);

for (const source of languageSources) {
  assert.match(source, /'Depune integral balanța înainte de resetul Glovo de marți, până la ora 14:00\.': 'Deposit the full balance before Glovo’s Tuesday reset, by 14:00\.'/);
  assert.doesNotMatch(source, /duminică[^'\n]*SelfPay|Sunday[^'\n]*SelfPay/i);
}

for (const source of hubHtmlSources) {
  const glovoRule = source.match(/data-rule-platform="glovo"([\s\S]*?)<\/article>/)?.[1];
  assert.ok(glovoRule, 'Each hub must contain the Glovo cash rule.');
  assert.match(glovoRule, /Marți, până în ora 14:00/);
  assert.doesNotMatch(glovoRule, /duminică|luni[^<]*23:59/i);
}

assert.match(hubScript, /glovoResetRule1:'Glovo’s main reset takes place every <strong>Tuesday by 14:00<\/strong>\./);
assert.match(hubScript, /function glovoResetDate\(now\)/);

console.log('Glovo reset and deposit information is consistent across platforms and both hubs.');
