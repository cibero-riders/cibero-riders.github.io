const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../hub/hub.js'), 'utf8');
// Exercise the production calendar functions without a browser or the bot runtime.
const calendar = new Function(source.slice(source.indexOf('  const DAY='), source.indexOf('  function scheduleFor')) + ';return {weeklyPaymentSchedule,woltPaymentSchedule,woltFiscalPeriod,bucharestNow};')();
function now(day, hour = 12, minute = 0) {
  const date = new Date(day + 'T12:00:00Z');
  return {year:date.getUTCFullYear(), month:date.getUTCMonth()+1, day:date.getUTCDate(), weekday:date.getUTCDay(), hour, minute};
}
const iso = date => date.toISOString().slice(0,10);
function check(fn, input, expected) {
  const result = fn(input);
  assert.deepEqual([result.start,result.end,result.payment,result.reset].map(iso), expected);
}
check(calendar.weeklyPaymentSchedule, now('2026-10-16',16,59), ['2026-10-05','2026-10-11','2026-10-16','2026-10-11']);
check(calendar.weeklyPaymentSchedule, now('2026-10-16',17), ['2026-10-12','2026-10-18','2026-10-23','2026-10-18']);
check(calendar.weeklyPaymentSchedule, now('2026-10-18'), ['2026-10-12','2026-10-18','2026-10-23','2026-10-18']);
check(calendar.weeklyPaymentSchedule, now('2026-10-19'), ['2026-10-12','2026-10-18','2026-10-23','2026-10-18']);
check(calendar.woltPaymentSchedule, now('2026-10-09',16,59), ['2026-10-01','2026-10-07','2026-10-09','2026-10-07']);
check(calendar.woltPaymentSchedule, now('2026-10-09',17), ['2026-10-08','2026-10-15','2026-10-23','2026-10-15']);
check(calendar.woltPaymentSchedule, now('2026-10-16',17), ['2026-10-08','2026-10-15','2026-10-23','2026-10-15']);
check(calendar.woltPaymentSchedule, now('2026-10-23',17), ['2026-10-16','2026-10-22','2026-10-30','2026-10-22']);
assert.equal(iso(calendar.woltFiscalPeriod(new Date('2028-02-28T12:00Z')).end), '2028-02-29');
check(calendar.weeklyPaymentSchedule, now('2027-01-01',17), ['2026-12-28','2027-01-03','2027-01-08','2027-01-03']);
console.log('Payment calendar: Friday cutoff, Sunday, Wolt, leap year and year boundary passed.');
