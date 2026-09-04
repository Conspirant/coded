#!/usr/bin/env python3
"""
Merge 2026 Mock & R1 Cutoff Data into Consolidated/Master JSON Files
=====================================================================
Loads the extracted 2026 data and merges it into all consolidated files,
maintaining the dictionary structure and updating metadata/statistics.
Also updates cutoffs-summary.json.
"""

import json
import sys
import datetime
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
DATA_DIR = PUBLIC / "data"

# Input 2026 extracted data files
CUTOFF_MOCK = ROOT / "cutoff_2026_extracted.json"
CUTOFF_MOCK_R2 = ROOT / "cutoff_2026_mock_r2_extracted.json"
CUTOFF_R1 = ROOT / "cutoff_2026_r1_extracted.json"
CUTOFF_R2 = ROOT / "cutoff_2026_r2_extracted.json"
CUTOFF_R3 = ROOT / "cutoff_2026_r3_extracted.json"

# Targets to update
TARGET_JSON_PATHS = [
    DATA_DIR / "kcet_cutoffs_master.json",
    DATA_DIR / "kcet_cutoffs_high_volume.json",
    DATA_DIR / "kcet_cutoffs_consolidated.json",
    DATA_DIR / "kcet_cutoffs_master.dat",
    DATA_DIR / "kcet_cutoffs_high_volume.dat",
    DATA_DIR / "kcet_cutoffs_consolidated.dat",
    PUBLIC / "kcet_cutoffs_master.json",
    PUBLIC / "kcet_cutoffs_high_volume.json",
    PUBLIC / "kcet_cutoffs_consolidated.json",
    PUBLIC / "kcet_cutoffs_master.dat",
    PUBLIC / "kcet_cutoffs_high_volume.dat",
    PUBLIC / "kcet_cutoffs_consolidated.dat",
    PUBLIC / "kcet_cutoffs.dat",
    PUBLIC / "kcet_cutoffs_consolidated (2).json",
]

SUMMARY_JSON_PATH = DATA_DIR / "cutoffs-summary.json"

def deduplicate(rows):
    seen = set()
    unique_rows = []
    for r in rows:
        key = (
            r.get("institute_code", ""),
            r.get("course", ""),
            r.get("category", ""),
            str(r.get("year", "")),
            r.get("round", ""),
            str(r.get("cutoff_rank", "")),
        )
        if key in seen:
            continue
        seen.add(key)
        unique_rows.append(r)
    return unique_rows

def main():
    # Fix Windows console encoding
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

    print("=" * 70)
    print("  Merging 2026 Data into Consolidated & Master Files")
    print("=" * 70)

    # 1. Load extracted 2026 data
    if not CUTOFF_MOCK.exists() or not CUTOFF_MOCK_R2.exists() or not CUTOFF_R1.exists() or not CUTOFF_R2.exists() or not CUTOFF_R3.exists():
        print("ERROR: Extracted 2026 JSON files not found! Run extract_2026_precise.py first.")
        sys.exit(1)

    with open(CUTOFF_MOCK, 'r', encoding='utf-8') as f:
        mock_data = json.load(f)
    with open(CUTOFF_MOCK_R2, 'r', encoding='utf-8') as f:
        mock_r2_data = json.load(f)
    with open(CUTOFF_R1, 'r', encoding='utf-8') as f:
        r1_data = json.load(f)
    with open(CUTOFF_R2, 'r', encoding='utf-8') as f:
        r2_data = json.load(f)
    with open(CUTOFF_R3, 'r', encoding='utf-8') as f:
        r3_data = json.load(f)

    new_2026_data = mock_data + mock_r2_data + r1_data + r2_data + r3_data
    print(f"Loaded {len(mock_data):,} Mock 1, {len(mock_r2_data):,} Mock 2, {len(r1_data):,} R1, {len(r2_data):,} R2, and {len(r3_data):,} R3 entries.")
    print(f"Total new 2026 entries: {len(new_2026_data):,}")

    for target in TARGET_JSON_PATHS:
        if not target.exists():
            print(f"⚠️ Target does not exist (skipping): {target}")
            continue

        print(f"\nProcessing target: {target.relative_to(ROOT)}")
        with open(target, 'r', encoding='utf-8') as f:
            raw = json.load(f)

        is_dict = isinstance(raw, dict)
        existing_cutoffs = raw.get("cutoffs", []) if is_dict else raw

        # Filter out old 2026 entries (in case of re-run)
        pre_count = len(existing_cutoffs)
        filtered_cutoffs = [r for r in existing_cutoffs if str(r.get("year", "")) != "2026"]
        removed_count = pre_count - len(filtered_cutoffs)
        if removed_count > 0:
            print(f"   Removed {removed_count:,} stale 2026 entries.")

        # Merge and deduplicate
        merged_cutoffs = filtered_cutoffs + new_2026_data
        unique_cutoffs = deduplicate(merged_cutoffs)
        
        # Sort logically
        unique_cutoffs.sort(
            key=lambda r: (
                str(r.get("year", "")),
                r.get("round", ""),
                r.get("institute_code", ""),
                r.get("course", ""),
                r.get("category", ""),
                r.get("cutoff_rank", 0),
            )
        )

        if is_dict:
            # Rebuild metadata
            by_year = Counter(str(r["year"]) for r in unique_cutoffs)
            by_round = Counter(r["round"] for r in unique_cutoffs)
            by_year_round = Counter((str(r["year"]), r["round"]) for r in unique_cutoffs)
            institutes = sorted({r["institute_code"] for r in unique_cutoffs})
            categories = sorted({r["category"] for r in unique_cutoffs})
            courses = sorted({r["course"] for r in unique_cutoffs})

            records_by_year_round = {
                f"{year}_{round_value}": count
                for (year, round_value), count in sorted(by_year_round.items())
            }

            metadata = {
                "last_updated": datetime.datetime.now().isoformat(),
                "source_type": "strict_rebuild_xlsx_2023_2024_plus_pdf_2025_2026",
                "total_entries": len(unique_cutoffs),
                "total_institutes": len(institutes),
                "total_courses": len(courses),
                "total_categories": len(categories),
                "years_covered": sorted(by_year.keys()),
                "rounds_covered": sorted(by_round.keys()),
                "records_by_year": {k: by_year[k] for k in sorted(by_year.keys())},
                "records_by_round": {k: by_round[k] for k in sorted(by_round.keys())},
                "records_by_year_round": records_by_year_round,
            }

            payload = {"metadata": metadata, "cutoffs": unique_cutoffs}
        else:
            payload = unique_cutoffs

        # Save back to target
        with open(target, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False)
        
        target_size_mb = target.stat().st_size / (1024 * 1024)
        print(f"   Successfully updated {target.name} ({target_size_mb:.2f} MB, {len(unique_cutoffs):,} entries)")

    # 4. Rebuild statistics for cutoffs-summary.json based on updated data
    print(f"\nUpdating summary stats at: {SUMMARY_JSON_PATH.relative_to(ROOT)}")
    source_stat_file = DATA_DIR / "kcet_cutoffs_consolidated.dat" if (DATA_DIR / "kcet_cutoffs_consolidated.dat").exists() else DATA_DIR / "kcet_cutoffs_consolidated.json"
    with open(source_stat_file, 'r', encoding='utf-8') as f:
        master_data = json.load(f)
    master_cutoffs = master_data.get("cutoffs", []) if isinstance(master_data, dict) else master_data
    by_year = Counter(str(r["year"]) for r in master_cutoffs)
    by_category = Counter(r["category"] for r in master_cutoffs)
    institutes = {r["institute_code"] for r in master_cutoffs}
    courses = {r["course"] for r in master_cutoffs}

    summary = {
        "totals": {
            "records": len(master_cutoffs),
            "colleges": len(institutes),
            "branches": len(courses),
        },
        "years": dict(sorted(by_year.items())),
        "categories": dict(sorted(by_category.items(), key=lambda x: -x[1])),
    }

    with open(SUMMARY_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print("Summary statistics updated successfully.")
    print("=" * 70)

if __name__ == "__main__":
    main()
