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

const activeCities = [
  ["Alba Iulia", "AI"], ["Arad", "AR"], ["Bacău", "BC"], ["Baia Mare", "BM"],
  ["Botoșani", "BT"], ["Brăila", "BR"], ["Brașov", "BV"], ["București", "B"],
  ["Buzău", "BZ"], ["Cluj-Napoca", "CJ"], ["Constanța", "CT"], ["Craiova", "CV"],
  ["Deva", "DV"], ["Drobeta-Turnu Severin", "DT"], ["Focșani", "FC"], ["Galați", "GL"],
  ["Hunedoara", "HD"], ["Iași", "IS"], ["Mediaș", "MD"], ["Miercurea-Ciuc", "MC"],
  ["Onești", "ON"], ["Oradea", "OR"], ["Piatra Neamț", "PN"], ["Pitești", "PT"],
  ["Ploiești", "PL"], ["Râmnicu Vâlcea", "RV"], ["Reșița", "RS"], ["Roman", "RM"],
  ["Satu Mare", "SM"], ["Sfântu Gheorghe", "SG"], ["Sibiu", "SB"], ["Sighișoara", "SH"],
  ["Slatina", "SL"], ["Suceava", "SV"], ["Târgoviște", "TG"], ["Târgu Mureș", "MS"],
  ["Tecuci", "TC"], ["Timișoara", "TM"], ["Tulcea", "TL"], ["Vaslui", "VS"], ["Zalău", "ZL"]
];

const normalizeCity = value => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]/g, "")
  .replace(/^municipiul/, "");

const activeCityByKey = new Map(activeCities.map(([name, code]) => [normalizeCity(name), { name, code }]));
const mapData = window.CIBERO_MAP_DATA || { boundary: [], cities: [] };
const counties = window.CIBERO_COUNTIES || [];
const mapSvg = document.querySelector("#romania-map");
const mapFrame = document.querySelector(".map-frame");
const mapTooltip = document.querySelector("#map-tooltip");
const mapActiveCount = document.querySelector("#map-active-count");
const citySearchInput = document.querySelector("#city-search-input");
const citySearchClear = document.querySelector("#city-search-clear");
const citySearchStatus = document.querySelector("#city-search-status");
const svgNs = "http://www.w3.org/2000/svg";

const citiesForMap = mapData.cities
  .map(([rawName, county, lng, lat]) => {
    const active = activeCityByKey.get(normalizeCity(rawName));
    return active ? { ...active, county, lng, lat } : null;
  })
  .filter(Boolean);

if (mapActiveCount) mapActiveCount.textContent = String(citiesForMap.length);

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
    [0, 0], [0, -27], [28, 0], [-28, 0], [0, 27], [25, -24], [-25, -24],
    [25, 24], [-25, 24], [0, -54], [52, 0], [-52, 0], [0, 54], [48, -42],
    [-48, -42], [48, 42], [-48, 42], [75, 0], [-75, 0]
  ];

  return cities.map(city => {
    const [anchorX, anchorY] = project([city.lng, city.lat]);
    const [dx, dy] = candidates.find(([candidateX, candidateY]) => placed.every(item => (
      Math.abs(anchorX + candidateX - item.x) > 52 || Math.abs(anchorY + candidateY - item.y) > 31
    ))) || [0, 0];
    const marker = { city, anchorX, anchorY, dx, dy, x: anchorX + dx, y: anchorY + dy };
    placed.push({ x: marker.x, y: marker.y });
    return marker;
  });
}

function showMapTooltip(city, x, y) {
  if (!mapTooltip || !mapSvg || !mapFrame) return;
  const svgRect = mapSvg.getBoundingClientRect();
  const frameRect = mapFrame.getBoundingClientRect();
  mapTooltip.innerHTML = `<strong>${city.code} · ${city.name}</strong><span>✓ Flota CibeRO este activă</span>`;
  mapTooltip.classList.add("visible");
  mapTooltip.style.left = `${svgRect.left - frameRect.left + (x / 1000) * svgRect.width}px`;
  mapTooltip.style.top = `${svgRect.top - frameRect.top + (y / 620) * svgRect.height}px`;
}

function renderActiveCitiesMap() {
  if (!mapSvg || !mapData.boundary.length || !counties.length) return;

  const width = 1000;
  const height = 620;
  const padX = 62;
  const padY = 55;
  const coordinates = counties.flatMap(county => flattenCoordinatePairs(county.coordinates));
  const longitudes = coordinates.map(point => point[0]);
  const latitudes = coordinates.map(point => point[1]);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const project = ([lng, lat]) => [
    padX + ((lng - minLng) / (maxLng - minLng)) * (width - padX * 2),
    padY + ((maxLat - lat) / (maxLat - minLat)) * (height - padY * 2)
  ];

  const defs = svgElement("defs");
  defs.innerHTML = `<filter id="map-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#050208" flood-opacity=".72" /></filter>`;
  mapSvg.append(defs);

  const outlinePath = mapData.boundary.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + " Z";

  mapSvg.append(svgElement("path", { d: outlinePath, class: "country-shadow", filter: "url(#map-shadow)" }));
  mapSvg.append(svgElement("path", { d: outlinePath, class: "country-base" }));

  const countyLayer = svgElement("g", { class: "county-layer" });
  counties.forEach((county, index) => {
    const region = svgElement("path", { d: geometryPath(county, project), class: `county-shape county-tone-${index % 5}` });
    const title = svgElement("title");
    title.textContent = `Județul ${county.name}`;
    region.append(title);
    countyLayer.append(region);
  });
  mapSvg.append(countyLayer);
  mapSvg.append(svgElement("path", { d: outlinePath, class: "country-outline" }));

  const markerLayer = svgElement("g", { class: "city-layer" });
  allocateMarkerPositions(citiesForMap, project).forEach(({ city, anchorX, anchorY, dx, dy, x, y }) => {
    const marker = svgElement("g", {
      class: "city-marker",
      transform: `translate(${anchorX.toFixed(2)} ${anchorY.toFixed(2)})`,
      "data-city-key": normalizeCity(city.name),
      tabindex: "0",
      role: "img",
      "aria-label": `${city.code}, ${city.name}: flota CibeRO este activă`
    });

    const badge = svgElement("g", { class: "marker-badge", transform: `translate(${dx} ${dy})` });
    badge.append(svgElement("rect", { x: "-27", y: "-15", width: "54", height: "30", rx: "11" }));
    badge.append(svgElement("circle", { class: "marker-status", cx: "-14", cy: "0", r: "7" }));
    const check = svgElement("text", { class: "marker-check", x: "-14", y: ".5", "text-anchor": "middle", "dominant-baseline": "middle" });
    check.textContent = "✓";
    badge.append(check);
    const code = svgElement("text", { class: "marker-code", x: "7", y: ".5", "text-anchor": "middle", "dominant-baseline": "middle" });
    code.textContent = city.code;
    badge.append(code);
    marker.append(badge);

    marker.addEventListener("mouseenter", () => showMapTooltip(city, x, y));
    marker.addEventListener("focus", () => showMapTooltip(city, x, y));
    marker.addEventListener("click", () => showMapTooltip(city, x, y));
    markerLayer.append(marker);
  });
  mapSvg.append(markerLayer);
}

renderActiveCitiesMap();

mapSvg?.addEventListener("mouseleave", () => mapTooltip?.classList.remove("visible"));

function filterCitiesOnMap() {
  const query = normalizeCity(citySearchInput?.value.trim() || "");
  let visibleCount = 0;
  let soleMatch = null;

  document.querySelectorAll(".city-marker").forEach(marker => {
    const matches = !query || marker.dataset.cityKey.includes(query);
    marker.style.display = matches ? "" : "none";
    marker.classList.toggle("is-filtered-match", Boolean(query && matches));
    if (matches) {
      visibleCount += 1;
      soleMatch = marker;
    }
  });

  if (citySearchClear) citySearchClear.hidden = !query;
  if (citySearchStatus) {
    citySearchStatus.textContent = query
      ? `${visibleCount} ${visibleCount === 1 ? "oraș găsit" : "orașe găsite"}`
      : `${citiesForMap.length} de orașe afișate`;
  }
  mapTooltip?.classList.remove("visible");

  if (!query) {
    mapFrame?.scrollTo({ left: 0, behavior: "smooth" });
  } else if (visibleCount === 1 && soleMatch && mapFrame) {
    requestAnimationFrame(() => {
      const markerRect = soleMatch.getBoundingClientRect();
      const frameRect = mapFrame.getBoundingClientRect();
      const markerCenterInFrame = mapFrame.scrollLeft + markerRect.left - frameRect.left + markerRect.width / 2;
      mapFrame.scrollTo({ left: Math.max(0, markerCenterInFrame - frameRect.width / 2), behavior: "smooth" });
    });
  }
}

citySearchInput?.addEventListener("input", filterCitiesOnMap);
citySearchInput?.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    citySearchInput.value = "";
    filterCitiesOnMap();
  }
});

citySearchClear?.addEventListener("click", () => {
  citySearchInput.value = "";
  filterCitiesOnMap();
  citySearchInput.focus();
});
