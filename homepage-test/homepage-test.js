(() => {
  const gate = document.querySelector('.choice-gate');
  const tablist = document.querySelector('.choice-toggle');
  const tabs = [...document.querySelectorAll('[data-choice]')];
  const panels = [...document.querySelectorAll('[data-choice-panel]')];
  const emptyState = document.querySelector('[data-choice-empty]');
  const courierContent = document.querySelector('[data-courier-content]');
  const courierLoading = document.querySelector('[data-courier-loading]');
  let courierReady = false;
  let languageReady = false;

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

  async function prepareCourier() {
    if (courierReady) return;
    try {
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
      if (about && sharedAbout) sharedAbout.replaceChildren(document.importNode(about, true));
      courierReady = true;
      loadLanguageScript();
    } catch (error) {
      courierLoading.innerHTML = 'Pagina pentru curieri nu a putut fi încărcată. <a href="../">Deschide pagina principală</a>.';
      console.error(error);
      loadLanguageScript();
    }
  }

  function activate(value, updateHash = true) {
    tabs.forEach(tab => { const active = tab.dataset.choice === value; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    panels.forEach(panel => { const active = panel.dataset.choicePanel === value; panel.hidden = !active; panel.classList.toggle('is-active', active); });
    tablist.dataset.active = value;
    gate.classList.add('has-selection');
    emptyState.hidden = true;
    if (updateHash) history.replaceState(null, '', value === 'subfleet' ? '#sub-flote' : '#curieri');
    if (value === 'courier') prepareCourier();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.choice));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      activate(tabs[next].dataset.choice);
    });
  });

  document.querySelectorAll('[data-local-video]').forEach(frame => frame.querySelector('button')?.addEventListener('click', () => {
    const video = document.createElement('video');
    video.src = frame.dataset.localVideo;
    video.title = frame.dataset.videoTitle || 'Prezentare CIBERO pentru sub-flote';
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    frame.replaceChildren(video);
    video.play().catch(() => {});
  }, { once: true }));

  initAccordions(document);
  prepareCourier();
})();
