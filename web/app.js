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

const CATEGORY_COLORS = {
  museum: "#4f8df0",
  gallery: "#a779f3",
  artwork: "#f0b440",
  arts_centre: "#ec5fa5",
  theatre: "#e25555",
  archaeological_site: "#b87333",
  castle: "#b14b3e",
  monument: "#8593a8",
  memorial: "#8593a8",
  ruins: "#a87547",
  fort: "#b14b3e",
  city_gate: "#b14b3e",
  tower: "#b14b3e",
  manor: "#b87333",
  church: "#6fa97a",
  heritage: "#5dbf86",
  historic: "#8e96a5",
  other: "#6e7686",
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

const state = {
  manifest: null,
  current: null,
  features: [],
  enabled: new Set(CATEGORY_ORDER),
};

const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/positron",
  center: [12, 50],
  zoom: 3.6,
  maxZoom: 18,
  attributionControl: { compact: true },
});
map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");

const SOURCE_ID = "ocm-pois";

map.on("load", async () => {
  const colorExpr = ["match", ["get", "category"]];
  for (const k of CATEGORY_ORDER) {
    colorExpr.push(k, CATEGORY_COLORS[k]);
  }
  colorExpr.push(CATEGORY_COLORS.other);

  map.addSource(SOURCE_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
    cluster: true,
    clusterRadius: 45,
    clusterMaxZoom: 12,
  });

  map.addLayer({
    id: "ocm-clusters",
    type: "circle",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#d4a35a",
      "circle-opacity": 0.85,
      "circle-stroke-color": "#1b1409",
      "circle-stroke-width": 1.2,
      "circle-radius": [
        "step", ["get", "point_count"],
        14, 25, 18, 100, 22, 500, 28, 2000, 34,
      ],
    },
  });

  map.addLayer({
    id: "ocm-cluster-count",
    type: "symbol",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Noto Sans Regular"],
      "text-size": 12,
    },
    paint: {
      "text-color": "#1b1409",
    },
  });

  map.addLayer({
    id: "ocm-points",
    type: "circle",
    source: SOURCE_ID,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": colorExpr,
      "circle-radius": [
        "interpolate", ["linear"], ["zoom"],
        4, 3,
        8, 4.5,
        12, 6,
        16, 8,
      ],
      "circle-stroke-color": "#0f1115",
      "circle-stroke-width": 1,
      "circle-opacity": 0.95,
    },
  });

  map.on("click", "ocm-clusters", (e) => {
    const f = e.features[0];
    const clusterId = f.properties.cluster_id;
    map.getSource(SOURCE_ID).getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      map.easeTo({ center: f.geometry.coordinates, zoom });
    });
  });

  map.on("click", "ocm-points", (e) => {
    const f = e.features[0];
    openDetail(f);
  });

  for (const id of ["ocm-points", "ocm-clusters"]) {
    map.on("mouseenter", id, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", id, () => (map.getCanvas().style.cursor = ""));
  }

  await bootstrap();
});

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
    el.textContent = "data not yet harvested";
    return;
  }
  const d = new Date(m.generated_at);
  el.textContent = `updated ${d.toISOString().slice(0, 10)} · ${m.countries.length} countries`;
}

function renderCountries() {
  const sel = document.getElementById("country-select");
  const list = state.manifest?.countries || [];
  sel.innerHTML = "";
  if (!list.length) {
    sel.innerHTML = `<option>(awaiting first harvest)</option>`;
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
  sel.addEventListener("change", (e) => loadCountry(e.target.value));
}

async function loadCountry(code) {
  const entry = (state.manifest?.countries || []).find((c) => c.code === code);
  if (!entry) return;
  state.current = entry;
  document.getElementById("country-select").value = code;
  document.getElementById("country-stat").textContent = entry.count
    ? `${entry.count.toLocaleString()} cultural POIs${entry.stale ? " · cached (last harvest failed)" : ""}`
    : "no data yet";
  history.replaceState(null, "", `#${code}`);

  if (!entry.file || !entry.count) {
    state.features = [];
    applyFilter();
    fitToCountry();
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
    { padding: 60, duration: 700, maxZoom: 9 },
  );
}

function renderCategories() {
  const container = document.getElementById("cat-list");
  container.innerHTML = "";
  const counts = {};
  for (const k of CATEGORY_ORDER) counts[k] = 0;
  for (const f of state.features) {
    const k = CATEGORY_ORDER.includes(f.properties.category) ? f.properties.category : "other";
    counts[k]++;
  }
  for (const k of CATEGORY_ORDER) {
    if (!counts[k]) continue;
    const row = document.createElement("div");
    row.className = "cat-row" + (state.enabled.has(k) ? "" : " off");
    row.dataset.cat = k;
    row.innerHTML = `
      <span class="cat-dot" style="background:${CATEGORY_COLORS[k]}"></span>
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

function applyFilter() {
  const src = map.getSource(SOURCE_ID);
  if (!src) return;
  const filtered = state.features.filter((f) => state.enabled.has(f.properties.category));
  src.setData({ type: "FeatureCollection", features: filtered });
}

function openDetail(feature) {
  const detail = document.getElementById("detail");
  const body = document.getElementById("detail-body");
  const p = feature.properties || {};
  const tags = parseTags(p.tags);
  const category = p.category || "other";
  const catLabel = CATEGORY_LABELS[category] || category;
  const catColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;

  const addr = formatAddress(tags);
  const links = buildLinks(p, tags);

  body.innerHTML = `
    <span class="detail-cat" style="background:${catColor}">${catLabel}</span>
    <h2 class="detail-title">${escapeHtml(p.name || "(unnamed)")}</h2>
    <div class="detail-sub">${escapeHtml(addr || tags["addr:city"] || "")}</div>
    <div id="wd-slot"></div>
    <div class="detail-section">
      <h4>OSM tags</h4>
      <dl class="tag-grid">${renderTagRows(tags)}</dl>
    </div>
    ${links.length ? `<div class="detail-section"><h4>Links</h4><div class="detail-links">${links.join("")}</div></div>` : ""}
  `;
  detail.classList.add("open");
  detail.setAttribute("aria-hidden", "false");

  if (p.wikidata) {
    const slot = document.getElementById("wd-slot");
    slot.innerHTML = `
      <div class="detail-section">
        <h4>Wikidata · ${escapeHtml(p.wikidata)}</h4>
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
          <h4>Wikidata · <a href="https://www.wikidata.org/wiki/${encodeURIComponent(p.wikidata)}" target="_blank" rel="noopener">${escapeHtml(p.wikidata)}</a></h4>
          ${data.image ? `<img class="detail-image" src="${escapeAttr(data.image)}" alt="${escapeAttr(data.label || "")}" loading="lazy" />` : ""}
          ${data.label ? `<p><strong>${escapeHtml(data.label)}</strong></p>` : ""}
          ${data.desc ? `<p>${escapeHtml(data.desc)}</p>` : ""}
          ${data.inception ? `<p style="color:var(--text-dim);font-size:12px;">est. ${escapeHtml(data.inception)}</p>` : ""}
          ${data.wikipediaUrl ? `<p><a href="${escapeAttr(data.wikipediaUrl)}" target="_blank" rel="noopener" style="color:var(--accent)">Read on Wikipedia →</a></p>` : ""}
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
    out.push(`<a href="https://www.openstreetmap.org/${props.osm_type}/${props.osm_id}" target="_blank" rel="noopener">OSM</a>`);
  }
  if (tags.website || tags.url) {
    const u = tags.website || tags.url;
    out.push(`<a href="${escapeAttr(u)}" target="_blank" rel="noopener">Website</a>`);
  }
  if (tags.wikipedia) {
    const [lang, title] = tags.wikipedia.split(":", 2);
    if (lang && title) {
      out.push(`<a href="https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}" target="_blank" rel="noopener">Wikipedia</a>`);
    }
  }
  return out;
}

const TAG_DISPLAY_ORDER = [
  "tourism", "amenity", "historic", "heritage",
  "start_date", "opening_hours", "operator",
  "denomination", "religion", "artist_name", "artwork_type", "material",
  "phone", "email", "wheelchair",
];

function renderTagRows(tags) {
  const keys = TAG_DISPLAY_ORDER.filter((k) => tags[k] != null);
  if (!keys.length) return `<dt>—</dt><dd>no extra tags</dd>`;
  return keys
    .map((k) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(String(tags[k]))}</dd>`)
    .join("");
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
    if (!ent) {
      wikidataCache.set(qid, null);
      return null;
    }
    const label = ent.labels?.en?.value;
    const desc = ent.descriptions?.en?.value;
    const imageFile = ent.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    const inceptionRaw = ent.claims?.P571?.[0]?.mainsnak?.datavalue?.value?.time;
    const inception = inceptionRaw ? inceptionRaw.replace(/^\+/, "").slice(0, 10) : null;
    const wikipediaUrl = ent.sitelinks?.enwiki?.url || null;
    const image = imageFile
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFile)}?width=600`
      : null;
    const out = { label, desc, image, inception, wikipediaUrl };
    wikidataCache.set(qid, out);
    return out;
  } catch (e) {
    wikidataCache.set(qid, null);
    return null;
  }
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
