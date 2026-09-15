(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-nav");
  const tabs = [...document.querySelectorAll("[data-benefit]")];
  const panels = [...document.querySelectorAll("[data-panel]")];

  menuToggle?.addEventListener("click", event => {
    const isOpen = navigation?.classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navigation?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  function selectBenefit(key, moveFocus = false, updateHash = true) {
    const selectedTab = tabs.find(tab => tab.dataset.benefit === key) || tabs[0];
    if (!selectedTab) return;
    const selectedKey = selectedTab.dataset.benefit;

    tabs.forEach(tab => {
      const active = tab === selectedTab;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.dataset.panel === selectedKey;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
    if (updateHash) history.replaceState(null, "", `#${selectedKey}`);
    selectedTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    if (moveFocus) selectedTab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectBenefit(tab.dataset.benefit));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      selectBenefit(tabs[next].dataset.benefit, true);
    });
  });

  const initial = location.hash.replace("#", "");
  if (tabs.some(tab => tab.dataset.benefit === initial)) selectBenefit(initial, false, false);
  window.addEventListener("hashchange", () => {
    const key = location.hash.replace("#", "");
    if (tabs.some(tab => tab.dataset.benefit === key)) selectBenefit(key, false, false);
  });
})();
