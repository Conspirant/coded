import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(".")
BASE_JSON = ROOT / "public" / "data" / "kcet_cutoffs_htmlcuto.json"
PDF_CSV = ROOT / "kcet_2025_pdf_extracted.csv"
OUT_JSON = ROOT / "public" / "data" / "kcet_cutoffs_htmlcuto_full.json"
OUT_CSV = ROOT / "public" / "data" / "kcet_cutoffs_htmlcuto_full.csv"


def normalize_round(value: str) -> str:
    r = (value or "").strip().lower()
    if r in ("round 1", "r1"):
        return "R1"
    if r in ("round 2", "r2"):
        return "R2"
    if r in ("round 3", "r3", "round 3 extended", "round 3 (extended)"):
        return "R3"
    if "mock" in r:
        return "MOCK"
    return r.upper()


def key_of(row):
    return (
        row["institute_code"],
        row["institute"],
        row["course"],
        row["category"],
        row["year"],
        row["round"],
        int(row["cutoff_rank"]),
    )


def run():
    with BASE_JSON.open("r", encoding="utf-8") as f:
        payload = json.load(f)
    rows = list(payload["cutoffs"])

    seen = {key_of(r) for r in rows}
    added = 0

    with PDF_CSV.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for item in reader:
            year = str(item.get("Year", "")).strip()
            round_code = normalize_round(item.get("Round", ""))
            if year != "2025" or round_code not in ("R2", "R3"):
                continue

            try:
                rank = int(float(str(item.get("CutoffRank", "")).replace(",", "")))
            except Exception:
                continue

            row = {
                "institute": str(item.get("CollegeName", "")).strip(),
                "institute_code": str(item.get("CollegeCode", "")).strip().upper(),
                "course": str(item.get("CourseCode", "")).strip(),
                "category": str(item.get("Category", "")).strip().upper(),
                "cutoff_rank": rank,
                "year": "2025",
                "round": round_code,
            }
            k = key_of(row)
            if k in seen:
                continue
            seen.add(k)
            rows.append(row)
            added += 1

    rows.sort(
        key=lambda r: (
            r["year"],
            r["round"],
            r["institute_code"],
            r["course"],
            r["category"],
            int(r["cutoff_rank"]),
        )
    )

    metadata = dict(payload.get("metadata", {}))
    metadata["merged_with_2025_pdf_r2_r3"] = True
    metadata["added_entries_from_pdf"] = added
    metadata["total_entries_unique"] = len(rows)
    metadata["by_year_round"] = dict(Counter(f"{r['year']}-{r['round']}" for r in rows))

    out_payload = {"metadata": metadata, "cutoffs": rows}
    OUT_JSON.write_text(json.dumps(out_payload, indent=2), encoding="utf-8")

    with OUT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(
            ["institute", "institute_code", "course", "category", "cutoff_rank", "year", "round"]
        )
        for row in rows:
            writer.writerow(
                [
                    row["institute"],
                    row["institute_code"],
                    row["course"],
                    row["category"],
                    row["cutoff_rank"],
                    row["year"],
                    row["round"],
                ]
            )

    print(f"Added rows from 2025 PDF (R2/R3): {added}")
    print(f"Total rows (full): {len(rows)}")
    print(f"Wrote JSON: {OUT_JSON}")
    print(f"Wrote CSV : {OUT_CSV}")


if __name__ == "__main__":
    run()
