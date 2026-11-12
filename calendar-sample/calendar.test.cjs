const assert = require('node:assert/strict');
const { date, fiscal, weekly, payment, reset, events } = require('./calendar.js');

const iso = value => value.toISOString().slice(0, 10);

assert.equal(iso(weekly(date(2026, 11, 12)).start), '2026-11-09');
assert.equal(iso(weekly(date(2026, 11, 12)).end), '2026-11-15');
assert.equal(iso(payment('bolt', weekly(date(2026, 11, 12)))), '2026-11-20');
assert.equal(iso(reset('bolt', weekly(date(2026, 11, 12)))), '2026-11-15');
assert.equal(iso(reset('glovo', weekly(date(2026, 11, 12)))), '2026-11-17');
assert.deepEqual([1, 8, 16, 23].map(day => [iso(fiscal(date(2026, 11, day)).start), iso(fiscal(date(2026, 11, day)).end)]), [
  ['2026-11-01', '2026-11-07'],
  ['2026-11-08', '2026-11-15'],
  ['2026-11-16', '2026-11-22'],
  ['2026-11-23', '2026-11-30']
]);
assert.equal(iso(payment('wolt', fiscal(date(2026, 11, 23)))), '2026-12-04');
assert.deepEqual(events(date(2026, 11, 17)).filter(event => event.kind === 'reset').map(event => event.platform), ['glovo']);
assert.deepEqual(events(date(2026, 11, 20)).filter(event => event.kind === 'payment').map(event => event.platform), ['bolt', 'glovo', 'wolt']);
assert.deepEqual(events(date(2026, 11, 30)).filter(event => event.kind === 'reset').map(event => event.platform), ['wolt']);
console.log('Calendar sample date rules: OK');
