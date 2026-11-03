const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('site-analytics.js', 'utf8');

async function runTracker({ pathname = '/campanii/', referrer = '' } = {}) {
  const requests = [];
  const location = { pathname, protocol: 'https:', origin: 'https://cibero.delivery' };
  const context = {
    URL,
    document: { referrer, readyState: 'complete' },
    window: { location, addEventListener() {} },
    fetch: async (url, options) => {
      requests.push({ url, options, body: JSON.parse(options.body) });
      return { ok: true };
    },
  };
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return requests;
}

(async () => {
  const direct = await runTracker();
  assert.equal(direct.length, 1);
  assert.deepEqual(direct[0].body, { path: '/campanii/', entry_kind: 'direct', referrer_host: null });

  const external = await runTracker({ referrer: 'https://www.google.com/search?q=cibero' });
  assert.equal(external.length, 1);
  assert.deepEqual(external[0].body, { path: '/campanii/', entry_kind: 'external', referrer_host: 'www.google.com' });

  const internal = await runTracker({ referrer: 'https://cibero.delivery/' });
  assert.equal(internal.length, 0, 'internal navigation must not be counted');

  const dashboard = await runTracker({ pathname: '/statistici/' });
  assert.equal(dashboard.length, 0, 'private analytics dashboard must not count itself');

  const activePages = [
    'index.html', 'beneficii/index.html', 'confidentialitate/index.html', 'cookie-uri/index.html',
    'campanii/index.html', 'hub/index.html', 'onboarding/index.html', 'orase/index.html',
    'platforme/index.html', 'termeni/index.html', 'subfleethub/index.html', 'subflote/index.html'
  ];
  activePages.forEach(file => assert.match(fs.readFileSync(file, 'utf8'), /site-analytics\.js\?v=1/, `${file} must include analytics`));
  assert.doesNotMatch(fs.readFileSync('admin/index.html', 'utf8'), /site-analytics\.js/, 'inactive admin route stays excluded');

  console.log('site analytics tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
