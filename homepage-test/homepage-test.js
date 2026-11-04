(() => {
  const tablist = document.querySelector('.audience-tabs');
  const tabs = [...document.querySelectorAll('[data-audience-tab]')];
  const panels = [...document.querySelectorAll('[data-audience-panel]')];

  function activate(value, updateHash = true) {
    const selected = tabs.find(tab => tab.dataset.audienceTab === value) || tabs[0];
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.dataset.audiencePanel === selected.dataset.audienceTab;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    tablist.dataset.active = selected.dataset.audienceTab;
    if (updateHash) history.replaceState(null, '', selected.dataset.audienceTab === 'subfleet' ? '#sub-flote' : '#curieri');
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.audienceTab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activate(tabs[nextIndex].dataset.audienceTab);
    });
  });

  activate(location.hash === '#sub-flote' ? 'subfleet' : 'courier', false);

  document.querySelectorAll('.demo-video-frame[data-youtube-id]').forEach(frame => {
    frame.querySelector('button')?.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${frame.dataset.youtubeId}?autoplay=1&rel=0`;
      iframe.title = 'Prezentare CibeRO pentru curieri';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
    }, { once: true });
  });

  document.querySelectorAll('.demo-local-video[data-video-src]').forEach(frame => {
    frame.querySelector('button')?.addEventListener('click', () => {
      const video = document.createElement('video');
      video.src = frame.dataset.videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      frame.replaceChildren(video);
      video.play().catch(() => {});
    }, { once: true });
  });

  document.querySelector('.demo-infographic')?.addEventListener('click', () => {
    location.href = '../subflote/';
  });
})();
