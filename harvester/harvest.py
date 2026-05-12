import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from .countries import EU_PLUS
from .overpass import fetch
from .tags import categorize

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
COUNTRY_DIR = DATA_DIR / "countries"

KEEP_TAGS = {
    "name", "name:en", "alt_name", "official_name",
    "tourism", "amenity", "historic", "heritage", "memorial", "ruins", "tomb",
    "wikidata", "wikipedia", "image", "website", "url",
    "start_date", "end_date", "opening_hours", "phone", "email",
    "addr:city", "addr:street", "addr:housenumber", "addr:postcode", "addr:country",
    "denomination", "religion", "artist_name", "artwork_type", "material",
    "building", "wheelchair", "operator",
    "buried", "buried:wikidata", "buried:wikipedia",
}


def coords(el):
    if el["type"] == "node":
        return [el["lon"], el["lat"]]
    c = el.get("center")
    if c:
        return [c["lon"], c["lat"]]
    return None


def slim_tags(tags):
    return {k: v for k, v in tags.items() if k in KEEP_TAGS or k.startswith("name:")}


def to_feature(el):
    tags = el.get("tags") or {}
    if not tags:
        return None
    if not (tags.get("name") or tags.get("name:en") or tags.get("wikidata") or tags.get("wikipedia")):
        return None
    lonlat = coords(el)
    if not lonlat:
        return None
    props = {
        "osm_type": el["type"],
        "osm_id": el["id"],
        "category": categorize(tags),
        "name": tags.get("name") or tags.get("name:en"),
        "wikidata": tags.get("wikidata"),
        "wikipedia": tags.get("wikipedia"),
        "tags": slim_tags(tags),
    }
    buried_qid = tags.get("buried:wikidata")
    if buried_qid:
        props["buried_wikidata"] = buried_qid
    return {
        "type": "Feature",
        "id": f"{el['type']}/{el['id']}",
        "geometry": {"type": "Point", "coordinates": lonlat},
        "properties": props,
    }


def load_existing(path):
    if not path.exists():
        return None
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception:
        return None


def harvest_country(cc):
    data = fetch(cc)
    features = []
    seen = set()
    for el in data.get("elements", []):
        f = to_feature(el)
        if not f:
            continue
        if f["id"] in seen:
            continue
        seen.add(f["id"])
        features.append(f)
    return features


def load_manifest():
    path = DATA_DIR / "manifest.json"
    if not path.exists():
        return {}
    try:
        with path.open("r", encoding="utf-8") as fh:
            m = json.load(fh)
        return {c["code"]: c for c in m.get("countries", []) if "code" in c}
    except Exception:
        return {}


def main():
    COUNTRY_DIR.mkdir(parents=True, exist_ok=True)

    only = os.environ.get("OCM_ONLY", "").strip()
    selected = {c.strip().upper() for c in only.split(",") if c.strip()} if only else None

    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    prior = load_manifest()
    manifest = {"generated_at": now, "countries": []}

    targets = EU_PLUS if not selected else [(cc, name) for cc, name in EU_PLUS if cc in selected]
    if selected:
        print(f"limited run: {sorted(selected)}", flush=True)

    targeted_codes = {cc for cc, _ in targets}

    for cc, name in EU_PLUS:
        if cc not in targeted_codes:
            entry = prior.get(cc) or {"code": cc, "name": name, "file": f"countries/{cc}.geojson", "count": 0}
            manifest["countries"].append(entry)

    for i, (cc, name) in enumerate(targets):
        path = COUNTRY_DIR / f"{cc}.geojson"
        entry = {"code": cc, "name": name, "file": f"countries/{cc}.geojson"}
        print(f"[{i+1}/{len(targets)}] {cc} {name}...", flush=True)
        try:
            features = harvest_country(cc)
            fc = {"type": "FeatureCollection", "features": features}
            with path.open("w", encoding="utf-8") as fh:
                json.dump(fc, fh, ensure_ascii=False, separators=(",", ":"))
            entry["count"] = len(features)
            entry["updated_at"] = now
            print(f"    -> {len(features)} features", flush=True)
        except Exception as e:
            print(f"    !! FAILED: {e}", flush=True)
            existing = load_existing(path)
            if existing:
                entry["count"] = len(existing.get("features", []))
                entry["stale"] = True
            else:
                entry["count"] = 0
                entry["error"] = str(e)
        manifest["countries"].append(entry)
        if i < len(targets) - 1:
            time.sleep(8)

    manifest["countries"].sort(key=lambda c: [cc for cc, _ in EU_PLUS].index(c["code"]) if c["code"] in [cc for cc, _ in EU_PLUS] else 999)

    with (DATA_DIR / "manifest.json").open("w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
    print("done.", flush=True)


if __name__ == "__main__":
    main()
