(() => {
  const browser = document.querySelector('[data-hub-variant="subfleet"] .hub-essential-list');
  if (!browser) return;

  const categories = [...browser.querySelectorAll(':scope > .hub-category-accordion')];
  const sidebar = document.createElement('nav');
  sidebar.className = 'subfleet-sidebar';
  sidebar.setAttribute('aria-label', 'Secțiunile hub-ului');

  const view = document.createElement('div');
  view.className = 'subfleet-view';
  view.setAttribute('role', 'region');
  view.setAttribute('aria-labelledby', 'subfleet-view-title');
  const menuReturn = document.createElement('button');
  menuReturn.type = 'button';
  menuReturn.className = 'subfleet-menu-return';
  menuReturn.addEventListener('click', () => sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  const heading = document.createElement('div');
  heading.className = 'subfleet-view-heading';
  const eyebrow = document.createElement('span');
  eyebrow.className = 'subfleet-view-eyebrow';
  const title = document.createElement('h2');
  title.id = 'subfleet-view-title';
  heading.append(eyebrow, title);
  const content = document.createElement('div');
  content.className = 'subfleet-view-content';
  view.append(menuReturn, heading, content);

  const groups = categories.map((category) => {
    const group = document.createElement('div');
    group.className = 'subfleet-nav-group';
    const primary = document.createElement('button');
    primary.type = 'button';
    primary.className = 'subfleet-nav-primary';
    const symbol = document.createElement('span');
    symbol.className = 'subfleet-nav-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.append(category.querySelector(':scope > summary .hub-category-symbol svg').cloneNode(true));
    const primaryLabel = document.createElement('span');
    primaryLabel.className = 'subfleet-nav-label';
    const chevron = document.createElement('span');
    chevron.className = 'subfleet-nav-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '›';
    primary.append(symbol, primaryLabel, chevron);
    group.append(primary);

    const source = category.querySelector(':scope > summary .hub-category-title');
    const items = category.id === 'aplicatii-mobile'
      ? [...category.querySelectorAll('[data-app-platform]')].map((tab) => ({
          route: `aplicatii-mobile/${tab.dataset.appPlatform === 'bolt' ? 'boltfood' : tab.dataset.appPlatform}`,
          source: tab.querySelector('span:last-child'),
          resource: null
        }))
      : [...category.querySelectorAll(':scope > .hub-category-content > .hub-resource')].map((resource) => ({
          route: resource.id,
          source: resource.querySelector(':scope > summary strong'),
          resource
        }));

    if (items.length) {
      const sublist = document.createElement('div');
      sublist.className = 'subfleet-nav-sublist';
      sublist.id = `subfleet-nav-${category.id}`;
      primary.setAttribute('aria-controls', sublist.id);
      items.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'subfleet-nav-item';
        button.dataset.subfleetRoute = item.route;
        item.button = button;
        sublist.append(button);
      });
      primary.setAttribute('aria-expanded', 'false');
      group.append(sublist);
    }

    primary.addEventListener('click', () => navigate(items[0]?.route || category.id));
    items.forEach((item) => item.button.addEventListener('click', () => navigate(item.route)));
    sidebar.append(group);
    content.append(category);
    return { category, group, primary, primaryLabel, source, items };
  });

  browser.prepend(sidebar, view);
  browser.classList.add('subfleet-browser');

  function currentRoute() {
    try { return decodeURIComponent(location.hash.slice(1)).replace(/\/#/g, '/').replace(/\/+$/, ''); }
    catch { return ''; }
  }

  function navigate(route) {
    if (currentRoute() === route) {
      sync();
      view.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    location.hash = route;
  }

  function selectedGroup(route) {
    const section = route.split('/')[0];
    return groups.find(({ category, items }) => category.id === section || items.some((item) => item.route === section)) || groups[0];
  }

  function sync() {
    const route = currentRoute();
    const group = selectedGroup(route);
    const section = route.split('/')[0];
    const selectedItem = group.items.find((item) => item.route === section || item.route === route) || group.items[0];

    groups.forEach(({ category, group: navGroup, primary, items }) => {
      const active = category === group.category;
      category.classList.toggle('subfleet-current-category', active);
      category.open = active;
      navGroup.classList.toggle('is-active', active);
      primary.setAttribute('aria-expanded', String(active && items.length > 0));
      if (active) primary.setAttribute('aria-current', 'true');
      else primary.removeAttribute('aria-current');
      items.forEach((item) => {
        const itemActive = active && item === selectedItem;
        item.button.classList.toggle('is-active', itemActive);
        if (itemActive) item.button.setAttribute('aria-current', 'page');
        else item.button.removeAttribute('aria-current');
        if (item.resource) {
          item.resource.classList.toggle('subfleet-current-resource', itemActive);
          item.resource.open = itemActive;
        }
      });
    });

    eyebrow.textContent = group.source.textContent.trim();
    title.textContent = (selectedItem?.source || group.source).textContent.trim();
  }

  function refreshLabels() {
    groups.forEach(({ primaryLabel, source, items }) => {
      primaryLabel.textContent = source.textContent.trim();
      items.forEach((item) => { item.button.textContent = item.source.textContent.trim(); });
    });
    sidebar.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Hub sections' : 'Secțiunile hub-ului');
    menuReturn.textContent = document.documentElement.lang === 'en' ? '↑ Sections' : '↑ Secțiuni';
    sync();
  }

  window.addEventListener('hashchange', sync);
  window.addEventListener('popstate', sync);
  document.addEventListener('cibero:language-change', refreshLabels);
  refreshLabels();
})();
