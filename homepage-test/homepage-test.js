(() => {
  const gate = document.querySelector('.choice-gate');
  const tablist = document.querySelector('.choice-toggle');
  const tabs = [...document.querySelectorAll('[data-choice]')];
  const panels = [...document.querySelectorAll('[data-choice-panel]')];
  const courierContent = document.querySelector('[data-courier-content]');
  const courierLoading = document.querySelector('[data-courier-loading]');
  let courierReady = false;
  let courierPromise = null;
  let languageReady = false;
  let activeChoice = null;
  const seenPrompts = new Set();
  let promptAudience = null;
  let infoMode = 'general';
  let promptReturnFocus = null;
  const prompt = document.querySelector('[data-audience-prompt]');
  const promptContent = document.querySelector('[data-prompt-content]');
  const infoToggle = document.querySelector('.audience-info-toggle');
  const infoButtons = [...document.querySelectorAll('[data-info-mode]')];

  const pageTranslations = {
    'Alege tipul de colaborare': 'Choose how you want to collaborate',
    'Alege direcția potrivită pentru tine': 'Choose the right direction for you',
    'CURIER': 'COURIER',
    'Livrează la Bolt Food/Glovo/Wolt': 'Deliver with Bolt Food/Glovo/Wolt',
    'SUB-FLOTĂ': 'SUB-FLEET',
    'Dezvoltă propria afacere în Delivery': 'Grow your own delivery business',
    'Curieri': 'Couriers',
    'Vreau să livrez': 'I want to deliver',
    'Sub-Flote': 'Sub-Fleets',
    'Vreau să-mi dezvolt echipa': 'I want to grow my team',
    'Alege tab-ul „Curieri” sau „Sub-Flote” pentru informațiile aferente.': 'Choose the “Couriers” or “Sub-Fleets” tab for the relevant information.',
    'Pregătim pagina pentru curieri…': 'Preparing the courier page…',
    'Introducere': 'Introduction',
    'Prezentare CIBERO pentru sub-flote': 'CIBERO presentation for sub-fleets',
    'Redă prezentarea CIBERO pentru sub-flote': 'Play the CIBERO presentation for sub-fleets',
    'Coperta prezentării CIBERO pentru sub-flote': 'CIBERO sub-fleet presentation cover',
    'infrastructură pentru creștere': 'infrastructure for growth',
    'VEZI O SCURTĂ PREZENTARE': 'WATCH A SHORT PRESENTATION',
    'Aplică drept sub-flotă': 'Apply as a sub-fleet',
    'Ce primești ca sub-flotă': 'What you get as a sub-fleet',
    'Panou propriu': 'Your own dashboard',
    'Control într-un singur loc': 'Control in one place',
    'Îți vezi curierii, statusurile, cererile și istoricul operațiunilor disponibile.': 'View your couriers, statuses, requests and available operation history.',
    'Administrare Bolt Food': 'Bolt Food administration',
    'Operațiuni rapide': 'Fast operations',
    'Cauți curieri și verifici vehiculul, soldurile, statusul contului și accesul la cash.': 'Find couriers and check their vehicle, balances, account status and cash access.',
    'Control cash și antifraudă': 'Cash control and fraud prevention',
    'Risc gestionat mai clar': 'Clearer risk management',
    'Verifici balanțele și controlezi accesul curierilor la comenzile cu numerar.': 'Check balances and control courier access to cash orders.',
    'Liste de așteptare': 'Waiting lists',
    'Înscrieri bine organizate': 'Well-organised applications',
    'Urmărești candidații, platforma, disponibilitatea și progresul până la activare.': 'Track candidates, platforms, availability and progress through activation.',
    'Recrutare și leaduri': 'Recruitment and leads',
    'Oportunități noi de recrutare': 'New recruitment opportunities',
    'Primești candidați alocați și îi urmărești în sistem până la activare.': 'Receive assigned candidates and track them in the system through activation.',
    'Tichete și suport': 'Tickets and support',
    'Cereri urmărite cap-coadă': 'Requests tracked end to end',
    'Trimiți solicitări pentru conturi, vehicule sau date și vezi stadiul lor.': 'Submit account, vehicle or data requests and follow their status.',
    'Rapoarte și financiar': 'Reports and financials',
    'Situații mai ușor de urmărit': 'Easier-to-follow statements',
    'Ai acces la rapoarte de activitate, plăți, solduri și clarificarea diferențelor.': 'Access activity reports, payments, balances and discrepancy clarification.',
    'Suport pentru curierii tăi': 'Support for your couriers',
    'Sprijin înainte și după activare': 'Support before and after activation',
    'Onboarding, transferuri și modificări de cont, vehicul sau oraș.': 'Onboarding, transfers and account, vehicle or city changes.',
    'Automatizări CIBERO Manager': 'CIBERO Manager automation',
    'Mai puțină muncă manuală, mai mult control': 'Less manual work, more control',
    'Operațiunile integrate reduc pașii repetați și păstrează istoricul acțiunilor.': 'Integrated operations reduce repetitive steps and preserve the action history.',
    'Cum funcționează rețeaua operațională CIBERO': 'How the CIBERO operational network works',
    'Infografic despre rețeaua operațională CIBERO pentru sub-flote': 'Infographic about the CIBERO operational network for sub-fleets',
    'Vezi pagina completă pentru sub-flote ↗': 'View the full sub-fleet page ↗',
    'Informații utile': 'Useful information',
    'Întrebări frecvente': 'Frequently asked questions',
    'Cine suntem': 'Who we are',
    'Despre noi': 'About us',
    'CibeRO - flotă parteneră cu toate cele 3 platforme delivery din țară, Bolt Food, Glovo și Wolt. Colaborăm cu persoane care vor să facă curierat la oricare din platforme, cu posibilitatea de activare la toate 3 platformele. De asemenea, colaborăm cu sub-flote deja existente sau în dezvoltare (și tu poți avea una).': 'CibeRO is a partner fleet working with all three delivery platforms in the country: Bolt Food, Glovo and Wolt. We work with people who want to deliver on any of the platforms, with the option to activate accounts on all three. We also work with existing sub-fleets or ones in development (you can build one, too).',
    'Tu ce alegi să faci din această oportunitate?': 'What will you do with this opportunity?',
    'Cine poate aplica drept sub-flotă?': 'Who can apply as a sub-fleet?',
    'O societate activă (SRL), cu acte la zi și o persoană de contact responsabilă de administrarea curierilor proprii.': 'An active company with up-to-date documents and a contact person responsible for managing its couriers.',
    'Cum aplic pentru parteneriat?': 'How do I apply for a partnership?',
    'Completezi formularul de': 'Complete the',
    'Înregistrare': 'registration form',
    ', selectezi „SRL” și menționezi că vrei să colaborezi ca sub-flotă.': ', select “SRL” and mention that you want to collaborate as a sub-fleet.',
    'Ce pot administra în CIBERO Manager?': 'What can I manage in CIBERO Manager?',
    'În funcție de permisiuni: curieri, statusuri, cereri, vehicule, balanțe, acces cash, leaduri și istoricul operațiunilor.': 'Depending on your permissions: couriers, statuses, requests, vehicles, balances, cash access, leads and operation history.',
    'Primesc ajutor pentru recrutare?': 'Do I receive recruitment support?',
    'Da. Poți primi candidați prin sistemul de repartizare și îi poți urmări până la activare. Contactarea și coordonarea lor rămân în responsabilitatea ta.': 'Yes. You can receive candidates through the allocation system and track them through activation. Contacting and coordinating them remains your responsibility.',
    'Cine răspunde de banii cash?': 'Who is responsible for cash?',
    'Administratorul sub-flotei răspunde de curierii proprii care lucrează cu numerar și de respectarea termenelor de depunere.': 'The sub-fleet administrator is responsible for their couriers who handle cash and for meeting deposit deadlines.',
    'Cum stabilim comisionul și plățile?': 'How are commission and payments agreed?',
    'Condițiile financiare se discută direct și sunt stabilite clar înainte de semnarea colaborării.': 'Financial terms are discussed directly and clearly agreed before the partnership is signed.',
    'Ce suport primesc curierii mei?': 'What support do my couriers receive?',
    'Îndrumare pentru onboarding, transferuri, modificări de cont sau vehicul și clarificări administrative, în limitele operațiunilor disponibile.': 'Guidance for onboarding, transfers, account or vehicle changes and administrative clarification within the available operations.',
    'Susținem ideea că, atunci când oamenii au libertate la a alege ei cum își gestionează viața, timpul, banii, și nu mai sunt condiționați de o rutină strictă și norme rigide, sunt mult mai predispuși să se dezvolte și să devină mai buni administratori ai resurselor lor.': 'We believe that when people are free to choose how they manage their lives, time and money, without being tied to a strict routine and rigid rules, they are much more likely to grow and become better stewards of their resources.',
    'fă primul pas': 'take the first step'
  };
  const pageOriginalText = new WeakMap();
  const pageOriginalAttributes = new WeakMap();

  function rememberPageCopy(root) {
    root.querySelectorAll('*').forEach(element => {
      Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => {
        if (!pageOriginalText.has(node)) pageOriginalText.set(node, node.nodeValue);
      });
      ['aria-label', 'alt', 'title', 'data-video-title'].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        let originals = pageOriginalAttributes.get(element);
        if (!originals) { originals = {}; pageOriginalAttributes.set(element, originals); }
        if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
      });
    });
  }

  function translatedValue(value, language) {
    if (language !== 'en') return value;
    const trimmed = value.trim();
    return pageTranslations[trimmed] ? value.replace(trimmed, pageTranslations[trimmed]) : value;
  }

  function translateTestPage(language = currentLanguage()) {
    [gate, document.querySelector('[data-choice-panel="subfleet"]'), document.querySelector('[data-shared-about]')].filter(Boolean).forEach(root => {
      root.querySelectorAll('*').forEach(element => {
        Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => {
          const original = pageOriginalText.get(node);
          if (original !== undefined) node.nodeValue = translatedValue(original, language);
        });
        const originals = pageOriginalAttributes.get(element);
        if (!originals) return;
        Object.entries(originals).forEach(([attribute, original]) => element.setAttribute(attribute, translatedValue(original, language)));
      });
    });
    const benefitTitle = courierContent?.querySelector('#showcase-title > span');
    if (benefitTitle) benefitTitle.textContent = language === 'en' ? 'What you get as a courier' : 'Ce primești ca și curier';
    const courierVideoAction = courierContent?.querySelector('.test-showcase .video-action');
    if (courierVideoAction) courierVideoAction.textContent = language === 'en' ? 'WATCH A SHORT PRESENTATION' : 'VEZI O SCURTĂ PREZENTARE';
    const courierAboutParagraph = courierContent?.querySelector('[data-testmode-i18n="about-values"]');
    if (courierAboutParagraph) courierAboutParagraph.textContent = language === 'en' ? pageTranslations['Susținem ideea că, atunci când oamenii au libertate la a alege ei cum își gestionează viața, timpul, banii, și nu mai sunt condiționați de o rutină strictă și norme rigide, sunt mult mai predispuși să se dezvolte și să devină mai buni administratori ai resurselor lor.'] : 'Susținem ideea că, atunci când oamenii au libertate la a alege ei cum își gestionează viața, timpul, banii, și nu mai sunt condiționați de o rutină strictă și norme rigide, sunt mult mai predispuși să se dezvolte și să devină mai buni administratori ai resurselor lor.';
    const courierAboutLinkText = courierContent?.querySelector('[data-testmode-i18n="first-step"]');
    if (courierAboutLinkText) courierAboutLinkText.textContent = language === 'en' ? 'take the first step' : 'fă primul pas';
    gate?.setAttribute('aria-label', language === 'en' ? 'Choose how you want to collaborate' : 'Alege tipul de colaborare');
    const homeLink = document.querySelector('.site-header nav > a:first-child');
    if (homeLink) homeLink.textContent = language === 'en' ? 'Main site' : 'Site principal';
    const contactLink = document.querySelector('.footer-legal-links a:last-child');
    contactLink?.setAttribute('aria-label', language === 'en' ? 'Contact the CibeRO administrator on WhatsApp' : 'Contactează administratorul CibeRO pe WhatsApp');
    const copyright = document.querySelector('.footer-copyright');
    if (copyright) copyright.textContent = language === 'en' ? '© Powered by CibeRO – 2026 | All rights reserved' : '© Powered by CibeRO – 2026 | Toate drepturile rezervate';
  }

  [gate, document.querySelector('[data-choice-panel="subfleet"]')].filter(Boolean).forEach(rememberPageCopy);

  const audienceCopy = {
    ro: {
      common: {
        general: 'Per general',
        detailed: 'În detaliu',
        detailLevel: 'Nivelul detaliilor',
        close: 'Închide fereastra informativă',
        sectionTitles: ['Ce oferim', 'Care sunt condițiile', 'Ce e bine să știi dinainte']
      },
      courier: {
        title: 'Colaborare pentru curieri',
        cta: 'Mergi la pagina de Curieri',
        general: [
          'Acces la Bolt Food, Glovo și Wolt, îndrumare la început, suport operațional și rapoarte clare.',
          'Ai minimum 18 ani, acte valabile, smartphone cu internet, un vehicul potrivit și respecți regulile platformelor.',
          'Câștigul și activarea variază în funcție de activitate, oraș, platformă și disponibilitate.'
        ],
        detailed: [
          [
            'Acces la Bolt Food, Glovo și Wolt, prin flota CIBERO.',
            'Ajutor la început: te ghidăm la crearea contului, la acte și la primele livrări.',
            'Suport când apare o problemă cu contul, vehiculul, orașul sau plățile. Ne scrii sau ne suni și rezolvăm cât putem de repede.',
            'Plăți și rapoarte clare: vezi ce ai câștigat, ce ți s-a reținut și de ce.',
            'Program flexibil: lucrezi când vrei, cât vrei.'
          ],
          [
            'Să ai minimum 18 ani.',
            'Acte de identitate valabile. Pentru cetățenii străini, documentele cerute de lege pentru a lucra în România.',
            'Un smartphone cu internet.',
            'Un vehicul potrivit (bicicletă, trotinetă, scuter, mașină), conform cerințelor fiecărei platforme. Pentru scuter sau mașină: permis și acte la zi.',
            'Seriozitate: respecți regulile platformei, ești politicos cu clienții și restaurantele și ai grijă de comenzi.',
            'Cash corect: dacă accepți comenzi plătite cash, predai banii la timp. Neregulile duc la blocarea accesului la comenzile cash.'
          ],
          [
            'Câștigul depinde de tine: de câte ore lucrezi, de oraș, de zi și de vreme. Nu promitem o sumă fixă.',
            'Activarea contului poate dura câteva zile, în funcție de platformă și de listele de așteptare.',
            'Platformele au regulile lor. Dacă nu le respecți, contul poate fi suspendat de platformă, nu de noi.'
          ]
        ]
      },
      subfleet: {
        title: 'Parteneriat pentru sub-flote',
        cta: 'Mergi la pagina de Sub-Flote',
        general: [
          'Panou propriu, administrarea curierilor, recrutare, tichete, rapoarte și suport operațional într-un singur ecosistem.',
          'Ai un SRL activ, o persoană responsabilă, curieri verificați și respecți regulile platformelor, GDPR și controlul cash.',
          'CIBERO oferă infrastructura; coordonarea echipei, rezultatele și responsabilitatea curierilor rămân la tine.'
        ],
        detailed: [
          [
            'Panou propriu în CIBERO Manager: îți vezi curierii, statusurile, cererile și istoricul.',
            'Administrare Bolt Food: cauți curieri, verifici vehiculul înregistrat, soldurile și accesul la cash.',
            'Recrutare și leaduri: primești candidați și îi urmărești până la activare.',
            'Sistem de tichete: trimiți cereri și vezi stadiul lor.',
            'Rapoarte și situații financiare: activitate, plăți, solduri, lămurirea diferențelor.',
            'Suport pentru curierii tăi: onboarding, transferuri, modificări de cont sau de vehicul.'
          ],
          [
            'Firmă activă (SRL) și acte la zi.',
            'O persoană de contact responsabilă, care răspunde la telefon și se ocupă de curierii ei.',
            'Curieri verificați: oamenii aduși de tine respectă condițiile pentru curieri.',
            'Respectarea regulilor platformelor și a regulilor interne CIBERO.',
            'Protecția datelor (GDPR): datele curierilor se folosesc doar pentru colaborare și nu se dau mai departe.',
            'Control pe cash: răspunzi de curierii tăi care lucrează cu bani cash.'
          ],
          [
            'Rezultatele depind de cât de activă e echipa ta. Noi îți dăm infrastructura, iar munca de coordonare rămâne la tine.',
            'Accesul în panou e limitat la curierii sub-flotei tale.',
            'Condițiile financiare (comision, plăți) le stabilim direct, la discuție, înainte de semnare.'
          ]
        ]
      }
    },
    en: {
      common: {
        general: 'General Info',
        detailed: 'Detailed Info',
        detailLevel: 'Level of detail',
        close: 'Close information window',
        sectionTitles: ['What we offer', 'Requirements', 'What to know beforehand']
      },
      courier: {
        title: 'Courier collaboration',
        cta: 'Go to the Courier page',
        general: [
          'Access to Bolt Food, Glovo and Wolt, initial guidance, operational support and clear reports.',
          'You are at least 18, have valid documents, an internet-enabled smartphone, a suitable vehicle and follow platform rules.',
          'Earnings and activation vary based on your activity, city, platform and availability.'
        ],
        detailed: [
          [
            'Access to Bolt Food, Glovo and Wolt through the CIBERO fleet.',
            'Getting-started help: we guide you through account creation, documents and your first deliveries.',
            'Support when an issue arises with your account, vehicle, city or payments. Message or call us and we will resolve it as quickly as possible.',
            'Clear payments and reports: see what you earned, what was withheld and why.',
            'Flexible schedule: work when you want, for as long as you want.'
          ],
          [
            'You must be at least 18 years old.',
            'Valid identity documents. Foreign citizens need the documents legally required to work in Romania.',
            'A smartphone with internet access.',
            'A suitable vehicle (bicycle, e-scooter, scooter or car), according to each platform’s requirements. For a scooter or car: valid licence and documents.',
            'Reliability: follow platform rules, be polite to customers and restaurants, and take care of orders.',
            'Correct cash handling: if you accept cash orders, deposit the money on time. Irregularities lead to cash-order access being blocked.'
          ],
          [
            'Your earnings depend on you: hours worked, city, day and weather. We do not promise a fixed amount.',
            'Account activation may take several days, depending on the platform and waiting lists.',
            'Platforms have their own rules. If you do not follow them, the platform—not us—may suspend your account.'
          ]
        ]
      },
      subfleet: {
        title: 'Sub-fleet partnership',
        cta: 'Go to the Sub-Fleet page',
        general: [
          'Your own dashboard, courier administration, recruitment, tickets, reports and operational support in one ecosystem.',
          'You have an active company, a responsible contact person, verified couriers, and follow platform, GDPR and cash-control rules.',
          'CIBERO provides the infrastructure; team coordination, results and courier responsibility remain with you.'
        ],
        detailed: [
          [
            'Your own CIBERO Manager dashboard: view your couriers, statuses, requests and history.',
            'Bolt Food administration: find couriers and check registered vehicles, balances and cash access.',
            'Recruitment and leads: receive candidates and track them through activation.',
            'Ticketing system: submit requests and follow their progress.',
            'Reports and financial statements: activity, payments, balances and discrepancy clarification.',
            'Support for your couriers: onboarding, transfers, and account or vehicle changes.'
          ],
          [
            'An active limited company (SRL) with up-to-date documents.',
            'A responsible contact person who answers the phone and manages their couriers.',
            'Verified couriers: the people you bring meet the courier requirements.',
            'Compliance with platform rules and CIBERO internal rules.',
            'Data protection (GDPR): courier data is used only for the collaboration and is not shared further.',
            'Cash control: you are responsible for your couriers who work with cash.'
          ],
          [
            'Results depend on how active your team is. We provide the infrastructure; coordination remains your responsibility.',
            'Dashboard access is limited to your sub-fleet’s couriers.',
            'Financial terms (commission and payments) are agreed directly before signing.'
          ]
        ]
      }
    }
  };

  function loadLanguageScript() {
    if (languageReady) return;
    languageReady = true;
    const script = document.createElement('script');
    script.src = '../site-language.js?v=15';
    document.body.append(script);
  }

  function initVideos(root) {
    root.querySelectorAll('.video-frame[data-youtube-id]').forEach(frame => {
      if (frame.dataset.demoReady) return;
      frame.dataset.demoReady = 'true';
      const poster = frame.querySelector('.video-poster');
      const thumbnail = poster?.querySelector('img[data-thumbnail-fallback]');
      thumbnail?.addEventListener('error', () => { if (thumbnail.dataset.thumbnailFallback) thumbnail.src = thumbnail.dataset.thumbnailFallback; }, { once: true });
      poster?.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(frame.dataset.youtubeId)}?autoplay=1&playsinline=1&rel=0`;
        iframe.title = frame.dataset.videoTitle || 'Videoclip de prezentare CibeRO';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        frame.replaceChildren(iframe);
      }, { once: true });
    });
  }

  function initBenefits(root) {
    root.querySelectorAll('[data-showcase-benefit]').forEach(card => {
      if (card.dataset.demoReady) return;
      card.dataset.demoReady = 'true';
      const button = card.querySelector('.showcase-benefit-toggle');
      const detail = card.querySelector('.showcase-benefit-detail');
      const hover = matchMedia('(hover: hover) and (pointer: fine)');
      const setOpen = open => {
        if (open) document.querySelectorAll('[data-showcase-benefit].is-open').forEach(other => {
          if (other === card) return;
          other.classList.remove('is-open');
          other.querySelector('.showcase-benefit-toggle')?.setAttribute('aria-expanded', 'false');
          const otherDetail = other.querySelector('.showcase-benefit-detail');
          otherDetail?.setAttribute('aria-hidden', 'true');
          if (otherDetail) otherDetail.inert = true;
        });
        card.classList.toggle('is-open', open);
        button?.setAttribute('aria-expanded', String(open));
        detail?.setAttribute('aria-hidden', String(!open));
        if (detail) detail.inert = !open;
      };
      card.addEventListener('pointerenter', () => { if (hover.matches) setOpen(true); });
      card.addEventListener('pointerleave', () => { if (hover.matches && !detail?.contains(document.activeElement)) setOpen(false); });
      card.addEventListener('click', event => { if (!event.target.closest('a')) setOpen(!card.classList.contains('is-open')); });
      card.addEventListener('keydown', event => { if (event.key === 'Escape') { setOpen(false); button?.focus(); } });
    });
  }

  function initAccordions(root) {
    root.querySelectorAll('[data-exclusive-accordion]').forEach(group => [...group.querySelectorAll(':scope > details')].forEach(item => item.addEventListener('toggle', () => {
      if (item.open) [...group.querySelectorAll(':scope > details')].forEach(other => { if (other !== item) other.open = false; });
    })));
  }

  function currentLanguage() {
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function renderAudiencePrompt() {
    if (!promptAudience || !promptContent) return;
    const language = currentLanguage();
    const common = audienceCopy[language].common;
    const copy = audienceCopy[language][promptAudience];
    const iconSets = promptAudience === 'courier'
      ? [['📱', '🤝', '🛠', '📊', '🕒'], ['🔞', '🪪', '📱', '🚲', '🤝', '💵'], ['📈', '⏳', '⚠']]
      : [['💻', '⚙', '👥', '🎫', '📊', '🤝'], ['🏢', '☎', '✓', '📋', '🔒', '💵'], ['📈', '🔐', '🤝']];
    prompt.querySelector('.audience-prompt-dialog').setAttribute('aria-label', copy.title);
    document.querySelector('[data-prompt-cta-label]').textContent = copy.cta;
    infoToggle.setAttribute('aria-label', common.detailLevel);
    infoToggle.dataset.infoActive = infoMode;
    infoButtons.forEach(button => {
      const active = button.dataset.infoMode === infoMode;
      button.textContent = button.dataset.infoMode === 'general' ? common.general : common.detailed;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('[data-prompt-close]').forEach(button => button.setAttribute('aria-label', common.close));
    const content = infoMode === 'general' ? copy.general.map(item => [item]) : copy.detailed;
    promptContent.dataset.mode = infoMode;
    promptContent.innerHTML = common.sectionTitles.map((title, index) => {
      const rows = content[index].map((item, itemIndex) => {
        const icon = infoMode === 'general' ? ['✦', '✓', 'i'][index] : iconSets[index][itemIndex];
        return `<li class="audience-info-row"><span aria-hidden="true">${icon}</span><p>${item}</p></li>`;
      }).join('');
      return `<section class="audience-info-section"><h3>${title}</h3><ul class="audience-info-list">${rows}</ul></section>`;
    }).join('');
  }

  function syncChoiceTabs(value) {
    tabs.forEach(tab => {
      const selected = tab.dataset.choice === value;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected || !value ? 0 : -1;
    });
    tablist.dataset.active = value || '';
  }

  function openAudiencePrompt(audience, returnFocus) {
    promptAudience = audience;
    infoMode = 'general';
    promptReturnFocus = returnFocus || document.querySelector(`[data-choice="${audience}"]`);
    syncChoiceTabs(audience);
    renderAudiencePrompt();
    prompt.hidden = false;
    document.body.classList.add('audience-prompt-open');
    requestAnimationFrame(() => prompt.querySelector('.audience-prompt-close')?.focus());
  }

  function closeAudiencePrompt() {
    if (!prompt || prompt.hidden) return;
    prompt.hidden = true;
    document.body.classList.remove('audience-prompt-open');
    syncChoiceTabs(activeChoice);
    promptReturnFocus?.focus();
  }

  async function prepareCourier() {
    if (courierReady) return;
    if (courierPromise) return courierPromise;
    courierPromise = (async () => { try {
      const response = await fetch('../index.html', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Homepage unavailable: ${response.status}`);
      const source = new DOMParser().parseFromString(await response.text(), 'text/html');
      const sourceMain = source.querySelector('main#acasa');
      if (!sourceMain) throw new Error('Homepage content missing');
      courierContent.replaceChildren(...[...sourceMain.children].map(section => document.importNode(section, true)));
      const benefitTitle = courierContent.querySelector('#showcase-title > span');
      if (benefitTitle) benefitTitle.textContent = 'Ce primești ca și curier';
      courierLoading.hidden = true;
      initVideos(courierContent);
      initBenefits(courierContent);
      initAccordions(courierContent);
      const about = source.querySelector('.home-about');
      const sharedAbout = document.querySelector('[data-shared-about]');
      if (about && sharedAbout) {
        sharedAbout.replaceChildren(document.importNode(about, true));
        rememberPageCopy(sharedAbout);
      }
      courierReady = true;
      loadLanguageScript();
      translateTestPage();
    } catch (error) {
      courierLoading.innerHTML = 'Pagina pentru curieri nu a putut fi încărcată. <a href="../">Deschide pagina principală</a>.';
      console.error(error);
      loadLanguageScript();
    } })();
    return courierPromise;
  }

  function activate(value, updateHash = true) {
    activeChoice = value;
    syncChoiceTabs(value);
    panels.forEach(panel => { const active = panel.dataset.choicePanel === value; panel.hidden = !active; panel.classList.toggle('is-active', active); });
    gate.classList.add('has-selection');
    if (updateHash) history.replaceState(null, '', value === 'subfleet' ? '#sub-flote' : '#curieri');
    if (value === 'courier') prepareCourier();
  }

  function chooseAudience(value, sourceTab) {
    if (!seenPrompts.has(value)) {
      seenPrompts.add(value);
      openAudiencePrompt(value, sourceTab);
      return;
    }
    switchAudienceWithoutScroll(value);
  }

  function switchAudienceWithoutScroll(value) {
    const left = window.scrollX;
    const top = window.scrollY;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    const previousOverflowAnchor = root.style.overflowAnchor;
    root.style.scrollBehavior = 'auto';
    root.style.overflowAnchor = 'none';
    activate(value);
    const restorePosition = () => window.scrollTo(left, top);
    restorePosition();
    requestAnimationFrame(() => {
      restorePosition();
      requestAnimationFrame(() => {
        restorePosition();
        root.style.scrollBehavior = previousBehavior;
        root.style.overflowAnchor = previousOverflowAnchor;
      });
    });
  }

  async function revealAudience(value) {
    activate(value);
    if (value === 'courier') await prepareCourier();
    const panel = panels.find(item => item.dataset.choicePanel === value);
    const target = panel?.querySelector('.test-showcase') || panel;
    setTimeout(() => {
      if (!target) return;
      const headerOffset = (document.querySelector('.site-header')?.offsetHeight || 0) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, Math.max(0, top));
      requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = previousScrollBehavior; });
    }, 360);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => chooseAudience(tab.dataset.choice, tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      chooseAudience(tabs[next].dataset.choice, tabs[next]);
    });
  });

  infoButtons.forEach((button, index) => button.addEventListener('click', () => {
    infoMode = button.dataset.infoMode;
    renderAudiencePrompt();
  }));
  infoButtons.forEach((button, index) => button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? infoButtons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + infoButtons.length) % infoButtons.length;
    infoMode = infoButtons[next].dataset.infoMode;
    renderAudiencePrompt();
    infoButtons[next].focus();
  }));
  document.querySelectorAll('[data-prompt-close]').forEach(button => button.addEventListener('click', closeAudiencePrompt));
  document.querySelector('[data-prompt-cta]')?.addEventListener('click', () => {
    const value = promptAudience;
    if (!value) return;
    revealAudience(value);
    prompt.hidden = true;
    document.body.classList.remove('audience-prompt-open');
  });
  document.addEventListener('keydown', event => {
    if (!prompt || prompt.hidden) return;
    if (event.key === 'Escape') { closeAudiencePrompt(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...prompt.querySelectorAll('button:not([disabled]), a[href]')].filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('cibero:language-change', event => {
    renderAudiencePrompt();
    translateTestPage(event.detail?.language || currentLanguage());
  });

  initAccordions(document);
  initVideos(document);
  prepareCourier();
})();
