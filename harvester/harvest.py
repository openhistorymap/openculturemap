import json
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
    "tourism", "amenity", "historic", "heritage", "memorial", "ruins",
    "wikidata", "wikipedia", "image", "website", "url",
    "start_date", "opening_hours", "phone", "email",
    "addr:city", "addr:street", "addr:housenumber", "addr:postcode", "addr:country",
    "denomination", "religion", "artist_name", "artwork_type", "material",
    "building", "wheelchair", "operator",
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
    return {
        "type": "Feature",
        "id": f"{el['type']}/{el['id']}",
        "geometry": {"type": "Point", "coordinates": lonlat},
        "properties": {
            "osm_type": el["type"],
            "osm_id": el["id"],
            "category": categorize(tags),
            "name": tags.get("name") or tags.get("name:en"),
            "wikidata": tags.get("wikidata"),
            "wikipedia": tags.get("wikipedia"),
            "tags": slim_tags(tags),
        },
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


def main():
    COUNTRY_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "countries": [],
    }
    for i, (cc, name) in enumerate(EU_PLUS):
        path = COUNTRY_DIR / f"{cc}.geojson"
        entry = {"code": cc, "name": name, "file": f"countries/{cc}.geojson"}
        print(f"[{i+1}/{len(EU_PLUS)}] {cc} {name}...", flush=True)
        try:
            features = harvest_country(cc)
            fc = {"type": "FeatureCollection", "features": features}
            with path.open("w", encoding="utf-8") as fh:
                json.dump(fc, fh, ensure_ascii=False, separators=(",", ":"))
            entry["count"] = len(features)
            entry["updated_at"] = manifest["generated_at"]
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
        time.sleep(8)
    with (DATA_DIR / "manifest.json").open("w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
    print("done.", flush=True)


if __name__ == "__main__":
    main()
