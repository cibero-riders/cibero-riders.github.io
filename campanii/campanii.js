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
