const activeCityNames = [
  "Alba Iulia", "Arad", "Bacău", "Baia Mare", "Botoșani", "Brăila",
  "Brașov", "București", "Buzău", "Cluj-Napoca", "Constanța", "Craiova",
  "Deva", "Drobeta-Turnu Severin", "Focșani", "Galați", "Hunedoara", "Iași",
  "Mediaș", "Miercurea-Ciuc", "Onești", "Oradea", "Piatra Neamț", "Pitești",
  "Ploiești", "Râmnicu Vâlcea", "Reșița", "Roman", "Satu Mare",
  "Sfântu Gheorghe", "Sibiu", "Sighișoara", "Slatina", "Suceava",
  "Târgoviște", "Târgu Mureș", "Tecuci", "Timișoara", "Tulcea", "Vaslui", "Zalău"
];

// Listele publice ale platformelor, verificate la 3 septembrie 2026.
// Zonele care nu sunt orașe de sine stătătoare nu sunt incluse ca markere.
const platformCities = {
  "Bolt Food": [
    "Alba Iulia", "Arad", "Bacău", "Baia Mare", "Bistrița", "Botoșani", "Brăila",
    "Brașov", "București", "Buzău", "Cluj-Napoca", "Constanța", "Craiova", "Focșani",
    "Galați", "Iași", "Oradea", "Piatra Neamț", "Pitești", "Ploiești", "Râmnicu Vâlcea",
    "Satu Mare", "Sibiu", "Suceava", "Târgoviște", "Târgu Jiu", "Târgu Mureș",
    "Timișoara", "Tulcea", "Vaslui"
  ],
  Wolt: [
    "Alba Iulia", "Arad", "Bacău", "Baia Mare", "Botoșani", "Brăila", "Brașov",
    "București", "Buzău", "Cluj-Napoca", "Constanța", "Craiova", "Deva",
    "Drobeta-Turnu Severin", "Focșani", "Galați", "Iași", "Mediaș", "Oradea",
    "Piatra Neamț", "Pitești", "Ploiești", "Râmnicu Vâlcea", "Reșița", "Satu Mare",
    "Sfântu Gheorghe", "Sibiu", "Slatina", "Suceava", "Târgoviște", "Târgu Jiu",
    "Târgu Mureș", "Timișoara", "Vaslui", "Zalău"
  ],
  Glovo: [
    "Alba Iulia", "Alexandria", "Arad", "Bacău", "Baia Mare", "Bârlad", "Bistrița",
    "Botoșani", "Brăila", "Brașov", "București", "Buftea", "Bușteni", "Buzău",
    "Câmpina", "Câmpulung", "Caracal", "Călărași", "Cluj-Napoca", "Constanța",
    "Craiova", "Dej", "Deva", "Drobeta-Turnu Severin", "Focșani", "Galați", "Giurgiu",
    "Hunedoara", "Huși", "Iași", "Mangalia", "Mediaș", "Miercurea-Ciuc", "Onești",
    "Oradea", "Pașcani", "Petroșani", "Piatra Neamț", "Pitești", "Ploiești", "Rădăuți",
    "Râmnicu Vâlcea", "Reșița", "Roman", "Satu Mare", "Sfântu Gheorghe", "Sibiu",
    "Sighișoara", "Sinaia", "Slatina", "Slobozia", "Suceava", "Târgoviște", "Târgu Jiu",
    "Târgu Mureș", "Timișoara", "Tulcea", "Turda", "Vaslui", "Zalău"
  ]
};

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
const countyData = window.CIBERO_COUNTIES || [];
const canonicalCityNames = new Map();
const platformsByCity = new Map();

Object.entries(platformCities).forEach(([platform, cities]) => {
  cities.forEach(name => {
    const key = cityLookupKey(name);
    canonicalCityNames.set(key, name);
    if (!platformsByCity.has(key)) platformsByCity.set(key, []);
    platformsByCity.get(key).push(platform);
  });
});

function titleCaseCity(value) {
  const lowerWords = new Set(["de", "din", "la", "lui", "pe", "si"]);
  return value.toLocaleLowerCase("ro-RO").split(/([\s-]+)/).map((part, index) => {
    if (/^[\s-]+$/.test(part)) return part;
    if (index > 0 && lowerWords.has(part)) return part;
    return part.charAt(0).toLocaleUpperCase("ro-RO") + part.slice(1);
  }).join("");
}

const allCities = sourceData.cities
  .map(([rawName, county, lng, lat, type]) => {
    const key = cityLookupKey(rawName);
    const canonicalName = canonicalCityNames.get(key);
    if (!canonicalName) return null;
    return {
      rawName,
      name: canonicalName || titleCaseCity(rawName),
      county,
      lng,
      lat,
      type,
      platforms: platformsByCity.get(key),
      active: activeByKey.has(key)
    };
  })
  .filter(Boolean);

const cityByKey = new Map(allCities.map(city => [normalizeCity(city.name), city]));
const cityModal = document.querySelector("#city-modal");
const cityInput = document.querySelector("#city-input");
const cityResult = document.querySelector("#city-result");
const cityOptions = document.querySelector("#city-options");
const mapSvg = document.querySelector("#romania-map");
const mapTooltip = document.querySelector("#map-tooltip");
const mapFrame = document.querySelector(".map-frame");
const mapActiveCount = document.querySelector("#map-active-count");
const mapTotalCount = document.querySelector("#map-total-count");
const svgNs = "http://www.w3.org/2000/svg";

if (mapActiveCount) mapActiveCount.textContent = allCities.filter(city => city.active).length;
if (mapTotalCount) mapTotalCount.textContent = allCities.length;

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

function flattenCoordinatePairs(value, output = []) {
  if (!Array.isArray(value)) return output;
  if (typeof value[0] === "number" && typeof value[1] === "number") {
    output.push(value);
    return output;
  }
  value.forEach(item => flattenCoordinatePairs(item, output));
  return output;
}

function geometryPath(county, project) {
  const polygons = county.type === "MultiPolygon" ? county.coordinates : [county.coordinates];
  return polygons.map(polygon => polygon.map(ring => ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + " Z").join(" ")).join(" ");
}

function allocateMarkerPositions(cities, project) {
  const placed = [];
  const candidates = [
    [0, 0], [0, -23], [22, 0], [-22, 0], [0, 23], [20, -20], [-20, -20],
    [20, 20], [-20, 20], [0, -46], [42, 0], [-42, 0], [0, 46], [38, -34],
    [-38, -34], [38, 34], [-38, 34], [60, 0], [-60, 0]
  ];

  return cities.map(city => {
    const [anchorX, anchorY] = project([city.lng, city.lat]);
    const position = candidates.find(([dx, dy]) => placed.every(item => (
      Math.abs(anchorX + dx - item.x) > 30 || Math.abs(anchorY + dy - item.y) > 19
    ))) || [0, 0];
    const [dx, dy] = position;
    placed.push({ x: anchorX + dx, y: anchorY + dy });
    return { city, anchorX, anchorY, dx, dy, x: anchorX + dx, y: anchorY + dy };
  });
}

function renderMap() {
  if (!mapSvg || !sourceData.boundary.length || !countyData.length) return;

  const width = 1000;
  const height = 620;
  const padX = 62;
  const padY = 55;
  const countyCoordinates = countyData.flatMap(county => flattenCoordinatePairs(county.coordinates));
  const allCoordinates = [...countyCoordinates, ...allCities.map(city => [city.lng, city.lat])];
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
  mapSvg.append(svgElement("path", { d: outlinePath, class: "country-base" }));

  const countyLayer = svgElement("g", { class: "county-layer" });
  countyData.forEach((county, index) => {
    const region = svgElement("path", {
      d: geometryPath(county, project),
      class: `county-shape county-tone-${index % 5}`,
      "data-county": county.code
    });
    region.append(svgElement("title"));
    region.querySelector("title").textContent = `Județul ${county.name}`;
    countyLayer.append(region);
  });
  mapSvg.append(countyLayer);
  mapSvg.append(svgElement("path", { d: outlinePath, class: "country-outline" }));

  const inactiveLayer = svgElement("g", { class: "city-layer city-layer-inactive" });
  const activeLayer = svgElement("g", { class: "city-layer city-layer-active" });

  allocateMarkerPositions(allCities.slice().sort((a, b) => Number(b.active) - Number(a.active)), project).forEach(position => {
    const { city, anchorX, anchorY, dx, dy, x, y } = position;
    const marker = svgElement("g", {
      class: `city-marker ${city.active ? "is-active" : "is-inactive"}`,
      transform: `translate(${anchorX.toFixed(2)} ${anchorY.toFixed(2)})`,
      "data-city": city.name,
      role: "button",
      tabindex: "0",
      "aria-label": `${city.county} — ${city.name}: ${city.active ? "flota este activă" : "flota nu operează momentan"}. Disponibil pe ${city.platforms.join(", ")}.`
    });

    if (dx || dy) marker.append(svgElement("line", { class: "marker-leader", x1: "0", y1: "0", x2: dx, y2: dy }));
    marker.append(svgElement("circle", { class: "marker-anchor", r: "2.6" }));
    const badge = svgElement("g", { class: "marker-badge", transform: `translate(${dx} ${dy})` });
    badge.append(svgElement("rect", { x: "-15", y: "-10", width: "30", height: "20", rx: "9" }));
    const label = svgElement("text", { class: "marker-code", x: "0", y: ".5", "text-anchor": "middle", "dominant-baseline": "middle" });
    label.textContent = city.county;
    badge.append(label);
    marker.append(badge);

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
  if (!mapTooltip || !mapSvg || !mapFrame) return;
  const svgRect = mapSvg.getBoundingClientRect();
  const frameRect = mapFrame.getBoundingClientRect();
  const platformLabels = city.platforms.map(platform => `<i>${platform}</i>`).join("");
  mapTooltip.innerHTML = `<strong>${city.county} — ${city.name}</strong><span>${city.active ? "✓ Flota este activă" : "× Flota nu operează momentan"}</span><small>Platforme disponibile</small><div>${platformLabels}</div>`;
  mapTooltip.className = `map-tooltip visible ${city.active ? "active" : "inactive"}${sticky ? " sticky" : ""}`;
  mapTooltip.style.left = `${svgRect.left - frameRect.left + (x / 1000) * svgRect.width}px`;
  mapTooltip.style.top = `${svgRect.top - frameRect.top + (y / 620) * svgRect.height}px`;
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
    cityResult.innerHTML = `<strong>„${submitted}” nu apare în lista actuală a orașelor de livrare.</strong><br>Harta include doar orașele publicate de Bolt Food, Wolt sau Glovo.`;
    return;
  }

  cityResult.className = `city-result ${city.active ? "yes" : "no"}`;
  cityResult.innerHTML = city.active
    ? `<strong>✓ Da, flota este activă în ${city.name}.</strong><br>Poți continua către onboarding pentru a alege platforma potrivită.<br><a href="deschide-cont.html">Deschide onboarding-ul →</a>`
    : `<strong>Flota nu operează momentan în ${city.name}.</strong><br>Cel puțin una dintre platformele ${city.platforms.join(", ")} este disponibilă aici; statutul CibeRO va fi actualizat când orașul intră în acoperirea flotei.`;
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
