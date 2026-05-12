CATEGORY_ORDER = [
    "museum",
    "gallery",
    "artwork",
    "arts_centre",
    "theatre",
    "archaeological_site",
    "castle",
    "monument",
    "memorial",
    "tomb",
    "ruins",
    "fort",
    "city_gate",
    "tower",
    "manor",
    "church",
    "heritage",
    "historic",
    "other",
]


def categorize(tags):
    t = tags.get("tourism")
    if t in ("museum", "gallery", "artwork"):
        return t
    a = tags.get("amenity")
    if a in ("arts_centre", "theatre"):
        return a
    h = tags.get("historic")
    if h:
        if h in CATEGORY_ORDER:
            return h
        return "historic"
    if "heritage" in tags:
        return "heritage"
    return "other"
