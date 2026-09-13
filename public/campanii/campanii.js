const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

const activateTab = (name, updateHash = true) => {
  tabs.forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  panels.forEach(panel => {
    const active = panel.dataset.panel === name;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });

  if (updateHash) history.replaceState(null, '', `#${name}`);
};

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    activateTab(tabs[next].dataset.tab);
  });
});

const requestedTab = location.hash.replace('#', '');
activateTab(['veteran', 'tombola'].includes(requestedTab) ? requestedTab : 'veteran', false);

const translations = {
  ro: {
    pageTitle: 'Campanii | CibeRO',
    metaDescription: 'Campaniile și premiile CibeRO pentru curierii flotei.',
    languageLabel: 'Alege limba paginii',
    campaignShellLabel: 'Campanii CibeRO',
    tabListLabel: 'Selectează campania',
    heroTitle: 'Campaniile <em>CibeRO</em>',
    heroSubtitle: 'Două moduri de a câștiga. Alege campania și descoperă regulile, perioada și premiile.',
    extendedCampaign: 'CAMPANIE EXTINSĂ',
    weeklyCampaign: 'CAMPANIE SĂPTĂMÂNALĂ',
    raffleTitle: 'Tombolă',
    veteranPeriod: '07 Septembrie, 00:00 — 07 Noiembrie, 23:59 · 2 luni',
    goalTitle: 'Scop',
    veteranGoal: 'Cele mai mari venituri realizate în intervalul <strong>07 Septembrie 00:00 – 07 Noiembrie 23:59</strong>.',
    allPlatformsTitle: 'Folosește toate platformele',
    allPlatformsBody: 'Se iau în calcul veniturile de pe toate cele 3 platforme, așa că puteți fi ingenioși.',
    prizesTitle: 'Premii',
    place1: 'Locul 1',
    place2: 'Locul 2',
    place3: 'Locul 3',
    place4: 'Locul 4',
    place5: 'Locul 5',
    place6: 'Locul 6',
    prize1: 'Premiu surpriză în valoare de <strong>1.500 lei</strong> sau contravaloarea în bani.',
    prize2: 'Premiu surpriză în valoare de <strong>1.000 lei</strong> sau contravaloarea în bani.',
    prize3: 'Premiu surpriză în valoare de <strong>500 lei</strong> sau contravaloarea în bani.',
    prize4: 'Un plin din partea flotei sau contravaloarea în bani.',
    prize5: 'Comision 0 timp de <strong>2 săptămâni</strong>.',
    prize6: 'Comision 0 timp de <strong>o săptămână</strong>.',
    veteranResults: 'Rezultatele vor fi afișate la scurt timp după încheierea campaniei.',
    veteranClosing: '🔥 Spor și hype pe traseu! Cei mai implicați vor fi recompensați! 🙏',
    rafflePeriod: 'Prima săptămână de Tombolă: 07 Septembrie, 00:00 — 13 Septembrie, 23:59',
    raffleGoal: 'La fiecare <strong>500 lei</strong> câștigați într-o săptămână, primești un bilet la tragerea la sorți. Mai multe bilete înseamnă mai multe șanse de câștig.',
    exampleTitle: 'Exemplu',
    raffleExample: 'Ai venituri de <strong>1.800 lei</strong> într-o săptămână → primești <strong>3 bilete</strong> și o probabilitate mai mare de a ieși câștigător.',
    eligibilityTitle: 'Cine participă?',
    eligibilityBody: 'Toți curierii cu încasări de cel puțin 500 lei într-o săptămână sunt înscriși. Roata se învârte de 3 ori, iar cei nominalizați devin câștigători.',
    rafflePrizeIntro: 'Fiecare dintre cei 3 curieri alege un premiu:',
    raffleCashPrize: '100 lei',
    orLabel: 'sau',
    raffleCommissionPrize: 'Comision 0% timp de o săptămână',
    raffleResults: 'Rezultatele vor fi afișate la începutul săptămânii următoare celei în care are loc campania.',
    raffleChance: '😉 Toți au o șansă la câștig, însă cei care colectează mai multe bilete au mai multe șanse.',
    raffleClosing: 'Spor și succes! 🙏',
    footerText: 'Împreună, livrăm mai mult.'
  },
  en: {
    pageTitle: 'Campaigns | CibeRO',
    metaDescription: 'CibeRO campaigns and prizes for fleet couriers.',
    languageLabel: 'Choose page language',
    campaignShellLabel: 'CibeRO campaigns',
    tabListLabel: 'Choose a campaign',
    heroTitle: '<em>CibeRO</em> Campaigns',
    heroSubtitle: 'Two ways to win. Choose a campaign and discover its rules, schedule and prizes.',
    extendedCampaign: 'EXTENDED CAMPAIGN',
    weeklyCampaign: 'WEEKLY CAMPAIGN',
    raffleTitle: 'Raffle',
    veteranPeriod: '07 September, 00:00 — 07 November, 23:59 · 2 months',
    goalTitle: 'Goal',
    veteranGoal: 'The highest earnings achieved between <strong>07 September 00:00 and 07 November 23:59</strong>.',
    allPlatformsTitle: 'Use all platforms',
    allPlatformsBody: 'Earnings across all 3 platforms count, so you can get creative.',
    prizesTitle: 'Prizes',
    place1: '1st place',
    place2: '2nd place',
    place3: '3rd place',
    place4: '4th place',
    place5: '5th place',
    place6: '6th place',
    prize1: 'A surprise prize worth <strong>1,500 lei</strong>, or the equivalent amount in cash.',
    prize2: 'A surprise prize worth <strong>1,000 lei</strong>, or the equivalent amount in cash.',
    prize3: 'A surprise prize worth <strong>500 lei</strong>, or the equivalent amount in cash.',
    prize4: 'One full tank courtesy of the fleet, or the equivalent amount in cash.',
    prize5: '<strong>0% commission</strong> for 2 weeks.',
    prize6: '<strong>0% commission</strong> for one week.',
    veteranResults: 'The results will be announced shortly after the campaign ends.',
    veteranClosing: '🔥 Good luck on the road! The most committed couriers will be rewarded! 🙏',
    rafflePeriod: 'First Raffle week: 07 September, 00:00 — 13 September, 23:59',
    raffleGoal: 'For every <strong>500 lei</strong> earned in one week, you receive one raffle ticket. More tickets mean more chances to win.',
    exampleTitle: 'Example',
    raffleExample: 'You earn <strong>1,800 lei</strong> in one week → you receive <strong>3 tickets</strong> and have a higher chance of winning.',
    eligibilityTitle: 'Who takes part?',
    eligibilityBody: 'All couriers with earnings of at least 500 lei in one week are entered into the raffle. The wheel is spun 3 times, and the couriers drawn are the winners.',
    rafflePrizeIntro: 'Each of the 3 winning couriers chooses one prize:',
    raffleCashPrize: '100 lei',
    orLabel: 'or',
    raffleCommissionPrize: '0% commission for one week',
    raffleResults: 'The results will be announced at the beginning of the week following the campaign week.',
    raffleChance: '😉 Everyone has a chance to win, but couriers who collect more tickets have more chances.',
    raffleClosing: 'Good luck! 🙏',
    footerText: 'Together, we deliver more.'
  }
};

const languageButtons = [...document.querySelectorAll('[data-language]')];
const languageSwitch = document.querySelector('.language-switch');
const metaDescription = document.querySelector('meta[name="description"]');

const setLanguage = language => {
  const dictionary = translations[language] || translations.ro;
  document.documentElement.lang = language;
  document.title = dictionary.pageTitle;
  metaDescription.setAttribute('content', dictionary.metaDescription);
  languageSwitch.setAttribute('aria-label', dictionary.languageLabel);

  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.innerHTML = dictionary[element.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', dictionary[element.dataset.i18nAria]);
  });

  languageButtons.forEach(button => {
    const active = button.dataset.language === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  try {
    localStorage.setItem('cibero-campaign-language', language);
  } catch {}
};

languageButtons.forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});

let initialLanguage = 'ro';
try {
  initialLanguage = localStorage.getItem('cibero-campaign-language') || 'ro';
} catch {}
if (!translations[initialLanguage]) initialLanguage = 'ro';
setLanguage(initialLanguage);
