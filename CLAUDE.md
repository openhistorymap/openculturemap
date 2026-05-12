# openculturemap

A weekly-refreshed cultural map of Europe (museums, archaeological sites, art, monuments, heritage) sourced from OpenStreetMap via Overpass, with on-demand Wikidata enrichment. Static GeoJSON per country, served from GitHub Pages, harvested by a GitHub Actions cron.

## Layout

- `harvester/` — Python module. Run with `python -m harvester`. Queries Overpass per country (EU27 + UK/CH/NO/IS), filters to features with `name`/`wikidata`/`wikipedia`, writes one minified GeoJSON per country to `data/countries/` plus `data/manifest.json`.
- `web/` — Static MapLibre frontend. No build step; deployed as-is to Pages.
- `data/` — Generated. Treat as machine-owned output; do not hand-edit.
- `.github/workflows/weekly.yml` — Sundays 03:00 UTC + manual dispatch. Harvests, commits data back to `main`, then publishes `web/ + data/` to GitHub Pages.

## Operational

- GitHub Pages serves the site at `https://www.openhistorymap.org/openculturemap/` (the org has a CNAME on `www.openhistorymap.org`). The Pages build source is set to "GitHub Actions" — the workflow's deploy job uses `actions/deploy-pages@v4`.
- Frontend uses **relative** paths for `data/manifest.json`, `style.css`, `app.js` so the `/openculturemap/` subpath works without a base href.
- Overpass calls go through three mirrors with backoff (`overpass-api.de`, `overpass.kumi.systems`, `overpass.private.coffee`). On total failure we keep the prior GeoJSON and mark the country `stale` in the manifest.
- An inter-country delay of 8s in `harvester/harvest.py` keeps the public mirrors happy. Don't remove it.

## Design

This project has a **Design Context** captured in [.impeccable.md](.impeccable.md). Read it before making any visual changes. Short version: editorial wunderkammer-atlas aesthetic — playful, generous, vivid. Light-paper default with a deep-ink dark mode. Characterful display serif (Caprasimo) + generous reading serif (Vollkorn). Earth-pigment OKLCH palette (terracotta / cobalt / saffron / moss / ink). Hand-set decorative details over Figma-stock icons. No gradient text, no border-left accent stripes, no monospace-as-techy-shorthand, no cyan-on-dark.

## House rules

- Local one-off tooling (validators, parsers, linters) runs via `docker run --rm -v "$PWD":/w -w /w python:3-slim …` — the host runtime is too old. Do **not** dockerize the project itself unless explicitly asked.
- Don't add new hard-coded credentials. There are none in this project; keep it that way.
- No tests yet. Don't claim a change is "tested" just because nothing crashed at import time.
