const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');

const source = stripTypeScriptTypes(fs.readFileSync('supabase/functions/submit-ticket/index.ts', 'utf8').replace(/^import [^\n]*\n/, ''));
function harness(active = false) {
  let handler, inserted;
  const query = { select() { return this; }, eq() { return this; }, in() { return Promise.resolve({ count: active ? 1 : 0, error: null }); }, async insert(data) { inserted = data; return { error: null }; } };
  const context = { Request, Response, FormData, File, crypto, console, createClient: () => ({ from: () => query }), Deno: { env: { get: key => ({ SUPABASE_URL: 'https://example.test', SUPABASE_SERVICE_ROLE_KEY: 'test-only' })[key] }, serve: callback => { handler = callback; } } };
  vm.runInNewContext(source, context);
  return { send: async overrides => {
    const values = { action: 'submit', email: 'transfer@example.test', phone: '0700000000', first_name: 'Test', last_name: 'Transfer', category: 'probleme_admin', request_type: 'transfer_cont', confirmed: 'true', transfer_checklist_confirmed: 'true', new_city: 'Brașov', platforms: 'Bolt Food,Wolt', notes: 'Test local only', ...overrides };
    const form = new FormData(); Object.entries(values).forEach(([key, value]) => form.set(key, value));
    const response = await handler(new Request('https://example.test/submit-ticket', { method: 'POST', headers: { origin: 'https://cibero-riders.github.io' }, body: form }));
    return { status: response.status, result: await response.json(), inserted };
  } };
}

test('accepts every nonempty combination, preserving both 2000-character answers', async () => {
  for (const platforms of ['Bolt Food', 'Glovo', 'Wolt', 'Bolt Food,Glovo', 'Bolt Food,Wolt', 'Glovo,Wolt', 'Bolt Food,Glovo,Wolt']) {
    const { status, inserted } = await harness().send({ platforms, transfer_reason: 'r'.repeat(2000), transfer_expectations: 'e'.repeat(2000) });
    assert.equal(status, 201); assert.equal(inserted.platforms.join(','), platforms);
    assert.equal(inserted.transfer_reason.length, 2000); assert.equal(inserted.transfer_expectations.length, 2000);
    assert.equal(inserted.category, 'probleme_admin'); assert.equal(inserted.request_type, 'transfer_cont');
  }
});
test('optional answers may be blank', async () => {
  const result = await harness().send({}); assert.equal(result.status, 201); assert.equal(result.inserted.transfer_reason, null);
});
test('rejects invalid platforms, missing criteria/contact/city and oversized answers', async () => {
  for (const invalid of [{ platforms: '' }, { platforms: 'Other' }, { platforms: 'Wolt,Wolt' }, { transfer_checklist_confirmed: 'false' }, { new_city: '' }, { email: 'bad' }, { confirmed: 'false' }, { transfer_reason: 'x'.repeat(2001) }, { transfer_expectations: 'x'.repeat(2001) }]) {
    const result = await harness().send(invalid); assert.equal(result.status, 400); assert.equal(result.inserted, undefined);
  }
});
test('duplicate request remains blocked server-side', async () => { assert.equal((await harness(true).send({})).status, 409); });
test('unrelated inactivity flow still validates and saves without transfer feedback', async () => {
  const result = await harness().send({ category: 'inactivitate', request_type: 'inactivitate', inactive_start: '2026-10-01', inactive_end: '2026-10-07', transfer_reason: 'ignored' });
  assert.equal(result.status, 201); assert.equal(result.inserted.transfer_reason, null);
});
