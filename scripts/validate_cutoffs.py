import csv
import datetime as dt
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


ROOT = Path(".")
HTML_DIR = ROOT / "HTMLCUTO"
FULL_JSON = ROOT / "public" / "data" / "kcet_cutoffs_htmlcuto_full.json"
HTML_ONLY_JSON = ROOT / "public" / "data" / "kcet_cutoffs_htmlcuto.json"
PDF_2025_CSV = ROOT / "kcet_2025_pdf_extracted.csv"
REPORT_DIR = ROOT / "reports"
REPORT_JSON = REPORT_DIR / "cutoff_validation_report.json"
REPORT_MD = REPORT_DIR / "cutoff_validation_report.md"

EXPECTED_CATEGORIES = {
    "1G",
    "1K",
    "1R",
    "2AG",
    "2AK",
    "2AR",
    "2BG",
    "2BK",
    "2BR",
    "3AG",
    "3AK",
    "3AR",
    "3BG",
    "3BK",
    "3BR",
    "GM",
    "GMK",
    "GMR",
    "SCG",
    "SCK",
    "SCR",
    "STG",
    "STK",
    "STR",
    # Seen in 2025 R2/R3 PDF tables
    "GMP",
    "NRI",
    "OPN",
    "OTH",
}


def normalize_round(value: str) -> str:
    text = (value or "").strip().lower()
    if text in ("round 1", "r1"):
        return "R1"
    if text in ("round 2", "r2"):
        return "R2"
    if text in ("round 3", "r3", "round 3 extended", "round 3 (extended)"):
        return "R3"
    if "mock" in text:
        return "MOCK"
    return text.upper()


def row_key(row: Dict) -> Tuple[str, str, str, str, str, str, int]:
    return (
        str(row.get("institute_code", "")).strip().upper(),
        str(row.get("institute", "")).strip(),
        str(row.get("course", "")).strip(),
        str(row.get("category", "")).strip().upper(),
        str(row.get("year", "")).strip(),
        str(row.get("round", "")).strip().upper(),
        int(row.get("cutoff_rank", 0)),
    )


def load_cutoffs_json(path: Path) -> List[Dict]:
    with path.open("r", encoding="utf-8") as f:
        payload = json.load(f)
    if isinstance(payload, list):
        return payload
    return payload.get("cutoffs", [])


def load_pdf_rows_for_2025_r2_r3(path: Path) -> List[Dict]:
    rows: List[Dict] = []
    with path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for item in reader:
            year = str(item.get("Year", "")).strip()
            if year != "2025":
                continue
            round_code = normalize_round(str(item.get("Round", "")))
            if round_code not in ("R2", "R3"):
                continue
            try:
                rank = int(float(str(item.get("CutoffRank", "")).replace(",", "")))
            except Exception:
                continue
            rows.append(
                {
                    "institute": str(item.get("CollegeName", "")).strip(),
                    "institute_code": str(item.get("CollegeCode", "")).strip().upper(),
                    "course": str(item.get("CourseCode", "")).strip(),
                    "category": str(item.get("Category", "")).strip().upper(),
                    "cutoff_rank": rank,
                    "year": "2025",
                    "round": round_code,
                }
            )
    return rows


def summarize_html_sources(html_dir: Path) -> List[Dict]:
    out = []
    for path in sorted(html_dir.glob("kcet-*-cutoffs.html")):
        size = path.stat().st_size
        pages = 0
        if size > 0:
            text = path.read_text(encoding="utf-8", errors="ignore")
            pages = len(re.findall(r'class="stl_view"', text))
        out.append(
            {
                "file": path.name,
                "size_bytes": size,
                "is_empty": size == 0,
                "detected_pages": pages,
            }
        )
    return out


def find_duplicates(rows: Iterable[Dict]) -> int:
    seen = set()
    dup = 0
    for row in rows:
        key = row_key(row)
        if key in seen:
            dup += 1
        else:
            seen.add(key)
    return dup


def by_year_round(rows: Iterable[Dict]) -> Dict[str, int]:
    c = Counter()
    for r in rows:
        c[f"{r['year']}-{str(r['round']).upper()}"] += 1
    return dict(sorted(c.items()))


def category_anomalies(rows: Iterable[Dict]) -> Dict[str, List[str]]:
    bad = defaultdict(set)
    for r in rows:
        yr = str(r["year"])
        cat = str(r["category"]).upper().strip()
        if cat not in EXPECTED_CATEGORIES:
            bad[yr].add(cat)
    return {k: sorted(v) for k, v in sorted(bad.items())}


def suspicious_courses(rows: Iterable[Dict], limit: int = 25) -> List[Tuple[str, int]]:
    c = Counter()
    for r in rows:
        course = str(r["course"]).strip()
        if (
            course.endswith("&")
            or course.endswith("AND")
            or course.endswith("OF")
            or len(course) < 3
        ):
            c[course] += 1
    return c.most_common(limit)


def write_markdown(report: Dict, path: Path) -> None:
    lines = []
    lines.append("# KCET Cutoff Validation Report")
    lines.append("")
    lines.append(f"- Dataset: `{report['dataset_path']}`")
    lines.append(f"- Generated: `{report['generated_at']}`")
    lines.append("")
    lines.append("## Core Checks")
    lines.append(f"- Total rows: **{report['core']['total_rows']}**")
    lines.append(f"- Duplicate rows: **{report['core']['duplicate_rows']}**")
    lines.append(f"- Invalid rank rows: **{report['core']['invalid_rank_rows']}**")
    lines.append("")
    lines.append("## Source Coverage (HTMLCUTO)")
    for item in report["source_coverage"]:
        lines.append(
            f"- `{item['file']}`: size={item['size_bytes']} bytes, pages={item['detected_pages']}, empty={item['is_empty']}"
        )
    lines.append("")
    lines.append("## Year/Round Counts")
    for key, value in report["counts"]["by_year_round"].items():
        lines.append(f"- `{key}`: {value}")
    lines.append("")
    lines.append("## Reconciliation")
    rec = report["reconciliation"]
    lines.append(f"- Expected rows (HTML + 2025 R2/R3 PDF): **{rec['expected_rows']}**")
    lines.append(f"- Dataset rows: **{rec['dataset_rows']}**")
    lines.append(f"- Missing rows in dataset: **{rec['missing_rows']}**")
    lines.append(f"- Extra rows in dataset: **{rec['extra_rows']}**")
    lines.append("")
    lines.append("## Presidency Sanity Check (2025)")
    for k, v in report["sanity"]["presidency_2025"].items():
        lines.append(f"- `{k}`: {v}")
    lines.append("")
    lines.append("## Category Anomalies")
    if report["anomalies"]["unknown_categories_by_year"]:
        for y, cats in report["anomalies"]["unknown_categories_by_year"].items():
            lines.append(f"- `{y}`: {', '.join(cats)}")
    else:
        lines.append("- None")
    lines.append("")
    lines.append("## Suspicious Course Names (top)")
    if report["anomalies"]["suspicious_courses_top"]:
        for name, count in report["anomalies"]["suspicious_courses_top"]:
            lines.append(f"- `{name}`: {count}")
    else:
        lines.append("- None")

    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run() -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    full_rows = load_cutoffs_json(FULL_JSON)
    html_rows = load_cutoffs_json(HTML_ONLY_JSON)
    pdf_r2r3_rows = load_pdf_rows_for_2025_r2_r3(PDF_2025_CSV)
    source_coverage = summarize_html_sources(HTML_DIR)

    full_set = {row_key(r) for r in full_rows}
    expected_set = {row_key(r) for r in html_rows}
    expected_set.update(row_key(r) for r in pdf_r2r3_rows)

    missing = expected_set - full_set
    extra = full_set - expected_set

    invalid_rank_rows = 0
    for r in full_rows:
        try:
            rank = int(r.get("cutoff_rank", 0))
            if rank <= 0 or rank > 999999:
                invalid_rank_rows += 1
        except Exception:
            invalid_rank_rows += 1

    presidency_2025 = {
        "R1": 0,
        "R2": 0,
        "R3": 0,
        "MOCK": 0,
    }
    for r in full_rows:
        if str(r.get("year")) != "2025":
            continue
        if "PRESIDENCY" not in str(r.get("institute", "")).upper():
            continue
        rr = str(r.get("round", "")).upper()
        presidency_2025[rr] = presidency_2025.get(rr, 0) + 1

    report = {
        "dataset_path": str(FULL_JSON.as_posix()),
        "generated_at": dt.datetime.now(dt.UTC).isoformat(),
        "core": {
            "total_rows": len(full_rows),
            "duplicate_rows": find_duplicates(full_rows),
            "invalid_rank_rows": invalid_rank_rows,
        },
        "source_coverage": source_coverage,
        "counts": {
            "by_year_round": by_year_round(full_rows),
            "colleges_2025": len(
                {str(r["institute_code"]).upper() for r in full_rows if str(r["year"]) == "2025"}
            ),
            "courses_2025": len({str(r["course"]) for r in full_rows if str(r["year"]) == "2025"}),
        },
        "reconciliation": {
            "expected_rows": len(expected_set),
            "dataset_rows": len(full_set),
            "missing_rows": len(missing),
            "extra_rows": len(extra),
            "missing_examples": [list(x) for x in list(sorted(missing))[:20]],
            "extra_examples": [list(x) for x in list(sorted(extra))[:20]],
        },
        "sanity": {
            "presidency_2025": presidency_2025,
        },
        "anomalies": {
            "unknown_categories_by_year": category_anomalies(full_rows),
            "suspicious_courses_top": suspicious_courses(full_rows),
        },
    }

    REPORT_JSON.write_text(json.dumps(report, indent=2), encoding="utf-8")
    write_markdown(report, REPORT_MD)

    print(f"Validation done: {REPORT_JSON}")
    print(f"Summary doc  : {REPORT_MD}")
    print(f"Total rows   : {report['core']['total_rows']}")
    print(f"Duplicates   : {report['core']['duplicate_rows']}")
    print(f"Missing rows : {report['reconciliation']['missing_rows']}")
    print(f"Extra rows   : {report['reconciliation']['extra_rows']}")
    print(f"Presidency 2025 counts: {report['sanity']['presidency_2025']}")


if __name__ == "__main__":
    run()
