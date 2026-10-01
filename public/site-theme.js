(() => {
  const STORAGE_KEY = "cibero-public-theme";
  const THEMES = ["light", "midday", "night"];
  const icons = { light: "☀", midday: "◐", night: "☾" };
  const labels = { light: "Day mode", midday: "Midday mode", night: "Night mode" };

  function storedTheme() {
    const value = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(value) ? value : "midday";
  }

  function applyTheme(theme) {
    const nextTheme = THEMES.includes(theme) ? theme : "midday";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    document.querySelectorAll("[data-public-theme]").forEach((button) => {
      const active = button.dataset.publicTheme === nextTheme;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function buildSwitch() {
    const control = document.createElement("div");
    control.className = "public-theme-switch";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", "Aspect pagină");
    THEMES.forEach((theme) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.publicTheme = theme;
      button.title = labels[theme];
      button.setAttribute("aria-label", labels[theme]);
      button.innerHTML = `<span aria-hidden="true">${icons[theme]}</span>`;
      button.addEventListener("click", () => applyTheme(theme));
      control.append(button);
    });
    return control;
  }

  function installSwitch() {
    if (document.querySelector(".public-theme-switch")) return;
    const header = document.querySelector(".global-header, .registration-header, .availability-header, .site-title");
    if (!header) return;
    const control = buildSwitch();
    const navigation = header.matches(".global-header") ? header.querySelector("nav") : null;
    const menu = header.querySelector(".menu-toggle");
    const language = header.querySelector(".language-switch");
    if (navigation) navigation.append(control);
    else if (menu) header.insertBefore(control, menu);
    else if (language) header.insertBefore(control, language);
    else header.append(control);
    applyTheme(storedTheme());
  }

  // Move the existing controls on mobile, preserving their links, state and event listeners.
  function installMobileNavigation() {
    const header = document.querySelector(".site-header.global-header");
    const navigation = header?.querySelector("nav");
    const account = navigation?.querySelector(".nav-account");
    if (!header || !navigation || !account || header.dataset.mobileNavigationInstalled) return;
    header.dataset.mobileNavigationInstalled = "true";
    const language = header.querySelector(":scope > .public-language-switch");
    const theme = navigation.querySelector(":scope > .public-theme-switch");
    const accountSlot = document.createComment("Desktop registration position");
    const languageSlot = document.createComment("Desktop language position");
    const themeSlot = document.createComment("Desktop theme position");
    account.before(accountSlot);
    language?.before(languageSlot);
    theme?.before(themeSlot);
    const controls = document.createElement("div");
    controls.className = "mobile-menu-controls";
    const mobile = window.matchMedia("(max-width: 760px)");

    function arrangeNavigation() {
      navigation.classList.remove("open");
      header.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
      if (mobile.matches) {
        header.insertBefore(account, navigation);
        account.classList.add("mobile-header-account");
        if (language) controls.append(language);
        if (theme) controls.append(theme);
        navigation.append(controls);
      } else {
        accountSlot.after(account);
        account.classList.remove("mobile-header-account");
        if (language) languageSlot.after(language);
        if (theme) themeSlot.after(theme);
        controls.remove();
      }
    }

    arrangeNavigation();
    mobile.addEventListener("change", arrangeNavigation);
  }

  function installHeaderControls() {
    installSwitch();
    installMobileNavigation();
  }

  applyTheme(storedTheme());
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installHeaderControls, { once: true });
  else installHeaderControls();
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) applyTheme(storedTheme());
  });
})();
