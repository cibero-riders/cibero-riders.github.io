const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../hub/hub.js'), 'utf8');
// Exercise the production calendar functions without a browser or the bot runtime.
const calendar = new Function(source.slice(source.indexOf('  const DAY='), source.indexOf('  const paymentOffsets=')) + ';return {weeklyPaymentSchedule,woltPaymentSchedule,woltFiscalPeriod,glovoResetDate,bucharestNow,scheduleForPeriod,adjacentPaymentPeriod,relativePaymentSchedule,scheduleFor};')();
function now(day, hour = 12, minute = 0) {
  const date = new Date(day + 'T12:00:00Z');
  return {year:date.getUTCFullYear(), month:date.getUTCMonth()+1, day:date.getUTCDate(), weekday:date.getUTCDay(), hour, minute};
}
const iso = date => date.toISOString().slice(0,10);
function check(fn, input, expected) {
  const result = fn(input);
  assert.deepEqual([result.start,result.end,result.payment,result.reset].map(iso), expected);
}
check(calendar.weeklyPaymentSchedule, now('2026-10-16',16,59), ['2026-10-05','2026-10-11','2026-10-16','2026-10-18']);
check(calendar.weeklyPaymentSchedule, now('2026-10-16',17), ['2026-10-05','2026-10-11','2026-10-16','2026-10-18']);
check(calendar.weeklyPaymentSchedule, now('2026-10-18'), ['2026-10-12','2026-10-18','2026-10-23','2026-10-18']);
check(calendar.weeklyPaymentSchedule, now('2026-10-18',23,59), ['2026-10-12','2026-10-18','2026-10-23','2026-10-18']);
check(calendar.weeklyPaymentSchedule, now('2026-10-19',0), ['2026-10-12','2026-10-18','2026-10-23','2026-10-25']);
check(calendar.weeklyPaymentSchedule, now('2026-10-20'), ['2026-10-12','2026-10-18','2026-10-23','2026-10-25']);
check(calendar.weeklyPaymentSchedule, now('2026-10-23',23,59), ['2026-10-12','2026-10-18','2026-10-23','2026-10-25']);
check(calendar.weeklyPaymentSchedule, now('2026-10-24',0), ['2026-10-19','2026-10-25','2026-10-30','2026-10-25']);
check(calendar.weeklyPaymentSchedule, now('2026-10-25',23,59), ['2026-10-19','2026-10-25','2026-10-30','2026-10-25']);
check(calendar.weeklyPaymentSchedule, now('2026-10-26',0), ['2026-10-19','2026-10-25','2026-10-30','2026-11-01']);
assert.equal(iso(calendar.glovoResetDate(now('2026-10-26'))), '2026-10-27');
assert.equal(iso(calendar.glovoResetDate(now('2026-10-27',14))), '2026-10-27');
assert.equal(iso(calendar.glovoResetDate(now('2026-10-27',23,58))), '2026-10-27');
assert.equal(iso(calendar.glovoResetDate(now('2026-10-27',23,59))), '2026-11-03');
assert.equal(iso(calendar.glovoResetDate(now('2026-10-28',0))), '2026-11-03');
check(calendar.woltPaymentSchedule, now('2026-10-09',23,59), ['2026-10-01','2026-10-07','2026-10-09','2026-10-07']);
check(calendar.woltPaymentSchedule, now('2026-10-10',0), ['2026-10-08','2026-10-15','2026-10-16','2026-10-15']);
check(calendar.woltPaymentSchedule, now('2026-10-19',23,59), ['2026-10-08','2026-10-15','2026-10-16','2026-10-15']);
check(calendar.woltPaymentSchedule, now('2026-10-20',0), ['2026-10-16','2026-10-22','2026-10-23','2026-10-22']);
check(calendar.woltPaymentSchedule, now('2026-10-26',23,59), ['2026-10-16','2026-10-22','2026-10-23','2026-10-22']);
check(calendar.woltPaymentSchedule, now('2026-10-27',0), ['2026-10-23','2026-10-31','2026-11-06','2026-10-31']);
check(calendar.woltPaymentSchedule, now('2026-11-06',23,59), ['2026-10-23','2026-10-31','2026-11-06','2026-10-31']);
check(calendar.woltPaymentSchedule, now('2026-11-07',0), ['2026-11-01','2026-11-07','2026-11-13','2026-11-07']);
check(calendar.woltPaymentSchedule, now('2027-01-18',23,59), ['2027-01-08','2027-01-15','2027-01-22','2027-01-15']);
check(calendar.woltPaymentSchedule, now('2027-01-19',0), ['2027-01-16','2027-01-22','2027-01-29','2027-01-22']);
assert.equal(calendar.woltPaymentSchedule(now('2026-10-20')).delayed,true);
assert.equal(calendar.woltPaymentSchedule(now('2026-10-27')).delayed,false);
assert.equal(iso(calendar.woltFiscalPeriod(new Date('2028-02-28T12:00Z')).end), '2028-02-29');
check(calendar.woltPaymentSchedule, now('2028-02-23'), ['2028-02-16','2028-02-22','2028-02-25','2028-02-22']);
check(calendar.woltPaymentSchedule, now('2028-02-26',0), ['2028-02-23','2028-02-29','2028-03-03','2028-02-29']);
check(calendar.weeklyPaymentSchedule, now('2027-01-01',17), ['2026-12-21','2026-12-27','2027-01-01','2027-01-03']);
check(calendar.weeklyPaymentSchedule, now('2027-01-02',0), ['2026-12-28','2027-01-03','2027-01-08','2027-01-03']);
console.log('Payment calendar: payout periods, Glovo Tuesday rollover, Wolt rollovers, leap year and year boundary passed.');

for (const platform of ['bolt', 'glovo', 'wolt']) {
  const input = now('2026-11-11');
  const current = calendar.relativePaymentSchedule(platform, 0, input);
  const previous = calendar.relativePaymentSchedule(platform, -1, input);
  const future = calendar.relativePaymentSchedule(platform, 1, input);
  assert.equal(iso(current.start), iso(calendar.scheduleFor(platform, input).start));
  assert.equal(iso(previous.end), iso(new Date(current.start.getTime() - 86400000)));
  assert.equal(iso(future.start), iso(new Date(current.end.getTime() + 86400000)));
  assert.ok(previous.payment < current.payment && future.payment > current.payment);
  assert.equal(iso(calendar.relativePaymentSchedule(platform, 2, input).start), iso(current.start), 'only adjacent periods are supported');
  if (platform !== 'wolt') {
    assert.equal(iso(previous.reset), iso(new Date(current.reset.getTime() - 7 * 86400000)));
    assert.equal(iso(future.reset), iso(new Date(current.reset.getTime() + 7 * 86400000)));
  }
}
check(input => calendar.relativePaymentSchedule('bolt', -1, input), now('2026-11-11'), ['2026-10-26','2026-11-01','2026-11-06','2026-11-08']);
check(input => calendar.relativePaymentSchedule('glovo', 1, input), now('2026-11-11'), ['2026-11-09','2026-11-15','2026-11-20','2026-11-24']);
check(input => calendar.relativePaymentSchedule('wolt', -1, input), now('2026-11-11'), ['2026-10-23','2026-10-31','2026-11-06','2026-10-31']);
assert.equal(calendar.relativePaymentSchedule('wolt', -1, now('2026-11-11')).delayed, true, 'Saturday endings retain the delay note in the previous-period view');
check(input => calendar.relativePaymentSchedule('wolt', 1, input), now('2026-11-11'), ['2026-11-08','2026-11-15','2026-11-20','2026-11-15']);
const leapPeriod = calendar.scheduleForPeriod('wolt', new Date('2028-02-23T12:00Z'));
assert.equal(iso(leapPeriod.end), '2028-02-29');
assert.equal(iso(calendar.adjacentPaymentPeriod('wolt', leapPeriod, 1).start), '2028-03-01');
console.log('Payment browser: previous/current/next periods and corresponding resets passed.');
