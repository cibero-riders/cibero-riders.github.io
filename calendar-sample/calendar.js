(() => {
  'use strict';
  const DAY = 86400000;
  const date = (year, month, day) => new Date(Date.UTC(year, month - 1, day, 12));
  const add = (value, days) => new Date(value.getTime() + days * DAY);
  const parts = value => ({ year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate() });
  const same = (a, b) => a.getTime() === b.getTime();
  const lastDay = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();
  const fiscal = value => {
    const { year, month, day } = parts(value);
    const first = day <= 7 ? 1 : day <= 15 ? 8 : day <= 22 ? 16 : 23;
    const end = first === 1 ? 7 : first === 8 ? 15 : first === 16 ? 22 : lastDay(year, month);
    return { start: date(year, month, first), end: date(year, month, end) };
  };
  const weekly = value => {
    const start = add(value, -((value.getUTCDay() + 6) % 7));
    return { start, end: add(start, 6) };
  };
  const woltFriday = end => {
    let distance = (5 - end.getUTCDay() + 7) % 7;
    if (!distance) distance = 7;
    return add(end, distance);
  };
  const period = (platform, value) => platform === 'wolt' ? fiscal(value) : weekly(value);
  const payment = (platform, window) => platform === 'wolt' ? woltFriday(window.end) : add(window.start, 11);
  const reset = (platform, window) => platform === 'glovo' ? add(window.end, 2) : window.end;
  const time = platform => platform === 'glovo' ? '14:00' : '23:59';
  const todayBucharest = () => {
    const list = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const get = type => Number(list.find(item => item.type === type).value);
    return date(get('year'), get('month'), get('day'));
  };
  const events = value => {
    const result = [];
    for (const platform of ['bolt', 'glovo', 'wolt']) {
      // Check periods around this day: a payment can follow its earning period by up to 12 days.
      const candidates = [value, add(value, -7), add(value, -14), add(value, -21)];
      const windows = candidates.map(candidate => period(platform, candidate));
      const seen = new Set();
      for (const window of windows) {
        const key = window.start.getTime();
        if (seen.has(key)) continue;
        seen.add(key);
        if (same(reset(platform, window), value)) result.push({ platform, kind: 'reset', window });
        if (same(payment(platform, window), value)) result.push({ platform, kind: 'payment', window });
      }
    }
    return result;
  };
  if (typeof document === 'undefined') {
    module.exports = { date, add, parts, lastDay, fiscal, weekly, woltFriday, period, payment, reset, events };
    return;
  }
  const translations = {
    ro: { back:'← Înapoi la Hub', eyebrow:'CONCEPT · CALENDAR DINAMIC', title:'Trei platforme. Un calendar clar.', intro:'Perioade fiscale, reseturi de numerar și zile de plată programate, într-o singură privire.', range:'PRIVIRE PE TREI LUNI', calendar:'Calendar de plată', select:'Selectează luna', legend:'● reset   ◆ plată programată', selected:'ZI SELECTATĂ', current:'Luna curentă', previous:'Luna anterioară', next:'Luna următoare', period:'Perioada fiscală', pay:'Plată programată', reset:'Depunere integrală până la', noEvents:'Fără reset sau plată programată în această zi.', possible:'Posibilă decalare a plății pentru procesarea rapoartelor.', disclaimer:'Calendarul este calculat după regulile curente ale platformelor. Zilele de plată sunt programate, nu confirmări ale unor transferuri efectuate. Wolt poate avea decalări când perioada fiscală se încheie joi sau vineri.', days:['Lu','Ma','Mi','Jo','Vi','Sâ','Du'] },
    en: { back:'← Back to Hub', eyebrow:'CONCEPT · DYNAMIC CALENDAR', title:'Three platforms. One clear calendar.', intro:'Fiscal periods, cash resets and scheduled payment days at a glance.', range:'THREE-MONTH VIEW', calendar:'Payment calendar', select:'Select month', legend:'● reset   ◆ scheduled payment', selected:'SELECTED DAY', current:'Current month', previous:'Previous month', next:'Next month', period:'Fiscal period', pay:'Scheduled payment', reset:'Deposit full balance by', noEvents:'No reset or scheduled payment on this day.', possible:'Payment may be delayed while reports are processed.', disclaimer:'This calendar is calculated from the platforms’ current rules. Payment days are scheduled dates, not confirmation of completed transfers. Wolt payments may be delayed when a fiscal period ends on Thursday or Friday.', days:['Mo','Tu','We','Th','Fr','Sa','Su'] }
  };
  const elements = Object.fromEntries(['back-link','eyebrow','page-title','intro','range-label','calendar-title','months','legend','legend-note','weekdays','day-grid','day-kicker','selected-heading','selected-caption','day-details','disclaimer'].map(id => [id, document.getElementById(id)]));
  const controls = [...document.querySelectorAll('[data-language]')];
  let language = 'ro';
  let current = todayBucharest();
  let anchor = parts(current);
  let view = { ...anchor };
  let selected = current;
  const fmt = (value, options) => new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'ro-RO', { timeZone: 'UTC', ...options }).format(value);
  const longDate = value => fmt(value, { day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = value => fmt(value, { day: 'numeric', month: 'short' });
  const name = value => fmt(value, { month: 'long' });
  const label = value => `${name(value)} ${value.getUTCFullYear()}`;
  const windowFor = platform => period(platform, selected);
  function renderMonths() {
    const t = translations[language];
    elements.months.replaceChildren();
    elements.months.setAttribute('aria-label', t.select);
    for (const offset of [-1, 0, 1]) {
      const monthDate = date(anchor.year, anchor.month + offset, 1);
      const { year, month } = parts(monthDate);
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'month-tab';
      if (view.year === year && view.month === month) button.classList.add('active');
      button.setAttribute('aria-pressed', String(button.classList.contains('active')));
      const strong = document.createElement('strong'); strong.textContent = name(monthDate);
      const small = document.createElement('small'); small.textContent = `${year} · ${t[offset === 0 ? 'current' : offset < 0 ? 'previous' : 'next']}`;
      button.append(strong, small);
      button.addEventListener('click', () => { view = { year, month }; selected = year === anchor.year && month === anchor.month ? current : date(year, month, 1); render(); });
      elements.months.append(button);
    }
  }
  function renderGrid() {
    const t = translations[language];
    elements.weekdays.replaceChildren(...t.days.map(day => { const span = document.createElement('span'); span.textContent = day; return span; }));
    elements['day-grid'].replaceChildren();
    const first = date(view.year, view.month, 1);
    const leading = (first.getUTCDay() + 6) % 7;
    for (let index = 0; index < leading; index++) { const blank = document.createElement('div'); blank.className = 'day-spacer'; blank.setAttribute('aria-hidden', 'true'); elements['day-grid'].append(blank); }
    for (let day = 1; day <= lastDay(view.year, view.month); day++) {
      const value = date(view.year, view.month, day);
      const dayEvents = events(value);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'day'; button.setAttribute('role', 'gridcell');
      if (same(value, selected)) button.classList.add('selected');
      if (same(value, current)) button.classList.add('today');
      const number = document.createElement('span'); number.className = 'day-number'; number.textContent = day;
      const tracks = document.createElement('span'); tracks.className = 'tracks'; tracks.setAttribute('aria-hidden', 'true');
      for (const platform of ['bolt', 'glovo', 'wolt']) {
        const window = period(platform, value);
        const track = document.createElement('span'); track.className = `track ${platform}${same(value, window.start) ? ' start' : ''}${same(value, window.end) ? ' end' : ''}`; tracks.append(track);
      }
      const marks = document.createElement('span'); marks.className = 'marks'; marks.setAttribute('aria-hidden', 'true');
      for (const event of dayEvents) { const mark = document.createElement('span'); mark.className = `mark ${event.platform}`; mark.innerHTML = `${event.kind === 'reset' ? '●' : '◆'}<span class="mark-label">${event.platform === 'bolt' ? 'B' : event.platform === 'glovo' ? 'G' : 'W'}</span>`; marks.append(mark); }
      button.setAttribute('aria-label', `${longDate(value)}. ${dayEvents.map(event => `${event.platform === 'bolt' ? 'Bolt Food' : event.platform === 'glovo' ? 'Glovo' : 'Wolt'} ${event.kind === 'reset' ? t.reset.toLowerCase() + ' ' + time(event.platform) : t.pay.toLowerCase()}`).join('; ')}`);
      button.setAttribute('aria-selected', String(same(value, selected)));
      button.append(number, tracks, marks);
      button.addEventListener('click', () => { selected = value; renderGrid(); renderDetail(); });
      elements['day-grid'].append(button);
    }
  }
  function renderDetail() {
    const t = translations[language];
    elements['selected-heading'].textContent = fmt(selected, { weekday: 'long', day: 'numeric', month: 'long' });
    const dayEvents = events(selected);
    elements['selected-caption'].textContent = dayEvents.length ? dayEvents.map(event => `${event.kind === 'reset' ? '●' : '◆'} ${event.platform === 'bolt' ? 'Bolt Food' : event.platform === 'glovo' ? 'Glovo' : 'Wolt'}`).join(' · ') : t.noEvents;
    elements['day-details'].replaceChildren();
    for (const platform of ['bolt', 'glovo', 'wolt']) {
      const window = windowFor(platform);
      const card = document.createElement('section'); card.className = `detail-card ${platform}`;
      const heading = document.createElement('strong'); heading.textContent = platform === 'bolt' ? 'Bolt Food' : platform === 'glovo' ? 'Glovo' : 'Wolt'; card.append(heading);
      const range = document.createElement('p'); range.textContent = `${t.period}: ${shortDate(window.start)} – ${shortDate(window.end)}`; card.append(range);
      const special = dayEvents.filter(event => event.platform === platform);
      for (const event of special) {
        const line = document.createElement('p'); const bold = document.createElement('b'); bold.textContent = event.kind === 'reset' ? `● ${t.reset} ${time(platform)}` : `◆ ${t.pay}: ${longDate(selected)}`; line.append(bold); card.append(line);
        if (platform === 'wolt' && event.kind === 'payment' && [4, 5].includes(event.window.end.getUTCDay())) { const note = document.createElement('p'); note.textContent = t.possible; card.append(note); }
      }
      elements['day-details'].append(card);
    }
  }
  function render() {
    const t = translations[language]; document.documentElement.lang = language;
    elements['back-link'].textContent = t.back; elements.eyebrow.textContent = t.eyebrow; elements['page-title'].textContent = t.title; elements.intro.textContent = t.intro; elements['range-label'].textContent = t.range; elements['calendar-title'].textContent = t.calendar; elements['legend-note'].textContent = t.legend; elements.legend.setAttribute('aria-label', language === 'en' ? 'Calendar legend' : 'Legendă calendar'); elements['day-kicker'].textContent = t.selected; elements.disclaimer.textContent = t.disclaimer;
    renderMonths(); renderGrid(); renderDetail();
    controls.forEach(button => { const active = button.dataset.language === language; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  }
  controls.forEach(button => button.addEventListener('click', () => { language = button.dataset.language; try { localStorage.setItem('cibero-language', language); } catch {} render(); }));
  try { language = localStorage.getItem('cibero-language') === 'en' ? 'en' : 'ro'; } catch {}
  const refresh = () => { const next = todayBucharest(); if (same(next, current)) return; const priorAnchor = anchor; current = next; anchor = parts(current); if (view.year === priorAnchor.year && view.month === priorAnchor.month) view = { ...anchor }; if (same(selected, add(next, -1))) selected = next; render(); };
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  render();
})();
