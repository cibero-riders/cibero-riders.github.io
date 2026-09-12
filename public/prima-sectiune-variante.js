const benefits = [
  ["◷", "Flexibilitate", "Tu îți faci programul", "dar ține minte că productivitatea se realizează prin disciplină și consistență"],
  ["◈", "Autonomie", "Ești propriul șef - tu decizi nivelul de muncă și cum o faci", "dar sperăm să ții cont de conduita de bun simț și cooperare a platformelor și flotei 🙏"],
  ["◉", "Câștiguri competitive", "3.000-6.000 lei/lună venit net", "noi îți oferim sfaturi, bonusuri și campanii pentru a-ți maximiza profitul - tu decizi unde pui pragul 💪"],
  ["▤", "Plăți și rapoarte săptămânale stabile", "Încasările tale sunt în siguranță cu noi", "primești raport săptămânal și plata direct pe IBAN; plată corectă până la ultimul cent, pentru munca ta 👌"],
  ["◌", "Suport dedicat", "Staff-ul și comunitatea îți sunt alături", "oricând ai probleme, nu ești singur - comunitatea, staff-ul flotei, cât și asistența de la platforme îți sunt alături"],
  ["◇", "Siguranță", "Un mediu sigur și stabil", "datele și activitatea ta din cadrul flotei sunt în siguranță cu noi - adică, ești în siguranță cu noi ✌️"],
  ["✦", "Sistemul flotei", "Platforme unice, tehnologie intuitivă", "avem aplicație mobilă, grup de comunitate, canal de anunțuri, sistem de ticketing și multe altele"]
];

const template = document.querySelector("#benefit-template");

document.querySelectorAll("[data-benefit-list]").forEach(list => {
  benefits.forEach(([icon, title, summary, note], index) => {
    const item = template.content.firstElementChild.cloneNode(true);
    item.querySelector(".benefit-index").textContent = icon;
    item.querySelector("h2").textContent = title;
    item.querySelector("strong").textContent = summary;
    item.querySelector("p").textContent = note;
    item.style.setProperty("--order", index);
    item.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("is-open");
      list.querySelectorAll(".is-open").forEach(openItem => openItem.classList.remove("is-open"));
      item.classList.toggle("is-open", shouldOpen);
    });
    list.append(item);
  });
});

const variantButtons = document.querySelectorAll("[data-variant]");
const concepts = document.querySelectorAll("[data-concept]");

variantButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selected = button.dataset.variant;
    variantButtons.forEach(item => item.classList.toggle("active", item === button));
    concepts.forEach(concept => {
      const isSelected = concept.dataset.concept === selected;
      concept.hidden = !isSelected;
      concept.classList.toggle("active", isSelected);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
