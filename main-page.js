const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
const touchQuery = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 760px)");
const benefitEntries = document.querySelectorAll(".benefit-entry");

menuToggle?.addEventListener("click", event => {
  const isOpen = navigation.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

navigation?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

function configureBenefitInteraction() {
  benefitEntries.forEach(entry => {
    entry.classList.remove("is-open");
    if (touchQuery.matches) {
      entry.setAttribute("role", "button");
      entry.setAttribute("tabindex", "0");
      entry.setAttribute("aria-expanded", "false");
    } else {
      entry.removeAttribute("role");
      entry.removeAttribute("tabindex");
      entry.removeAttribute("aria-expanded");
    }
  });
}

function toggleBenefit(entry) {
  if (!touchQuery.matches) return;
  const shouldOpen = !entry.classList.contains("is-open");
  benefitEntries.forEach(item => {
    item.classList.remove("is-open");
    item.setAttribute("aria-expanded", "false");
  });
  entry.classList.toggle("is-open", shouldOpen);
  entry.setAttribute("aria-expanded", String(shouldOpen));
}

benefitEntries.forEach(entry => {
  entry.addEventListener("click", () => toggleBenefit(entry));
  entry.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleBenefit(entry);
    }
  });
});

touchQuery.addEventListener?.("change", configureBenefitInteraction);
configureBenefitInteraction();
