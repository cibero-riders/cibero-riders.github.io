(() => {
  const key = 'cibero-language';
  const controls = document.querySelectorAll('.public-language-switch [data-language]');
  if (!controls.length) return;
  const translations = {
    'Prezentare': 'Overview', 'Orașe': 'Cities', 'Campanii': 'Campaigns', 'Înregistrare': 'Sign up',
    'Bolt Food, Glovo sau Wolt?': 'Bolt Food, Glovo, or Wolt?', 'Termeni și Condiții': 'Terms and Conditions',
    'Confidențialitate & GDPR': 'Privacy & GDPR', 'Politica de Cookie-uri': 'Cookie Policy', 'Contact': 'Contact',
    'Constanța, România': 'Constanța, Romania', 'Alege limba': 'Choose language', 'Deschide meniul': 'Open menu',
    'CibeRO · GHID PLATFORME': 'CibeRO · PLATFORM GUIDE', 'Alege platforma care ți se potrivește': 'Choose the platform that suits you',
    'Compară aplicația, taxele, cash-ul și flexibilitatea înainte să alegi. Informațiile pot diferi în funcție de oraș.': 'Compare the app, fees, cash handling and flexibility before choosing. Details can vary by city.',
    'Compară lucrurile care contează în activitatea de zi cu zi și alege platforma potrivită pentru felul în care vrei să livrezi.': 'Compare what matters in everyday work and choose the platform that fits how you want to deliver.',
    'Derulează lateral pentru comparația completă.': 'Scroll sideways for the full comparison.', 'Criteriu': 'Criterion',
    'Aplicație mobilă': 'Mobile app', 'Taxă la deschiderea unui cont nou': 'New account opening fee',
    'Criterii cu cash (banii numerar)': 'Cash handling', 'Plăți per comandă': 'Pay per order',
    'Program de muncă': 'Work schedule', 'Număr de comenzi disponibile': 'Available orders',
    'Nicio taxă.': 'No fee.', '50 lei, o singură dată la deschiderea contului.': '50 RON, paid once when opening the account.',
    'Bolt Courier este simplă, rapidă și bine optimizată. Are GPS integrat decent (poți livra fără Maps/Waze dacă îți cunoști orașul), suport direct în aplicația de curier, tips primite direct în aplicație și încasări actualizate în câteva secunde. Intri și ieși online când vrei.': 'Bolt Courier is simple, fast and well optimized. It has decent built-in GPS (you can deliver without Maps/Waze if you know your city), direct support in the courier app, tips paid directly in the app, and earnings that update within seconds. Go online or offline whenever you want.',
    'Glovo Rider este bine optimizată și rulează rapid. Are cel mai bun GPS integrat și cel mai bun sistem de rapoarte pentru statistici, însă asistența este mai greu de contactat.': 'Glovo Rider is well optimized and runs fast. It has the best built-in GPS and the best reporting system for statistics, though support is harder to reach.',
    'Wolt Partner rulează mai încet decât Bolt Courier și Glovo Rider. Statisticile se actualizează în 1–50 de minute după finalizarea comenzii; recomandăm GPS extern (Google Maps/Waze). Asistența este rapidă direct din aplicație.': 'Wolt Partner runs more slowly than Bolt Courier and Glovo Rider. Statistics update 1–50 minutes after an order is completed; we recommend external GPS (Google Maps/Waze). Support is quick directly in the app.',
    'Primești uneori comenzi cash, cu plată la preluare sau bani de primit de la client la predare. Depunerea integrală a balanței este necesară în fiecare duminică, la 23:59. La o balanță negativă de 500 RON nu vei mai putea primi comenzi. Depunerea se face la orice stație SelfPay.': 'You may sometimes receive cash orders, where you pay at pickup or collect money from the customer at delivery. The full balance must be deposited every Sunday by 23:59. At a negative balance of 500 RON, you will no longer be able to receive orders. Deposit at any SelfPay station.',
    'Se rulează uneori bani cash la preluarea și predarea comenzilor. Depunerea integrală a balanței este necesară în fiecare duminică, la 23:59. Nu recomandăm depășirea unei sume negative de 500 RON în balanță. Depunerea se face direct cu cardul, în aplicația de curier.': 'Cash may sometimes be used when collecting and delivering orders. The full balance must be deposited every Sunday by 23:59. We do not recommend exceeding a negative balance of 500 RON. Deposit directly by card in the courier app.',
    'Primești uneori cash atunci când clientul alege plata numerar și acest lucru apare în detaliile comenzii. Depunerea integrală a balanței este necesară în fiecare zi de reset specifică Wolt. La 500 RON în balanță nu vei mai putea intra online până nu acoperi integral suma. Depunerea se face prin Aircash.': 'You may receive cash when a customer chooses cash payment and this appears in the order details. The full balance must be deposited on every Wolt-specific reset day. At 500 RON in balance you cannot go online until the amount is fully covered. Deposit through Aircash.',
    'La liber: intri online și te pui offline când vrei, direct din aplicație.': 'Flexible: go online and offline whenever you want, directly in the app.',
    'Orele de muncă se rezervă dinainte, cu intrare și ieșire flexibilă atunci când cererea este ridicată în orașul tău.': 'Working hours are booked in advance, with flexible check-in and check-out when demand is high in your city.',
    '(diferă și în funcție de oraș)': '(also varies by city)', 'VIDEO GHID': 'VIDEO GUIDE',
    '← Glisează tabelul pentru a vedea toate detaliile →': '← Swipe the table to see all details →', 'Cash / bani numerar': 'Cash handling', 'Fără taxă.': 'No fee.',
    'Aplicație simplă, rapidă și bine optimizată, cu GPS integrat decent. O poți folosi fără Maps/Waze dacă îți cunoști orașul. Asistența se contactează direct din aplicația de curier, tips-urile intră direct în aplicație, iar comenzile finalizate se actualizează în câteva secunde la încasări. Intri și ieși online când vrei.': 'A simple, fast and well-optimized app with decent built-in GPS. You can use it without Maps/Waze if you know your city. Contact support directly in the courier app, receive tips directly in the app, and see completed orders update in earnings within seconds. Go online and offline whenever you want.',
    'Aplicație bine optimizată și rapidă, cu cel mai bun GPS integrat. Are cel mai bun sistem de rapoarte și statistici, dar asistența este mai greu de contactat.': 'A well-optimized, fast app with the best built-in GPS. It has the best reporting and statistics system, but support is harder to reach.',
    'Wolt Partner rulează mai lent decât Bolt Courier și Glovo Rider. Comenzile se actualizează în statistici la 1–50 de minute după finalizare; recomandăm GPS extern, Google Maps sau Waze. Asistența este rapidă direct din aplicație.': 'Wolt Partner runs more slowly than Bolt Courier and Glovo Rider. Completed orders update in statistics 1–50 minutes later; we recommend external GPS, Google Maps or Waze. Support is quick directly in the app.',
    'plătiți o singură dată la deschiderea contului.': 'paid once when the account is opened.',
    'Primești uneori comenzi cash, cu bani de achitat la preluare sau de primit la predare. Balanța se depune integral până duminică, ora 23:59. Nu recomandăm depășirea unei balanțe negative de 500 RON. Depunerea se face direct cu cardul în Bolt Courier.': 'You may sometimes receive cash orders, where you pay at pickup or collect money at delivery. Deposit the full balance by Sunday, 23:59. We do not recommend exceeding a negative balance of 500 RON. Deposit directly by card in Bolt Courier.',
    'Video-ghid pentru depunerea balanței': 'Video guide: depositing your balance',
    'Ca la Bolt Food, poți avea comenzi cash cu bani de achitat la preluare sau de primit la predare. Balanța se depune integral până duminică, ora 23:59; la 500 RON negativ nu mai poți primi comenzi. Depunerea se face la orice': 'As with Bolt Food, you may have cash orders where you pay at pickup or collect money at delivery. Deposit the full balance by Sunday, 23:59; at a negative balance of 500 RON you can no longer receive orders. Deposit at any',
    'stație SelfPay': 'SelfPay station',
    'Primești cash atunci când clientul alege plata numerar, lucru indicat în detaliile comenzii. Depunerea integrală este necesară în fiecare zi de reset specifică Wolt. La 500 RON în balanță nu mai poți intra online până nu o acoperi integral. Depunerea se face prin': 'You receive cash when the customer chooses cash payment, shown in the order details. Full deposit is required on every Wolt-specific reset day. At 500 RON in balance you cannot go online until it is fully covered. Deposit through',
    'Orele se rezervă dinainte, cu posibilitatea de intrare și ieșire flexibilă atunci când cererea este ridicată în orașul tău.': 'Hours are booked in advance, with flexible check-in and check-out when demand is high in your city.',
    'Disponibilitatea comenzilor poate varia și în funcție de oraș, interval și cerere.': 'Order availability may also vary by city, time slot and demand.'
  };
  const originals = new WeakMap();
  function swap(value, lang) {
    const trimmed = value.trim(); const translated = translations[trimmed];
    return lang === 'en' && translated ? value.replace(trimmed, translated) : value;
  }
  function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('body *').forEach((element) => {
      if (['SCRIPT', 'STYLE'].includes(element.tagName) || element.closest('.public-language-switch')) return;
      Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => {
        if (!originals.has(node)) originals.set(node, node.nodeValue);
        node.nodeValue = swap(originals.get(node), lang);
      });
    });
    controls.forEach((button) => { const active = button.dataset.language === lang; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    localStorage.setItem(key, lang);
  }
  controls.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  setLanguage(localStorage.getItem(key) === 'en' ? 'en' : 'ro');
})();
