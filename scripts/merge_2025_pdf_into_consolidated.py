import argparse
import csv
import json
import os
from datetime import datetime, timezone


def clean_course_name(name: str) -> str:
    return " ".join((name or "").replace("\n", " ").split()).strip()


def normalize_round(value: str) -> str:
    v = (value or "").strip().upper()
    if "MOCK" in v:
        return "MOCK"
    if v in {"R1", "ROUND 1"} or "ROUND 1" in v:
        return "R1"
    if v in {"R2", "ROUND 2"} or "ROUND 2" in v:
        return "R2"
    if v in {"R3", "ROUND 3"} or "ROUND 3" in v or "EXTENDED" in v or "EXT" in v:
        return "R3"
    return v or "R1"


def load_consolidated(path: str):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return {"metadata": {}, "cutoffs": data}
    if isinstance(data, dict):
        if isinstance(data.get("cutoffs"), list):
            return data
        if isinstance(data.get("data"), list):
            return {"metadata": data.get("metadata", {}), "cutoffs": data.get("data")}
    return {"metadata": {}, "cutoffs": []}


def write_consolidated(path: str, payload: dict):
    dir_name = os.path.dirname(path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(description="Merge 2025 PDF-extracted cutoffs into consolidated JSON.")
    parser.add_argument("--csv", default="public/cutoffs/kcet_2025_pdf_extracted.csv")
    parser.add_argument("--consolidated", default="public/data/kcet_cutoffs_consolidated.json")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing entries when keys match.")
    parser.add_argument(
        "--replace-2025",
        action="store_true",
        help="Drop all existing 2025 rows and rebuild 2025 only from the PDF-extracted CSV.",
    )
    args = parser.parse_args()

    consolidated = load_consolidated(args.consolidated)
    cutoffs = consolidated.get("cutoffs", [])
    removed_2025 = 0

    if args.replace_2025:
        before = len(cutoffs)
        cutoffs = [c for c in cutoffs if str(c.get("year", "")).strip() != "2025"]
        removed_2025 = before - len(cutoffs)

    existing_index = {}
    for idx, c in enumerate(cutoffs):
        key = (
            (c.get("institute_code") or "").strip().upper(),
            clean_course_name(c.get("course", "")),
            (c.get("category") or "").strip().upper(),
            (c.get("year") or "").strip(),
            normalize_round(c.get("round") or ""),
        )
        existing_index[key] = idx

    added = 0
    updated = 0
    with open(args.csv, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            institute_code = (row.get("CollegeCode") or "").strip().upper()
            course = clean_course_name(row.get("CourseCode") or "")
            category = (row.get("Category") or "").strip().upper()
            year = (row.get("Year") or "").strip()
            round_val = normalize_round(row.get("Round") or "")

            try:
                cutoff_rank = int(float(str(row.get("CutoffRank") or "").replace(",", "").strip()))
            except Exception:
                continue

            key = (institute_code, course, category, year, round_val)
            record = {
                "institute": (row.get("CollegeName") or "").strip(),
                "institute_code": institute_code,
                "course": course,
                "category": category,
                "cutoff_rank": cutoff_rank,
                "year": year,
                "round": round_val,
            }

            if key in existing_index:
                if args.overwrite:
                    cutoffs[existing_index[key]] = record
                    updated += 1
            else:
                existing_index[key] = len(cutoffs)
                cutoffs.append(record)
                added += 1

    # Rebuild metadata
    institutes = set()
    courses = set()
    categories = set()
    years = set()
    rounds = set()
    for c in cutoffs:
        institutes.add(c.get("institute_code"))
        courses.add(c.get("course"))
        categories.add(c.get("category"))
        years.add(c.get("year"))
        rounds.add(c.get("round"))

    consolidated["metadata"] = {
        **(consolidated.get("metadata") or {}),
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "total_entries": len(cutoffs),
        "total_institutes": len(institutes),
        "total_courses": len(courses),
        "total_categories": len(categories),
        "years_covered": sorted(y for y in years if y),
        "rounds_covered": sorted(r for r in rounds if r),
        "extraction_method": (
            "Replaced 2025 with PDF extraction"
            if args.replace_2025
            else "Merged 2025 PDF extraction into consolidated data"
        ),
    }
    consolidated["cutoffs"] = cutoffs

    # Write back to consolidated + common mirrors if present
    write_consolidated(args.consolidated, consolidated)

    root_path = "kcet_cutoffs_consolidated.json"
    public_root_path = "public/kcet_cutoffs_consolidated.json"
    if os.path.exists(root_path):
        write_consolidated(root_path, consolidated)
    if os.path.exists(public_root_path):
        write_consolidated(public_root_path, consolidated)

    print(f"Added: {added}")
    print(f"Updated: {updated}")
    print(f"Removed2025: {removed_2025}")
    print(f"Total: {len(cutoffs)}")


if __name__ == "__main__":
    main()
