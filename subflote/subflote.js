(() => {
  const en = {
    heroEyebrow: 'PARTNERSHIP FOR SUB-FLEETS',
    heroTitleFirst: 'You grow your team —',
    heroTitleSecond: 'we provide the infrastructure.',
    heroLead: 'CIBERO Manager gives you one place for courier management, recruitment, operations and support.',
    heroSupport: 'You have tools for direct action and support for operations that require our involvement.',
    applyButton: 'Apply as a sub-fleet',
    discoverButton: 'See what you receive',
    formNote: 'In the registration form, select “SRL” to apply as a sub-fleet.',
    videoEyebrow: 'PRESENTATION VIDEO',
    videoTitle: 'Discover the CIBERO partnership for sub-fleets',
    videoAction: 'See what your sub-fleet receives',
    videoLink: 'Watch the presentation on YouTube',
    infographicCaption: 'Tap the infographic to view it at full size.',
    previewActive: 'OPERATIONAL',
    previewEyebrow: 'SUB-FLEET DASHBOARD',
    previewTitle: 'One place for your team.',
    previewCouriers: 'Couriers',
    previewCouriersMeta: 'statuses and operations',
    previewRecruitment: 'Recruitment',
    previewRecruitmentMeta: 'leads and candidates',
    previewFinance: 'Finance',
    previewFinanceMeta: 'reports and payments',
    previewSupport: 'Support',
    previewSupportMeta: 'tickets and history',
    previewFlow: 'OPERATIONAL FLOW',
    platformStrip: 'Management and support for',
    platformAvailability: 'depending on city and availability',
    benefitsOverline: 'WHAT YOU RECEIVE AS A PARTNER',
    benefitsTitle: 'The infrastructure for a well-organised sub-fleet.',
    benefitsIntro: 'Four areas in one system: management, Bolt operations, recruitment and financial support.',
    jump1: 'Your own dashboard',
    jump2: 'Bolt management',
    jump3: 'Recruitment and leads',
    jump4: 'Support and finance',
    panelOverline: 'CIBERO MANAGER',
    panelTitle: 'A dedicated dashboard for your sub-fleet.',
    panelLead: 'You have dedicated access to your sub-fleet’s data, couriers and operations, based on the permissions granted.',
    panel1: 'Manage couriers, statuses and requests in one dashboard.',
    panel2: 'View balances and the available operation history.',
    panel3: 'Access is limited to your sub-fleet’s data.',
    panel4: 'Courier information, requests, balances and operation history in the available modules.',
    boltOverline: 'BOLT FOOD OPERATIONAL CONTROL',
    boltTitle: 'From identifying a courier to taking action on their account.',
    boltIntro: 'Integrated operations are processed through the system, with automation that reduces manual intervention.',
    boltAdminTitle: 'Managing Bolt Food couriers',
    bolt1: 'Identify couriers and quickly check account status.',
    bolt2: 'View and change the registered vehicle.',
    bolt3: 'Check balances and control access to cash orders.',
    bolt4: 'Manage blocks and review operation history.',
    bolt5: 'Enable or disable the cash option.',
    bolt6: 'Block or unblock a courier in line with platform rules and granted permissions.',
    bolt7: 'Track request status and operation history.',
    cashTitle: 'Cash control and anti-fraud protection',
    cashIntro: 'Tools that help you manage risk and take action on the couriers you administer.',
    cash1: 'Cash control',
    cash2: 'Balance checks',
    cash3: 'Anti-fraud protection',
    cash4: 'Take action on accounts',
    cash5: 'Bolt anti-fraud system',
    cashNote: 'You can take action within the available operations and granted permissions.',
    recruitOverline: 'GROWING YOUR TEAM',
    recruitTitle: 'From the first lead to activation.',
    recruitIntro: 'Organise candidates, track their progress and claim recruitment opportunities assigned to your sub-fleet.',
    waitingTitle: 'Waiting lists and registrations',
    waiting1: 'Register and track candidates through activation.',
    waiting2: 'Use automatically updated waiting lists.',
    waiting3: 'Organise registrations by platform and availability.',
    waiting4: 'Organise candidates by platform and availability.',
    waiting5: 'Track the process through activation.',
    glovoNote: 'Manage onboarding statuses, tags, reconfirmations and automated communication in configured flows.',
    woltNote: 'Track requests, recruitment needs and available places. Activation depends on platform availability in each city.',
    leadsTitle: 'Recruitment support and access to leads',
    leads1: 'Access candidates allocated to your sub-fleet.',
    leads2: 'Claim and track leads directly in the system.',
    leads3: 'Receive support for onboarding and activation.',
    leads4: 'Support for registration, onboarding and activation steps.',
    leads5: 'Access only candidates assigned to or claimed by your sub-fleet, according to system rules.',
    leadsNote: 'Leads are opportunities; contacting and following them up is your responsibility.',
    operationsOverline: 'DAILY OPERATIONS',
    operationsTitle: 'Organised support. Clear financial records.',
    ticketsTitle: 'Ticketing and support',
    tickets1: 'Submit and track requests in an organised flow.',
    tickets2: 'Receive support with accounts, vehicles and data.',
    tickets3: 'CIBERO steps in when centralised processing is required.',
    tickets4: 'CIBERO team intervention for centralised processing or platform communication.',
    tickets5: 'Courier support channel through CIBERO Manager.',
    financeTitle: 'Reports and financial administration',
    finance1: 'Receive activity reports and payment statements.',
    finance2: 'Track balances, payments and settlements.',
    finance3: 'Receive support in clarifying discrepancies.',
    finance4: 'Payment processing according to partnership terms and platform schedules.',
    courierSupportTitle: 'Support for your sub-fleet’s couriers',
    courierSupportIntro: 'Your team receives guidance before and after activation, while you retain visibility into requests.',
    courier1: 'Guidance for registration and activation.',
    courier2: 'Transfers and updates to accounts, vehicles or cities.',
    courier3: 'Clarifications about reports, payments and cash balances.',
    courier4: 'Explanations about reports, payments and cash balances.',
    courier5: 'Administrative support after activation.',
    summaryOverline: 'CIBERO PARTNERSHIP',
    summaryTitle: 'You grow your sub-fleet. The infrastructure grows with you.',
    summaryBody: 'CIBERO gives you control over couriers, automation, recruitment, waiting lists and an organised support system.',
    tag1: 'Control',
    tag2: 'Automation',
    tag3: 'Recruitment',
    tag4: 'Support',
    finalOverline: 'THE NEXT STEP',
    finalTitle: 'Build your sub-fleet on a solid foundation.',
    finalBody: 'Complete the registration form and select “SRL”. The CIBERO team will review your request and contact you about the next steps.',
    finalButton: 'Apply as a sub-fleet'
  };

  const originals = new WeakMap();
  const nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach(node => originals.set(node, node.textContent));
  const description = document.querySelector('meta[name="description"]');
  const videoFrame = document.querySelector('.sf-video-frame[data-youtube-id]');
  const videoPoster = videoFrame?.querySelector('.sf-video-poster');

  function setLanguage(language) {
    const isEnglish = language === 'en';
    nodes.forEach(node => {
      node.textContent = isEnglish ? en[node.dataset.i18n] ?? originals.get(node) : originals.get(node);
    });
    document.title = isEnglish ? 'Sub-fleet partnerships | CibeRO' : 'Parteneriate sub-flote | CibeRO';
    description?.setAttribute('content', isEnglish
      ? 'Manage and grow your sub-fleet with CIBERO Manager, operational tools, recruitment and dedicated support.'
      : 'Administrează și dezvoltă-ți sub-flota cu CIBERO Manager, instrumente operaționale, recrutare și suport dedicat.');
    if (videoFrame) videoFrame.dataset.videoTitle = isEnglish
      ? 'CIBERO presentation for partner sub-fleets'
      : 'Prezentare CIBERO pentru sub-flote';
    videoPoster?.setAttribute('aria-label', isEnglish
      ? 'Play the CIBERO presentation for partner sub-fleets'
      : 'Redă prezentarea CIBERO pentru sub-flote');
  }

  document.addEventListener('cibero:language-change', event => setLanguage(event.detail.language));
  setLanguage(document.documentElement.lang);

  if (videoFrame && videoPoster) {
    const thumbnail = videoPoster.querySelector('img[data-thumbnail-fallback]');
    if (thumbnail) {
      const useFallback = () => {
        const fallback = thumbnail.dataset.thumbnailFallback;
        if (!fallback) return;
        delete thumbnail.dataset.thumbnailFallback;
        thumbnail.src = fallback;
      };
      thumbnail.addEventListener('error', useFallback, { once: true });
      thumbnail.addEventListener('load', () => {
        if (thumbnail.naturalWidth < 300) useFallback();
      }, { once: true });
      if (thumbnail.complete && thumbnail.naturalWidth < 300) useFallback();
    }

    videoPoster.addEventListener('click', () => {
      const videoId = videoFrame.dataset.youtubeId;
      if (!videoId) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&playsinline=1&rel=0`;
      iframe.title = videoFrame.dataset.videoTitle || 'Prezentare CIBERO pentru sub-flote';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      videoFrame.replaceChildren(iframe);
      iframe.focus();
    }, { once: true });
  }
})();
