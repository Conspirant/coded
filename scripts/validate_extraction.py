#!/usr/bin/env python3
"""Validate the extracted KCET cutoff data."""
import json
from collections import defaultdict

with open("public/kcet_cutoffs.json", "r", encoding="utf-8") as f:
    data = json.load(f)

cutoffs = data["cutoffs"]
meta = data["metadata"]

print("=" * 60)
print("  FINAL DATA VALIDATION")
print("=" * 60)
print(f"Total entries: {meta['total_entries']}")
print(f"Institutes: {meta['total_institutes']}")
print(f"Courses: {meta['total_courses']}")
print(f"Categories: {meta['total_categories']}")
print()

# 1. Check for newlines in course names
bad = [r for r in cutoffs if "\n" in r.get("course", "")]
status = "PASS" if len(bad) == 0 else "FAIL"
print(f"[{status}] Courses with newlines: {len(bad)}")

# 2. Check categories per year
cats_by_year = defaultdict(set)
for r in cutoffs:
    cats_by_year[r["year"]].add(r["category"])
for y in sorted(cats_by_year):
    n = len(cats_by_year[y])
    s = "PASS" if n >= 24 else "FAIL"
    print(f"[{s}] {y} categories: {n}")

# 3. Check Presidency
pres = [r for r in cutoffs if r["institute_code"] == "E237"]
pres_by_yr_rd = defaultdict(int)
for r in pres:
    pres_by_yr_rd[f"{r['year']}-{r['round']}"] += 1
s = "PASS" if len(pres) > 0 else "FAIL"
print(f"[{s}] Presidency (E237): {len(pres)} entries")
for k, v in sorted(pres_by_yr_rd.items()):
    print(f"       {k}: {v}")

# 4. Check duplicates
seen = set()
dupes = 0
for r in cutoffs:
    key = (r["institute_code"], r["course"], r["category"], r["year"], r["round"])
    if key in seen:
        dupes += 1
    seen.add(key)
s = "PASS" if dupes == 0 else "FAIL"
print(f"[{s}] Duplicates (by dedup key): {dupes}")

# 5. Check data structure
required = ["institute", "institute_code", "course", "category", "cutoff_rank", "year", "round"]
missing = [f for f in required if f not in cutoffs[0]]
s = "PASS" if not missing else "FAIL"
print(f"[{s}] All 7 required fields present: {not missing}")

# 6. Count by year
by_year = defaultdict(int)
colleges_by_year = defaultdict(set)
for r in cutoffs:
    by_year[r["year"]] += 1
    colleges_by_year[r["year"]].add(r["institute_code"])
print()
print("Entries by year:")
for y in sorted(by_year):
    print(f"  {y}: {by_year[y]:>8,} entries | {len(colleges_by_year[y])} colleges")

# 7. Count by round
by_round = defaultdict(int)
for r in cutoffs:
    by_round[r["round"]] += 1
print()
print("Entries by round:")
for rd in sorted(by_round):
    print(f"  {rd:>4}: {by_round[rd]:>8,}")

# 8. Sample course names from 2025
courses_2025 = sorted(set(r["course"] for r in cutoffs if r["year"] == "2025"))
print(f"\n2025 unique courses: {len(courses_2025)}")
print("Sample courses:")
for c in courses_2025[:10]:
    print(f"  {c}")

# 9. Sample record
print(f"\nSample record:")
print(json.dumps(cutoffs[0], indent=2))

# 10. Check cutoff_rank types
bad_ranks = [r for r in cutoffs if not isinstance(r["cutoff_rank"], int)]
s = "PASS" if len(bad_ranks) == 0 else "FAIL"
print(f"\n[{s}] All cutoff_ranks are int: {len(bad_ranks)} non-int found")

print()
print("=" * 60)
all_pass = (
    len(bad) == 0
    and all(len(cats_by_year[y]) >= 24 for y in cats_by_year)
    and len(pres) > 0
    and dupes == 0
    and not missing
    and len(bad_ranks) == 0
)
if all_pass:
    print("  ALL CHECKS PASSED!")
else:
    print("  SOME CHECKS FAILED - review above")
print("=" * 60)
