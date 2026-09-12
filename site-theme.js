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

  applyTheme(storedTheme());
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installSwitch, { once: true });
  else installSwitch();
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) applyTheme(storedTheme());
  });
})();
