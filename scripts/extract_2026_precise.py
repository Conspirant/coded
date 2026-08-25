#!/usr/bin/env python3
"""
KCET 2026 Cutoff Precise Extractor
==================================
Extracts cutoff data from '2026 mock cutoff.pdf' and '2026 round 1 provisional.pdf'
using the coordinate-based extraction algorithm to prevent cell-shifting.
Also handles copying files to their canonical locations.
"""

import os
import re
import json
import sys
import shutil
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("ERROR: pdfplumber not installed. Run: pip install pdfplumber")
    sys.exit(1)

# ─── Configuration ────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
CUTOFFS_DIR = PUBLIC / "cutoffs"
DATA_DIR = PUBLIC / "data"

PDF_MOCK = ROOT / "2026 mock cutoff.pdf"
PDF_MOCK_R2 = ROOT / "2026 mock r2.pdf"
PDF_R1 = ROOT / "2026 round 1 provisional.pdf"
PDF_R2 = ROOT / "2026 round 2 provisional.pdf"

OUTPUT_MOCK_RAW = ROOT / "cutoff_2026_extracted.json"
OUTPUT_MOCK_R2_RAW = ROOT / "cutoff_2026_mock_r2_extracted.json"
OUTPUT_R1_RAW = ROOT / "cutoff_2026_r1_extracted.json"
OUTPUT_R2_RAW = ROOT / "cutoff_2026_r2_extracted.json"
OUTPUT_SERVING_2026 = DATA_DIR / "cutoffs-2026.json"

# Canonical PDF locations
DEST_MOCK_PUBLIC = CUTOFFS_DIR / "kcet-2026-mock-round1-cutoffs.pdf"
DEST_MOCK_R2_PUBLIC = CUTOFFS_DIR / "kcet-2026-mock-round2-cutoffs.pdf"
DEST_R1_PUBLIC = CUTOFFS_DIR / "kcet-2026-round1-cutoffs.pdf"
DEST_R2_PUBLIC = CUTOFFS_DIR / "kcet-2026-round2-cutoffs.pdf"

DEST_MOCK_ROOT = ROOT / "kcet-2026-mock-round1-cutoffs.pdf"
DEST_MOCK_R2_ROOT = ROOT / "kcet-2026-mock-round2-cutoffs.pdf"
DEST_R1_ROOT = ROOT / "kcet-2026-round1-cutoffs.pdf"
DEST_R2_ROOT = ROOT / "kcet-2026-round2-cutoffs.pdf"

ALL_CATEGORIES = {
    '1G', '1K', '1R',
    '2AG', '2AK', '2AR',
    '2BG', '2BK', '2BR',
    '3AG', '3AK', '3AR',
    '3BG', '3BK', '3BR',
    'GM', 'GMK', 'GMR',
    'SCG', 'SCK', 'SCR',
    'STG', 'STK', 'STR',
    'S1G', 'S1K', 'S1R',
    'S2G', 'S2K', 'S2R',
    'S3G', 'S3K', 'S3R',
    'S4G', 'S4K', 'S4R',
    'GMP', 'NRI', 'OPN', 'OTH'
}

# ─── Utility Functions ────────────────────────────────────────────────────────

def clean_text(value):
    if value is None:
        return ""
    text = str(value).replace("\u00a0", " ")
    text = text.replace("\r", " ").replace("\n", " ").replace("\t", " ")
    return re.sub(r"\s+", " ", text).strip()

def parse_rank(value):
    if value is None:
        return None
    s = str(value).strip().replace(',', '').replace('\xa0', '')
    if s in ('', '--', '-', 'nan', 'None', 'NA', 'N/A', 'N.A.', '0'):
        return None
    s = re.sub(r'[^\d.]', '', s)
    if not s:
        return None
    try:
        n = int(float(s))
    except (ValueError, OverflowError):
        return None
    if n < 1 or n > 500000:
        return None
    return n

# ─── PDF Extraction ──────────────────────────────────────────────────────────

def extract_pdf_coordinate_based(pdf_path, year, round_val):
    results = []
    
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        current_code = None
        current_name = None
        last_cat_coords = {}
        last_course_name = None

        for page_idx, page in enumerate(pdf.pages):
            words = page.extract_words(keep_blank_chars=False) or []
            if not words:
                continue
                
            rows = {}
            for w in words:
                y = round(w['top'], 1)
                matched_y = None
                for existing_y in rows:
                    if abs(existing_y - y) <= 2.0:
                        matched_y = existing_y
                        break
                if matched_y is None:
                    matched_y = y
                    rows[matched_y] = []
                rows[matched_y].append(w)
                
            sorted_ys = sorted(rows.keys())
            
            for y in sorted_ys:
                row_words = sorted(rows[y], key=lambda x: x['x0'])
                text_full = " ".join([w['text'] for w in row_words])
                text_clean = clean_text(text_full)

                # 1. College Header
                m = re.search(
                    r'College\s*:?\s*[\(\[]?([A-Z0-9]{3,6})[\)\]]?\s*(.*)',
                    text_clean,
                    re.IGNORECASE
                )
                if m:
                    c = m.group(1).strip()
                    n = m.group(2).strip()
                    n = re.sub(r'^[\(\)]+|[\(\)]+$', '', n).strip()
                    if len(c) >= 3 and re.match(r'^[A-Z0-9]', c):
                        current_code = c
                        current_name = n
                        last_cat_coords = {}
                        last_course_name = None
                        continue

                if not current_code:
                    continue

                # 2. Category Header Row
                upper_words = [w['text'].upper().strip() for w in row_words]
                cat_count = sum(1 for w in upper_words if w in ALL_CATEGORIES)
                
                if cat_count >= 5 or (('COURSE' in text_clean.upper() or 'BRANCH' in text_clean.upper()) and cat_count >= 3):
                    cat_coords = {}
                    for w in row_words:
                        text = w['text'].upper().strip()
                        if text in ALL_CATEGORIES:
                            center_x = (w['x0'] + w['x1']) / 2.0
                            cat_coords[text] = center_x
                    if cat_coords:
                        last_cat_coords = cat_coords
                    continue

                # 3. Data Row
                if not last_cat_coords:
                    continue
                    
                min_cat_x = min(last_cat_coords.values())
                
                course_words = [w for w in row_words if w['x1'] < min_cat_x - 10]
                data_words = [w for w in row_words if w['x1'] >= min_cat_x - 10]

                if not course_words:
                    continue

                course_raw = " ".join([w['text'] for w in course_words])
                course_check = clean_text(course_raw)

                if not course_raw or not course_check:
                    continue
                if course_check.upper() in ('COURSE', 'BRANCH', 'PROGRAMME', 'COURSE NAME', '--', '-', ''):
                    continue
                if re.match(r'^[\d\s\-\.]+$', course_check):
                    continue
                if 'Course' in course_raw and 'GM' not in course_raw:
                    continue

                # Parse ranks
                ranks_found = []
                for w in data_words:
                    val = w['text'].strip()
                    rank = parse_rank(val)
                    if rank is None:
                        continue
                        
                    center_x = (w['x0'] + w['x1']) / 2.0
                    closest_cat = None
                    min_dist = float('inf')
                    
                    for cat, cat_x in last_cat_coords.items():
                        dist = abs(cat_x - center_x)
                        if dist < min_dist:
                            min_dist = dist
                            closest_cat = cat
                            
                    if closest_cat and min_dist < 40:
                        ranks_found.append((closest_cat, rank))

                if ranks_found:
                    for cat, rank in ranks_found:
                        results.append({
                            'institute': current_name,
                            'institute_code': current_code,
                            'course': course_check,
                            'category': cat,
                            'cutoff_rank': rank,
                            'year': year,
                            'round': round_val
                        })
                    last_course_name = course_check
                else:
                    if last_course_name and current_code:
                        new_course_name = last_course_name + " " + course_check
                        updated_count = 0
                        for idx in range(len(results) - 1, -1, -1):
                            entry = results[idx]
                            if entry['institute_code'] == current_code and entry['course'] == last_course_name:
                                entry['course'] = new_course_name
                                updated_count += 1
                            elif entry['institute_code'] != current_code:
                                break
                        if updated_count > 0:
                            last_course_name = new_course_name

    return results

def save_json(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(data):,} records to {filepath}")

def deduplicate(results):
    seen = set()
    unique = []
    for r in results:
        key = (r['institute_code'], r['course'], r['category'], r['year'], r['round'], r['cutoff_rank'])
        if key in seen:
            continue
        seen.add(key)
        unique.append(r)
    return unique

def resolve_pdf_source(preferred_path, fallback_path):
    if preferred_path.exists():
        return preferred_path
    if fallback_path.exists():
        return fallback_path
    return None

def main():
    # Fix Windows console encoding
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

    print("=" * 70)
    print("  Extracting 2026 Cutoff Data with High Precision (Coordinates)")
    print("=" * 70)

    CUTOFFS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Extract Mock 1
    mock_src = resolve_pdf_source(PDF_MOCK, DEST_MOCK_PUBLIC)
    if mock_src:
        print(f"Extracting Mock 1 cutoffs from: {mock_src.name}")
        mock_data = extract_pdf_coordinate_based(mock_src, "2026", "MOCK")
        mock_data = deduplicate(mock_data)
        save_json(mock_data, OUTPUT_MOCK_RAW)
        
        # Ensure copy to canonical paths
        if mock_src != DEST_MOCK_PUBLIC:
            shutil.copy2(mock_src, DEST_MOCK_PUBLIC)
        if mock_src != DEST_MOCK_ROOT:
            shutil.copy2(mock_src, DEST_MOCK_ROOT)
        print(f"Verified Mock 1 PDF at canonical locations")
    else:
        print(f"ERROR: Mock 1 PDF not found!")
        sys.exit(1)

    # 2. Extract Mock 2
    mock_r2_src = resolve_pdf_source(PDF_MOCK_R2, DEST_MOCK_R2_PUBLIC)
    if mock_r2_src:
        print(f"\nExtracting Mock Round 2 cutoffs from: {mock_r2_src.name}")
        mock_r2_data = extract_pdf_coordinate_based(mock_r2_src, "2026", "MOCK2")
        mock_r2_data = deduplicate(mock_r2_data)
        save_json(mock_r2_data, OUTPUT_MOCK_R2_RAW)
        
        # Ensure copy to canonical paths
        if mock_r2_src != DEST_MOCK_R2_PUBLIC:
            shutil.copy2(mock_r2_src, DEST_MOCK_R2_PUBLIC)
        if mock_r2_src != DEST_MOCK_R2_ROOT:
            shutil.copy2(mock_r2_src, DEST_MOCK_R2_ROOT)
        print(f"Copied Mock 2 PDF to canonical locations: {DEST_MOCK_R2_PUBLIC.name} and root")
    else:
        print(f"ERROR: Mock 2 PDF ({PDF_MOCK_R2.name}) not found!")
        sys.exit(1)

    # 3. Extract R1
    r1_src = resolve_pdf_source(PDF_R1, DEST_R1_PUBLIC)
    if r1_src:
        print(f"\nExtracting Round 1 cutoffs from: {r1_src.name}")
        r1_data = extract_pdf_coordinate_based(r1_src, "2026", "R1")
        r1_data = deduplicate(r1_data)
        save_json(r1_data, OUTPUT_R1_RAW)
        
        # Ensure copy to canonical paths
        if r1_src != DEST_R1_PUBLIC:
            shutil.copy2(r1_src, DEST_R1_PUBLIC)
        if r1_src != DEST_R1_ROOT:
            shutil.copy2(r1_src, DEST_R1_ROOT)
        print(f"Verified Round 1 PDF at canonical locations")
    else:
        print(f"ERROR: Round 1 PDF not found!")
        sys.exit(1)

    # 4. Extract R2
    r2_src = resolve_pdf_source(PDF_R2, DEST_R2_PUBLIC)
    if r2_src:
        print(f"\nExtracting Round 2 cutoffs from: {r2_src.name}")
        r2_data = extract_pdf_coordinate_based(r2_src, "2026", "R2")
        r2_data = deduplicate(r2_data)
        save_json(r2_data, OUTPUT_R2_RAW)
        
        # Ensure copy to canonical paths
        if r2_src != DEST_R2_PUBLIC:
            shutil.copy2(r2_src, DEST_R2_PUBLIC)
        if r2_src != DEST_R2_ROOT:
            shutil.copy2(r2_src, DEST_R2_ROOT)
        print(f"Copied Round 2 PDF to canonical locations: {DEST_R2_PUBLIC.name} and root")
    else:
        print(f"ERROR: Round 2 PDF ({PDF_R2.name}) not found!")
        sys.exit(1)

    # 5. Save combined flat list to cutoffs-2026.json
    combined = mock_data + mock_r2_data + r1_data + r2_data
    combined_unique = deduplicate(combined)
    
    with open(OUTPUT_SERVING_2026, 'w', encoding='utf-8') as f:
        json.dump(combined_unique, f, ensure_ascii=False)
    print(f"\nCombined serving 2026 file saved: {OUTPUT_SERVING_2026} ({len(combined_unique):,} entries)")
    print(f"  - Mock 1: {len(mock_data):,}")
    print(f"  - Mock 2: {len(mock_r2_data):,}")
    print(f"  - Round 1: {len(r1_data):,}")
    print(f"  - Round 2: {len(r2_data):,}")
    print("=" * 70)

if __name__ == "__main__":
    main()
