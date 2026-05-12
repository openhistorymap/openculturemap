import time
import requests

MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]

QUERY = """
[out:json][timeout:900];
area["ISO3166-1"="{cc}"][admin_level=2]->.a;
(
  nwr["tourism"="museum"](area.a);
  nwr["tourism"="gallery"](area.a);
  nwr["tourism"="artwork"](area.a);
  nwr["amenity"="arts_centre"](area.a);
  nwr["amenity"="theatre"](area.a);
  nwr["historic"](area.a);
  nwr["heritage"](area.a);
);
out tags center;
"""


def fetch(cc, attempts_per_mirror=2):
    body = QUERY.format(cc=cc)
    last_err = None
    for mirror in MIRRORS:
        for attempt in range(attempts_per_mirror):
            try:
                r = requests.post(
                    mirror,
                    data={"data": body},
                    timeout=960,
                    headers={"User-Agent": "openculturemap/1.0 (+https://openhistorymap.org)"},
                )
                if r.status_code in (429, 504):
                    last_err = f"{mirror} -> HTTP {r.status_code}"
                    time.sleep(30 + attempt * 30)
                    continue
                r.raise_for_status()
                return r.json()
            except Exception as e:
                last_err = f"{mirror} -> {e}"
                time.sleep(15 + attempt * 30)
    raise RuntimeError(f"all overpass mirrors failed: {last_err}")
