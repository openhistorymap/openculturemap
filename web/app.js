const CATEGORY_LABELS = {
  museum: "Museums",
  gallery: "Galleries",
  artwork: "Public art",
  arts_centre: "Arts centres",
  theatre: "Theatres",
  archaeological_site: "Archaeological sites",
  castle: "Castles",
  monument: "Monuments",
  memorial: "Memorials",
  ruins: "Ruins",
  fort: "Forts",
  city_gate: "City gates",
  tower: "Towers",
  manor: "Manors",
  church: "Historic churches",
  heritage: "Heritage-listed",
  historic: "Other historic",
  other: "Other cultural",
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

const GLYPH_PATHS = {
  museum:
    "M2 10 L12 3 L22 10 L22 12 L2 12 Z " +
    "M4 13 H6 V20 H4 Z M9 13 H11 V20 H9 Z M13 13 H15 V20 H13 Z M18 13 H20 V20 H18 Z " +
    "M2 21 H22 V22.5 H2 Z",
  gallery:
    "M3 5 H21 V19 H3 Z M5 7 H19 V17 H5 Z " +
    "M7 16 L11 10 L13 13 L15 11 L17 16 Z",
  artwork:
    "M14 3 L21 10 L13 18 L6 11 Z",
  arts_centre:
    "M12 3 L14.4 9.6 L21 10 L15.6 14 L17.5 21 L12 17 L6.5 21 L8.4 14 L3 10 L9.6 9.6 Z",
  theatre:
    "M12 3.5 C 17.5 3.5 18.7 10.5 16.2 18 C 14.2 22 9.8 22 7.8 18 C 5.3 10.5 6.5 3.5 12 3.5 Z " +
    "M9.4 10.5 C 9.4 9.7 10.3 9.7 10.3 10.5 V 11.5 C 10.3 12.3 9.4 12.3 9.4 11.5 Z " +
    "M13.7 10.5 C 13.7 9.7 14.6 9.7 14.6 10.5 V 11.5 C 14.6 12.3 13.7 12.3 13.7 11.5 Z " +
    "M10 15.5 C 10.7 16.5 13.3 16.5 14 15.5 Z",
  archaeological_site:
    "M6 4 H18 V6.5 H17 V19 H18 V21 H6 V19 H7 V6.5 H6 Z " +
    "M9 6.5 V19 H10 V6.5 Z M14 6.5 V19 H15 V6.5 Z",
  castle:
    "M3 11 V22 H21 V11 H19 V8 H17 V11 H15 V8 H13 V11 H11 V8 H9 V11 H7 V8 H5 V11 Z " +
    "M10 22 V17 C 10 15.5 14 15.5 14 17 V22 Z",
  monument:
    "M12 2 L14 6.5 L13.5 21 L10.5 21 L10 6.5 Z",
  memorial:
    "M8 4 H16 V7 L18 9 V15 L16 17 V22 H8 V17 L6 15 V9 L8 7 Z",
  ruins:
    "M5 22 V14 H8 V16 H10 V13 H13 V18 H15 V14 H18 V22 Z " +
    "M6 10 L8 9 L9 12 L11 10 L12 13 L14 11 L15 14 L17 12 L18 13 L17.5 14 L15.5 13.5 L14.5 16 L12.5 14 L11.5 16.5 L9.5 14.5 L8.5 17 L6.5 14.5 Z",
  fort:
    "M3 12 V22 H21 V12 H19 V9 H17 V12 H15 V9 H13 V12 H11 V9 H9 V12 H7 V9 H5 V12 Z " +
    "M11 22 V17 H13 V22 Z",
  city_gate:
    "M4 22 V9 C 4 5 8 4 12 4 C 16 4 20 5 20 9 V22 H15 V13 C 15 11 14 10 12 10 C 10 10 9 11 9 13 V22 Z",
  tower:
    "M9 3 L12 1 L15 3 V6 H14 V22 H10 V6 H9 Z M11 9 H13 V12 H11 Z M11 15 H13 V18 H11 Z",
  manor:
    "M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3 Z M16 8 V5 H18 V9.5 Z",
  church:
    "M11 3 H13 V7 H17 V9 H13 V13 H17 V22 H7 V13 H11 V9 H7 V7 H11 Z",
  heritage:
    "M4 4 H20 V11 C 20 17 16 20 12 22 C 8 20 4 17 4 11 Z M6 6 V11 C 6 16 9 18.5 12 19.8 C 15 18.5 18 16 18 11 V6 Z",
  historic:
    "M4 6 C 4 5 5 4 6 4 H18 C 19 4 20 5 20 6 V18 C 20 19 19 20 18 20 H6 C 5 20 4 19 4 18 Z " +
    "M7 7 V17 H17 V7 Z M9 9 H15 V10 H9 Z M9 11.5 H15 V12.5 H9 Z M9 14 H13 V15 H9 Z",
  other:
    "M12 6 L13.6 10.4 L18 12 L13.6 13.6 L12 18 L10.4 13.6 L6 12 L10.4 10.4 Z",
};

const CATEGORY_COLORS_LIGHT = {
  museum: "#2f5fb6",
  gallery: "#7a3a8d",
  artwork: "#d49832",
  arts_centre: "#b04a31",
  theatre: "#a73a3a",
  archaeological_site: "#a8702c",
  castle: "#8a3a2e",
  monument: "#566273",
  memorial: "#566273",
  ruins: "#a16e3c",
  fort: "#8a3a2e",
  city_gate: "#8a3a2e",
  tower: "#9b4d35",
  manor: "#947a4a",
  church: "#3f7c52",
  heritage: "#3f7c52",
  historic: "#6e6757",
  other: "#7a7568",
};

const CATEGORY_COLORS_DARK = {
  museum: "#7ea3e6",
  gallery: "#b988c8",
  artwork: "#f0c569",
  arts_centre: "#e88f74",
  theatre: "#e08a8a",
  archaeological_site: "#dba767",
  castle: "#d68573",
  monument: "#a3afc1",
  memorial: "#a3afc1",
  ruins: "#dba67e",
  fort: "#d68573",
  city_gate: "#d68573",
  tower: "#d99176",
  manor: "#cdb98a",
  church: "#8ec79e",
  heritage: "#8ec79e",
  historic: "#b8aeA0",
  other: "#bcb6a6",
};

const MAP_STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

const SOURCE_ID = "ocm-pois";

const state = {
  manifest: null,
  current: null,
  features: [],
  enabled: new Set(CATEGORY_ORDER),
  theme: document.documentElement.getAttribute("data-theme") || "light",
};

const map = new maplibregl.Map({
  container: "map",
  style: MAP_STYLES[state.theme],
  center: [12, 50],
  zoom: 3.6,
  maxZoom: 18,
  attributionControl: { compact: true },
});
map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");

const colorExpr = (palette) => {
  const expr = ["match", ["get", "category"]];
  for (const k of CATEGORY_ORDER) expr.push(k, palette[k]);
  expr.push(palette.other);
  return expr;
};

const iconImageExpr = ["concat", "cat-", ["get", "category"]];

function currentPalette() {
  return state.theme === "dark" ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;
}

async function buildImages() {
  const palette = currentPalette();
  const haloColor = state.theme === "dark" ? "#1a1612" : "#fbf7ef";
  await Promise.all(
    Object.entries(GLYPH_PATHS).map(([name, d]) => {
      const color = palette[name] || palette.other;
      return addGlyphImage(name, d, color, haloColor);
    }),
  );
}

function addGlyphImage(name, d, fill, halo) {
  return new Promise((resolve) => {
    const id = `cat-${name}`;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 30 30" width="96" height="96">` +
      `<path d="${d}" fill="${halo}" fill-rule="evenodd" stroke="${halo}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>` +
      `</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image(96, 96);
    img.onload = () => {
      if (map.hasImage(id)) map.removeImage(id);
      map.addImage(id, img);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });
}

function addCustomLayers() {
  if (!map.getSource(SOURCE_ID)) {
    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: featureCollection(filteredFeatures()),
      cluster: true,
      clusterRadius: 50,
      clusterMaxZoom: 12,
    });
  } else {
    map.getSource(SOURCE_ID).setData(featureCollection(filteredFeatures()));
  }

  const palette = currentPalette();
  const clusterFill = readVarColor("--map-cluster-fill");
  const clusterStroke = readVarColor("--map-cluster-stroke");
  const clusterText = readVarColor("--map-cluster-text");
  const dotStroke = state.theme === "dark" ? "rgba(20,16,12,0.7)" : "rgba(255,250,240,0.85)";

  if (!map.getLayer("ocm-points-dot")) {
    map.addLayer({
      id: "ocm-points-dot",
      type: "circle",
      source: SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": colorExpr(palette),
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          3, 2.2, 6, 3, 10, 3.8, 14, 5, 18, 7,
        ],
        "circle-stroke-color": dotStroke,
        "circle-stroke-width": 1,
        "circle-opacity": 0.95,
      },
    });
  } else {
    map.setPaintProperty("ocm-points-dot", "circle-color", colorExpr(palette));
    map.setPaintProperty("ocm-points-dot", "circle-stroke-color", dotStroke);
  }

  if (!map.getLayer("ocm-points")) {
    map.addLayer({
      id: "ocm-points",
      type: "symbol",
      source: SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": iconImageExpr,
        "icon-size": [
          "interpolate", ["linear"], ["zoom"],
          5, 0.18, 9, 0.26, 12, 0.34, 15, 0.45, 18, 0.60,
        ],
        "icon-allow-overlap": ["step", ["zoom"], false, 15, true],
        "icon-ignore-placement": false,
        "icon-padding": 0,
      },
    });
  }

  if (!map.getLayer("ocm-clusters")) {
    map.addLayer({
      id: "ocm-clusters",
      type: "circle",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": clusterFill,
        "circle-stroke-color": clusterStroke,
        "circle-stroke-width": 1.4,
        "circle-radius": [
          "step", ["get", "point_count"],
          15, 25, 19, 100, 23, 500, 28, 2000, 34,
        ],
      },
    });
  } else {
    map.setPaintProperty("ocm-clusters", "circle-color", clusterFill);
    map.setPaintProperty("ocm-clusters", "circle-stroke-color", clusterStroke);
  }

  if (!map.getLayer("ocm-cluster-count")) {
    map.addLayer({
      id: "ocm-cluster-count",
      type: "symbol",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 12.5,
        "text-allow-overlap": true,
      },
      paint: { "text-color": clusterText },
    });
  } else {
    map.setPaintProperty("ocm-cluster-count", "text-color", clusterText);
  }

  wireMapEvents();
}

function readVarColor(varName) {
  const probe = document.createElement("span");
  probe.style.color = `var(${varName})`;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).color || "rgb(196,106,60)";
  probe.remove();
  return c;
}

let mapEventsWired = false;
function wireMapEvents() {
  if (mapEventsWired) return;
  mapEventsWired = true;

  map.on("click", "ocm-clusters", (e) => {
    const f = e.features[0];
    map.getSource(SOURCE_ID).getClusterExpansionZoom(f.properties.cluster_id, (err, zoom) => {
      if (err) return;
      map.easeTo({ center: f.geometry.coordinates, zoom, duration: 500 });
    });
  });

  map.on("click", (e) => {
    const hits = map.queryRenderedFeatures(e.point, { layers: ["ocm-points", "ocm-points-dot"] });
    if (hits.length) openDetail(hits[0]);
  });

  for (const id of ["ocm-points", "ocm-points-dot", "ocm-clusters"]) {
    map.on("mouseenter", id, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", id, () => (map.getCanvas().style.cursor = ""));
  }
}

function featureCollection(features) {
  return { type: "FeatureCollection", features };
}

function filteredFeatures() {
  return state.features.filter((f) => state.enabled.has(normalizeCat(f.properties.category)));
}

function normalizeCat(c) {
  return CATEGORY_ORDER.includes(c) ? c : "other";
}

map.on("load", async () => {
  await buildImages();
  addCustomLayers();
  await bootstrap();
});

// ── Theme toggle ──────────────────────────────────────────────

const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => setTheme(state.theme === "light" ? "dark" : "light"));

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("ocm-theme", theme); } catch (e) {}

  const cam = { center: map.getCenter(), zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() };
  mapEventsWired = false;
  map.setStyle(MAP_STYLES[theme]);
  map.once("style.load", async () => {
    await buildImages();
    map.jumpTo(cam);
    addCustomLayers();
  });
}

// ── Data loading ──────────────────────────────────────────────

async function bootstrap() {
  try {
    const r = await fetch("data/manifest.json", { cache: "no-cache" });
    state.manifest = await r.json();
  } catch (e) {
    state.manifest = { countries: [], generated_at: null };
  }
  renderMeta();
  renderCountries();
  const initial = pickInitialCountry();
  if (initial) await loadCountry(initial);
  else renderCategories();
}

function pickInitialCountry() {
  const list = state.manifest?.countries || [];
  if (!list.length) return null;
  const fromHash = (location.hash || "").replace("#", "").toUpperCase();
  if (fromHash && list.find((c) => c.code === fromHash)) return fromHash;
  const withData = list.filter((c) => (c.count || 0) > 0);
  if (withData.length) {
    const it = withData.find((c) => c.code === "IT");
    return (it || withData[0]).code;
  }
  return list[0].code;
}

function renderMeta() {
  const el = document.getElementById("meta-updated");
  const m = state.manifest;
  if (!m || !m.generated_at) {
    el.textContent = "the atlas is being typeset…";
    return;
  }
  const d = new Date(m.generated_at);
  const fmt = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  el.innerHTML = `last gathered <strong style="font-style:normal;color:var(--ink-soft)">${fmt}</strong> · ${m.countries.length} countries`;
}

function renderCountries() {
  const sel = document.getElementById("country-select");
  const list = state.manifest?.countries || [];
  sel.innerHTML = "";
  if (!list.length) {
    sel.innerHTML = `<option>(awaiting first gathering)</option>`;
    sel.disabled = true;
    return;
  }
  for (const c of list) {
    const opt = document.createElement("option");
    opt.value = c.code;
    const count = c.count ? c.count.toLocaleString() : "—";
    const stale = c.stale ? " *" : "";
    opt.textContent = `${c.name} — ${count}${stale}`;
    sel.appendChild(opt);
  }
  sel.disabled = false;
  sel.onchange = (e) => loadCountry(e.target.value);
}

async function loadCountry(code) {
  const entry = (state.manifest?.countries || []).find((c) => c.code === code);
  if (!entry) return;
  state.current = entry;
  document.getElementById("country-select").value = code;
  const stat = document.getElementById("country-stat");
  if (entry.count) {
    stat.innerHTML = `<strong style="font-style:normal;color:var(--ink-soft)">${entry.count.toLocaleString()}</strong> cultural points${entry.stale ? " · (cached — last gathering failed)" : ""}`;
  } else {
    stat.textContent = "no data gathered yet";
  }
  history.replaceState(null, "", `#${code}`);

  if (!entry.file || !entry.count) {
    state.features = [];
    applyFilter();
    renderCategories();
    return;
  }

  try {
    const r = await fetch(`data/${entry.file}`, { cache: "no-cache" });
    const fc = await r.json();
    state.features = fc.features || [];
  } catch (e) {
    state.features = [];
  }
  renderCategories();
  applyFilter();
  fitToCountry();
}

function fitToCountry() {
  if (!state.features.length) return;
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  for (const f of state.features) {
    const [lon, lat] = f.geometry.coordinates;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  if (!isFinite(minLon)) return;
  map.fitBounds(
    [[minLon, minLat], [maxLon, maxLat]],
    { padding: { top: 60, bottom: 60, left: 60, right: 60 }, duration: 750, maxZoom: 9 },
  );
}

function renderCategories() {
  const container = document.getElementById("cat-list");
  container.innerHTML = "";
  const counts = {};
  for (const k of CATEGORY_ORDER) counts[k] = 0;
  for (const f of state.features) {
    counts[normalizeCat(f.properties.category)]++;
  }
  const palette = state.theme === "dark" ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;

  for (const k of CATEGORY_ORDER) {
    if (!counts[k]) continue;
    const row = document.createElement("div");
    row.className = "cat-row" + (state.enabled.has(k) ? "" : " off");
    row.dataset.cat = k;
    row.innerHTML = `
      <span class="cat-glyph" style="color:${palette[k]}">${inlineGlyph(k)}</span>
      <span class="cat-label">${CATEGORY_LABELS[k] || k}</span>
      <span class="cat-count">${counts[k].toLocaleString()}</span>
    `;
    row.addEventListener("click", () => {
      if (state.enabled.has(k)) state.enabled.delete(k);
      else state.enabled.add(k);
      row.classList.toggle("off");
      applyFilter();
    });
    container.appendChild(row);
  }

  document.getElementById("cat-all").onclick = () => {
    state.enabled = new Set(CATEGORY_ORDER);
    renderCategories();
    applyFilter();
  };
  document.getElementById("cat-none").onclick = () => {
    state.enabled = new Set();
    renderCategories();
    applyFilter();
  };
}

function inlineGlyph(k) {
  const d = GLYPH_PATHS[k] || GLYPH_PATHS.other;
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="currentColor" fill-rule="evenodd"/></svg>`;
}

function applyFilter() {
  const src = map.getSource(SOURCE_ID);
  if (!src) return;
  src.setData(featureCollection(filteredFeatures()));
}

// ── Detail panel ──────────────────────────────────────────────

function openDetail(feature) {
  const detail = document.getElementById("detail");
  const body = document.getElementById("detail-body");
  const p = feature.properties || {};
  const tags = parseTags(p.tags);
  const category = normalizeCat(p.category);
  const catLabel = CATEGORY_LABELS[category] || category;

  const addr = formatAddress(tags);
  const links = buildLinks(p, tags);

  body.innerHTML = `
    <span class="detail-cat">
      <span class="cat-glyph">${inlineGlyph(category)}</span>
      ${escapeHtml(catLabel.toLowerCase())}
    </span>
    <h2 class="detail-title">${escapeHtml(p.name || "(unnamed place)")}</h2>
    <div class="detail-sub">${escapeHtml(addr || tags["addr:city"] || "")}</div>
    <div id="wd-slot"></div>
    <div class="detail-section">
      <h4>From OpenStreetMap</h4>
      <dl class="tag-grid">${renderTagRows(tags)}</dl>
    </div>
    ${links.length ? `<div class="detail-section"><h4>Elsewhere</h4><div class="detail-links">${links.join("")}</div></div>` : ""}
  `;
  detail.classList.add("open");
  detail.setAttribute("aria-hidden", "false");

  if (p.wikidata) {
    const slot = document.getElementById("wd-slot");
    slot.innerHTML = `
      <div class="detail-section">
        <h4>From Wikidata · ${escapeHtml(p.wikidata)}</h4>
        <div class="skeleton lg"></div>
        <div class="skeleton"></div>
        <div class="skeleton" style="width:60%"></div>
      </div>
    `;
    fetchWikidata(p.wikidata).then((data) => {
      if (!data) {
        slot.innerHTML = "";
        return;
      }
      slot.innerHTML = `
        <div class="detail-section">
          <h4>From Wikidata · <a href="https://www.wikidata.org/wiki/${encodeURIComponent(p.wikidata)}" target="_blank" rel="noopener">${escapeHtml(p.wikidata)}</a></h4>
          ${data.image ? `<img class="detail-image" src="${escapeAttr(data.image)}" alt="${escapeAttr(data.label || "")}" loading="lazy" />` : ""}
          ${data.label ? `<p style="font-family:var(--font-display);font-size:20px;line-height:1.25;color:var(--ink);margin-bottom:8px;">${escapeHtml(data.label)}</p>` : ""}
          ${data.desc ? `<p style="color:var(--ink-soft);">${escapeHtml(data.desc)}</p>` : ""}
          ${data.inception ? `<p style="color:var(--ink-mute);font-style:italic;font-size:13px;">established ${escapeHtml(prettyDate(data.inception))}</p>` : ""}
          ${data.wikipediaUrl ? `<p style="margin-top:8px;"><a href="${escapeAttr(data.wikipediaUrl)}" target="_blank" rel="noopener">Read more on Wikipedia →</a></p>` : ""}
        </div>
      `;
    });
  }
}

function parseTags(v) {
  if (!v) return {};
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return {}; }
  }
  return v;
}

function formatAddress(tags) {
  const parts = [
    [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" "),
    tags["addr:city"],
    tags["addr:country"],
  ].filter(Boolean);
  return parts.join(", ");
}

function buildLinks(props, tags) {
  const out = [];
  if (props.osm_type && props.osm_id) {
    out.push(`<a href="https://www.openstreetmap.org/${props.osm_type}/${props.osm_id}" target="_blank" rel="noopener">OpenStreetMap</a>`);
  }
  if (tags.website || tags.url) {
    out.push(`<a href="${escapeAttr(tags.website || tags.url)}" target="_blank" rel="noopener">Official site</a>`);
  }
  if (tags.wikipedia) {
    const idx = tags.wikipedia.indexOf(":");
    if (idx > 0) {
      const lang = tags.wikipedia.slice(0, idx);
      const title = tags.wikipedia.slice(idx + 1);
      out.push(`<a href="https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}" target="_blank" rel="noopener">Wikipedia</a>`);
    }
  }
  return out;
}

const TAG_DISPLAY = {
  tourism: "kind",
  amenity: "kind",
  historic: "historic",
  heritage: "heritage",
  start_date: "dating from",
  opening_hours: "open",
  operator: "operated by",
  denomination: "denomination",
  religion: "religion",
  artist_name: "artist",
  artwork_type: "artwork type",
  material: "material",
  phone: "phone",
  email: "email",
  wheelchair: "step-free",
};

function renderTagRows(tags) {
  const rows = [];
  for (const [key, label] of Object.entries(TAG_DISPLAY)) {
    if (tags[key] != null) {
      rows.push(`<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(tags[key]))}</dd>`);
    }
  }
  if (!rows.length) return `<dt>—</dt><dd>no extra tags recorded</dd>`;
  return rows.join("");
}

const wikidataCache = new Map();

async function fetchWikidata(qid) {
  if (!/^Q\d+$/.test(qid)) return null;
  if (wikidataCache.has(qid)) return wikidataCache.get(qid);
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(qid)}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&format=json&origin=*`;
  try {
    const r = await fetch(url);
    const j = await r.json();
    const ent = j.entities?.[qid];
    if (!ent) { wikidataCache.set(qid, null); return null; }
    const label = ent.labels?.en?.value;
    const desc = ent.descriptions?.en?.value;
    const imageFile = ent.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    const inceptionRaw = ent.claims?.P571?.[0]?.mainsnak?.datavalue?.value?.time;
    const inception = inceptionRaw ? inceptionRaw.replace(/^\+/, "").slice(0, 10) : null;
    const wikipediaUrl = ent.sitelinks?.enwiki?.url || null;
    const image = imageFile
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFile)}?width=720`
      : null;
    const out = { label, desc, image, inception, wikipediaUrl };
    wikidataCache.set(qid, out);
    return out;
  } catch (e) {
    wikidataCache.set(qid, null);
    return null;
  }
}

function prettyDate(s) {
  const m = s.match(/^(-?\d{1,4})/);
  if (!m) return s;
  const year = parseInt(m[1], 10);
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (s.length >= 10 && s[5] !== "0") return s;
  return String(year);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}
function escapeAttr(s) { return escapeHtml(s); }

document.getElementById("detail-close").addEventListener("click", () => {
  const d = document.getElementById("detail");
  d.classList.remove("open");
  d.setAttribute("aria-hidden", "true");
});
