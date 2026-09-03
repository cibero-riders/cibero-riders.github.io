const activeCityNames = [
  "Alba Iulia", "Arad", "Bacău", "Baia Mare", "Botoșani", "Brăila",
  "Brașov", "București", "Buzău", "Cluj-Napoca", "Constanța", "Craiova",
  "Deva", "Drobeta-Turnu Severin", "Focșani", "Galați", "Hunedoara", "Iași",
  "Mediaș", "Miercurea-Ciuc", "Onești", "Oradea", "Piatra Neamț", "Pitești",
  "Ploiești", "Râmnicu Vâlcea", "Reșița", "Roman", "Satu Mare",
  "Sfântu Gheorghe", "Sibiu", "Sighișoara", "Slatina", "Suceava",
  "Târgoviște", "Târgu Mureș", "Tecuci", "Timișoara", "Tulcea", "Vaslui", "Zalău"
];

const normalizeCity = value => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/ș/g, "s")
  .replace(/ț/g, "t")
  .toLowerCase()
  .replace(/[^a-z0-9]/g, "");

const cityLookupKey = value => normalizeCity(value)
  .replace(/^municipiul/, "")
  .replace(/^orasul/, "");

const activeByKey = new Map(activeCityNames.map(name => [cityLookupKey(name), name]));
const sourceData = window.CIBERO_MAP_DATA || { boundary: [], cities: [] };

function titleCaseCity(value) {
  const lowerWords = new Set(["de", "din", "la", "lui", "pe", "si"]);
  return value.toLocaleLowerCase("ro-RO").split(/([\s-]+)/).map((part, index) => {
    if (/^[\s-]+$/.test(part)) return part;
    if (index > 0 && lowerWords.has(part)) return part;
    return part.charAt(0).toLocaleUpperCase("ro-RO") + part.slice(1);
  }).join("");
}

const allCities = sourceData.cities.map(([rawName, county, lng, lat, type]) => {
  const activeName = activeByKey.get(cityLookupKey(rawName));
  return {
    rawName,
    name: activeName || titleCaseCity(rawName),
    county,
    lng,
    lat,
    type,
    active: Boolean(activeName)
  };
});

const cityByKey = new Map(allCities.map(city => [normalizeCity(city.name), city]));
const cityModal = document.querySelector("#city-modal");
const cityInput = document.querySelector("#city-input");
const cityResult = document.querySelector("#city-result");
const cityOptions = document.querySelector("#city-options");
const mapSvg = document.querySelector("#romania-map");
const mapTooltip = document.querySelector("#map-tooltip");
const svgNs = "http://www.w3.org/2000/svg";

allCities
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name, "ro"))
  .forEach(city => {
    const option = document.createElement("option");
    option.value = city.name;
    option.label = `${city.name} · ${city.active ? "activ" : "neactiv momentan"}`;
    cityOptions.append(option);
  });

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS(svgNs, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function renderMap() {
  if (!mapSvg || !sourceData.boundary.length) return;

  const width = 1000;
  const height = 620;
  const padX = 62;
  const padY = 55;
  const allCoordinates = [...sourceData.boundary, ...allCities.map(city => [city.lng, city.lat])];
  const longitudes = allCoordinates.map(point => point[0]);
  const latitudes = allCoordinates.map(point => point[1]);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const project = ([lng, lat]) => [
    padX + ((lng - minLng) / (maxLng - minLng)) * (width - padX * 2),
    padY + ((maxLat - lat) / (maxLat - minLat)) * (height - padY * 2)
  ];

  const defs = svgElement("defs");
  defs.innerHTML = `
    <linearGradient id="country-fill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4d285c" />
      <stop offset="0.52" stop-color="#271331" />
      <stop offset="1" stop-color="#160b20" />
    </linearGradient>
    <radialGradient id="country-glow" cx="50%" cy="42%" r="62%">
      <stop offset="0" stop-color="#8c4ca0" stop-opacity=".5" />
      <stop offset="1" stop-color="#1b0d25" stop-opacity="0" />
    </radialGradient>
    <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#050208" flood-opacity=".72" />
    </filter>
    <filter id="active-glow" x="-200%" y="-200%" width="500%" height="500%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#6dff9a" flood-opacity=".95" />
    </filter>
  `;
  mapSvg.append(defs);

  const outlinePath = sourceData.boundary.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + " Z";

  mapSvg.append(svgElement("path", {
    d: outlinePath,
    class: "country-shadow",
    filter: "url(#map-shadow)"
  }));
  mapSvg.append(svgElement("path", { d: outlinePath, class: "country-shape" }));
  mapSvg.append(svgElement("path", { d: outlinePath, class: "country-inner-glow" }));

  const inactiveLayer = svgElement("g", { class: "city-layer city-layer-inactive" });
  const activeLayer = svgElement("g", { class: "city-layer city-layer-active" });

  allCities.forEach(city => {
    const [x, y] = project([city.lng, city.lat]);
    const marker = svgElement("g", {
      class: `city-marker ${city.active ? "is-active" : "is-inactive"}`,
      transform: `translate(${x.toFixed(2)} ${y.toFixed(2)})`,
      "data-city": city.name,
      "aria-label": `${city.name}, județul ${city.county}: ${city.active ? "flota este activă" : "flota nu operează momentan"}`
    });

    if (city.active) {
      marker.setAttribute("role", "button");
      marker.setAttribute("tabindex", "0");
      marker.append(svgElement("circle", { class: "marker-halo", r: "14" }));
    }

    marker.append(svgElement("circle", { class: "marker-dot", r: city.active ? "7.5" : "3.3" }));
    marker.append(svgElement("circle", { class: "marker-core", r: city.active ? "2.7" : "1.2" }));

    const show = event => showMapTooltip(city, x, y, event.type === "click");
    marker.addEventListener("mouseenter", show);
    marker.addEventListener("focus", show);
    marker.addEventListener("click", show);
    marker.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showMapTooltip(city, x, y, true);
      }
    });

    (city.active ? activeLayer : inactiveLayer).append(marker);
  });

  mapSvg.append(inactiveLayer, activeLayer);
}

function showMapTooltip(city, x, y, sticky = false) {
  if (!mapTooltip || !mapSvg) return;
  const rect = mapSvg.getBoundingClientRect();
  mapTooltip.innerHTML = `<strong>${city.name}</strong><span>${city.active ? "✓ Flota este activă" : "× Flota nu operează momentan"}</span>`;
  mapTooltip.className = `map-tooltip visible ${city.active ? "active" : "inactive"}${sticky ? " sticky" : ""}`;
  mapTooltip.style.left = `${(x / 1000) * rect.width}px`;
  mapTooltip.style.top = `${(y / 620) * rect.height}px`;
}

renderMap();

mapSvg?.addEventListener("mouseleave", () => {
  if (!mapTooltip.classList.contains("sticky")) mapTooltip.classList.remove("visible");
});

document.addEventListener("click", event => {
  if (!event.target.closest(".city-marker") && !event.target.closest(".map-tooltip")) {
    mapTooltip?.classList.remove("visible", "sticky");
  }
});

document.querySelectorAll("[data-open-city]").forEach(button => {
  button.addEventListener("click", () => {
    cityModal.showModal();
    cityInput.focus();
  });
});

document.querySelectorAll("dialog .close").forEach(button => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

document.querySelector("#city-form")?.addEventListener("submit", event => {
  event.preventDefault();
  const submitted = cityInput.value.trim();
  const city = cityByKey.get(normalizeCity(submitted));

  if (!city) {
    cityResult.className = "city-result no";
    cityResult.innerHTML = `<strong>Nu am identificat „${submitted}” în lista orașelor.</strong><br>Verifică scrierea sau alege o variantă din lista de sugestii.`;
    return;
  }

  cityResult.className = `city-result ${city.active ? "yes" : "no"}`;
  cityResult.innerHTML = city.active
    ? `<strong>✓ Da, flota este activă în ${city.name}.</strong><br>Poți continua către onboarding pentru a alege platforma potrivită.<br><a href="deschide-cont.html">Deschide onboarding-ul →</a>`
    : `<strong>Flota nu operează momentan în ${city.name}.</strong><br>Orașul este deja inclus în hartă și îi vom actualiza statutul când devine disponibil.`;
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

menuToggle?.addEventListener("click", event => {
  navigation.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", navigation.classList.contains("open"));
});

navigation?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
