(() => {
  const copy = {
    "about-values": {
      ro: "Susținem ideea că, atunci când oamenii au libertate la a alege ei cum își gestionează viața, timpul, banii, și nu mai sunt condiționați de o rutină strictă și norme rigide, sunt mult mai predispuși să se dezvolte și să devină mai buni administratori ai resurselor lor.",
      en: "We believe that when people are free to choose how they manage their lives, time and money, without being tied to a strict routine and rigid rules, they are more likely to grow and become better stewards of their resources."
    },
    "first-step": { ro: "fă primul pas", en: "take the first step" }
  };
  const update = () => {
    const lang = document.documentElement.lang === "en" ? "en" : "ro";
    document.querySelectorAll("[data-testmode-i18n]").forEach(node => {
      node.textContent = copy[node.dataset.testmodeI18n][lang];
    });
  };
  update();
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
