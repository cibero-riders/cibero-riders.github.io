import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://xpzgvknnrkyvcnncfqrq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const loginFeedback = document.querySelector('#login-feedback');
const dashboardFeedback = document.querySelector('#dashboard-feedback');
const logoutButton = document.querySelector('#logout-button');
const rangeForm = document.querySelector('#range-form');
const dateFrom = document.querySelector('#date-from');
const dateTo = document.querySelector('#date-to');
const formatter = new Intl.NumberFormat('ro-RO');
const dateFormatter = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
const shortDateFormatter = new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: '2-digit' });
const ACTIVE_PAGES = [
  { path: '/', label: 'Pagina principală' },
  { path: '/hub/', label: 'CIBERO Hub' },
  { path: '/subfleethub/', label: 'Courier Hub' },
  { path: '/subflote/', label: 'Parteneriate sub-flote' },
  { path: '/campanii/', label: 'Campanii' },
  { path: '/platforme/', label: 'Bolt Food, Glovo sau Wolt?' },
  { path: '/orase/', label: 'Orașe' },
  { path: '/beneficii/', label: 'Beneficii' },
  { path: '/onboarding/', label: 'Onboarding' },
  { path: '/termeni/', label: 'Termeni și Condiții' },
  { path: '/confidentialitate/', label: 'Confidențialitate & GDPR' },
  { path: '/cookie-uri/', label: 'Politica de Cookie-uri' }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function dateRange(from, to) {
  const dates = [];
  const cursor = parseDate(from);
  const end = parseDate(to);
  while (cursor <= end) {
    dates.push(isoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function setFeedback(node, message = '', isError = false) {
  node.textContent = message;
  node.classList.toggle('error', isError);
}

function showLogin(message = '') {
  dashboard.hidden = true;
  logoutButton.hidden = true;
  loginPanel.hidden = false;
  setFeedback(loginFeedback, message, Boolean(message));
}

async function verifyAdmin(session) {
  if (!session?.user) return false;
  const { data, error } = await supabase
    .from('admin_users')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .maybeSingle();
  return !error && data?.role === 'admin' && data?.is_active !== false;
}

async function openDashboard(session) {
  if (!await verifyAdmin(session)) {
    await supabase.auth.signOut();
    showLogin('Contul nu are acces de administrator la statistici.');
    return;
  }
  loginPanel.hidden = true;
  dashboard.hidden = false;
  logoutButton.hidden = false;
  await loadAnalytics();
}

function renderChart(rows, from, to) {
  const byDay = new Map(rows.map(row => [row.analytics_day, row]));
  const days = dateRange(from, to);
  const maxValue = Math.max(1, ...rows.flatMap(row => [Number(row.entries), Number(row.visitors)]));
  document.querySelector('#daily-chart').innerHTML = days.map(day => {
    const row = byDay.get(day) ?? { entries: 0, visitors: 0 };
    const entries = Number(row.entries);
    const visitors = Number(row.visitors);
    const entriesHeight = entries ? Math.max(4, entries / maxValue * 100) : 1;
    const visitorsHeight = visitors ? Math.max(4, visitors / maxValue * 100) : 1;
    const label = shortDateFormatter.format(parseDate(day));
    return `<div class="chart-day" title="${day}: ${entries} intrări, ${visitors} vizitatori"><div class="chart-bars"><i class="chart-bar entries" style="height:${entriesHeight}%"></i><i class="chart-bar visitors" style="height:${visitorsHeight}%"></i></div><small>${label}</small></div>`;
  }).join('');
}

function aggregatePages(rows) {
  const pages = new Map(ACTIVE_PAGES.map((page, index) => [page.path, {
    ...page, order: index, entries: 0, visitors: 0, direct: 0, external: 0
  }]));
  rows.forEach(row => {
    const current = pages.get(row.page_path) ?? {
      path: row.page_path, label: row.page_path, order: ACTIVE_PAGES.length,
      entries: 0, visitors: 0, direct: 0, external: 0
    };
    current.entries += Number(row.entries);
    current.visitors += Number(row.visitors);
    current.direct += Number(row.direct_entries);
    current.external += Number(row.external_entries);
    pages.set(row.page_path, current);
  });
  return [...pages.values()].sort((a, b) => b.entries - a.entries || a.order - b.order || a.path.localeCompare(b.path));
}

function renderPages(rows) {
  const pages = aggregatePages(rows);
  const body = document.querySelector('#pages-body');
  body.innerHTML = pages.map(page => `<tr${page.entries ? '' : ' class="is-empty"'}><td class="page-cell"><strong>${escapeHtml(page.label)}</strong><code>${escapeHtml(page.path)}</code></td><td>${formatter.format(page.entries)}</td><td>${formatter.format(page.visitors)}</td><td>${formatter.format(page.direct)}</td><td>${formatter.format(page.external)}</td></tr>`).join('');
  document.querySelector('#metric-pages').textContent = formatter.format(pages.filter(page => page.entries > 0).length);
}

function renderDetails(dailyRows, pageRows) {
  const dailyMap = new Map(dailyRows.map(row => [row.analytics_day, row]));
  const grouped = new Map();
  pageRows.forEach(row => {
    if (!grouped.has(row.analytics_day)) grouped.set(row.analytics_day, []);
    grouped.get(row.analytics_day).push(row);
  });
  const days = [...dailyMap.keys()].sort().reverse();
  document.querySelector('#daily-details').innerHTML = days.length ? days.map(day => {
    const daily = dailyMap.get(day);
    const pages = grouped.get(day) ?? [];
    const rows = pages.map(page => `<tr><td><code>${escapeHtml(page.page_path)}</code></td><td>${formatter.format(page.entries)}</td><td>${formatter.format(page.visitors)}</td></tr>`).join('');
    return `<details class="day-detail"><summary>${dateFormatter.format(parseDate(day))}<span>${formatter.format(daily.entries)} intrări · ${formatter.format(daily.visitors)} vizitatori</span></summary><table><thead><tr><th>Pagină</th><th>Intrări</th><th>Vizitatori</th></tr></thead><tbody>${rows}</tbody></table></details>`;
  }).join('') : '<p class="feedback">Istoricul va apărea aici după primele intrări înregistrate.</p>';
}

async function loadAnalytics() {
  const from = dateFrom.value;
  const to = dateTo.value;
  if (!from || !to || from > to) {
    setFeedback(dashboardFeedback, 'Alege un interval valid.', true);
    return;
  }
  setFeedback(dashboardFeedback, 'Se încarcă statisticile…');
  const [dailyResult, pagesResult] = await Promise.all([
    supabase.rpc('get_site_analytics_daily', { p_from: from, p_to: to }),
    supabase.rpc('get_site_analytics_pages', { p_from: from, p_to: to })
  ]);
  const error = dailyResult.error ?? pagesResult.error;
  if (error) {
    setFeedback(dashboardFeedback, 'Statisticile nu au putut fi încărcate. Verifică activarea migrării analytics.', true);
    return;
  }
  const dailyRows = dailyResult.data ?? [];
  const pageRows = pagesResult.data ?? [];
  const totalEntries = dailyRows.reduce((sum, row) => sum + Number(row.entries), 0);
  const totalVisitors = dailyRows.reduce((sum, row) => sum + Number(row.visitors), 0);
  const today = dailyRows.find(row => row.analytics_day === isoDate(new Date()));
  document.querySelector('#metric-entries').textContent = formatter.format(totalEntries);
  document.querySelector('#metric-visitors').textContent = formatter.format(totalVisitors);
  document.querySelector('#metric-today').textContent = formatter.format(Number(today?.entries ?? 0));
  renderChart(dailyRows, from, to);
  renderPages(pageRows);
  renderDetails(dailyRows, pageRows);
  setFeedback(dashboardFeedback, dailyRows.length ? `Date actualizate pentru ${dateFormatter.format(parseDate(from))} – ${dateFormatter.format(parseDate(to))}.` : 'Colectarea începe după activarea sistemului; pentru perioada anterioară nu există date retroactive.');
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  setFeedback(loginFeedback, 'Se verifică accesul…');
  const form = new FormData(loginForm);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(form.get('email') ?? '').trim(),
    password: String(form.get('password') ?? '')
  });
  if (error) {
    setFeedback(loginFeedback, 'E-mailul sau parola nu sunt corecte.', true);
    return;
  }
  await openDashboard(data.session);
});

rangeForm.addEventListener('submit', event => {
  event.preventDefault();
  loadAnalytics();
});

logoutButton.addEventListener('click', async () => {
  await supabase.auth.signOut();
  loginForm.reset();
  showLogin();
});

const end = new Date();
const start = new Date();
start.setDate(start.getDate() - 29);
dateFrom.value = isoDate(start);
dateTo.value = isoDate(end);

const { data: { session } } = await supabase.auth.getSession();
if (session) await openDashboard(session);
else showLogin();
