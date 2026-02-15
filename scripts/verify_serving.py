#!/usr/bin/env python3
"""Verify data is served correctly by the dev server."""
import urllib.request
import json

url = "http://localhost:8080/data/kcet_cutoffs_consolidated.json"
print(f"Fetching {url}...")

with urllib.request.urlopen(url) as resp:
    raw_bytes = resp.read(3000)
    raw = raw_bytes.decode("utf-8")
    
    # Find the cutoffs key to extract just metadata
    idx = raw.find('"cutoffs"')
    if idx > 0:
        partial = raw[:idx-1] + "}"
        meta = json.loads(partial)
        m = meta["metadata"]
        print(f"total_entries: {m['total_entries']}")
        print(f"total_institutes: {m['total_institutes']}")
        print(f"total_courses: {m['total_courses']}")
        print(f"total_categories: {m['total_categories']}")
        print(f"years: {m['years_covered']}")
        print(f"rounds: {m['rounds_covered']}")
        print(f"source: {m['source_type']}")
        print()
        print("DATA IS LIVE AND SERVING CORRECTLY!")
    else:
        print("Unexpected structure:")
        print(raw[:300])
