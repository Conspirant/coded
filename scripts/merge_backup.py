#!/usr/bin/env python3
"""
KCET Cutoff MERGED Backup Creator
Combines:
1. Our fresh XLSX extraction
2. Existing kcet_cutoffs_consolidated.json
3. Existing cutoffs.json
To create the most comprehensive backup with accurate course mappings.
"""

import json
import hashlib
from pathlib import Path
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Complete course code mapping
COURSE_MAPPING = {
    "AD": "Artificial Intelligence And Data Science",
    "AE": "Aeronautical Engineering",
    "AI": "Artificial Intelligence and Machine Learning",
    "AR": "Architecture",
    "AT": "Automotive Engineering",
    "AU": "Automobile Engineering",
    "BC": "BTech Computer Technology",
    "BD": "Computer Science Engineering-Big Data",
    "BE": "Bio-Electronics Engineering",
    "BI": "Information Technology and Engineering",
    "BM": "Bio Medical Engineering",
    "BR": "BioMedical and Robotic Engineering",
    "BS": "Bachelor of Science (Honours)",
    "BT": "Bio Technology",
    "CA": "Computer Science Engineering-AI",
    "CB": "Computer Science and Business Systems",
    "CC": "Computer and Communication Engineering",
    "CD": "Computer Science and Design",
    "CE": "Civil Engineering",
    "CF": "Computer Science Engineering-Artificial",
    "CG": "Computer Science and Technology",
    "CH": "Chemical Engineering",
    "CI": "Computer Science and Information",
    "CK": "Civil Engineering (Kannada Medium)",
    "CM": "Electronics Engineering (VLSI Design)",
    "CO": "Computer Engineering",
    "CP": "Civil Engineering and Planning",
    "CR": "Ceramics and Cement Technology",
    "CS": "Computer Science And Engineering",
    "CT": "Construction Technology and Management",
    "CV": "Civil Environmental Engineering",
    "CY": "Computer Science Engineering-Cyber",
    "DC": "Data Sciences",
    "DG": "Design",
    "DM": "Computer Science and Engineering",
    "DS": "Computer Science Engineering-Data",
    "EA": "Agriculture Engineering",
    "EB": "Electronics and Communication (Advanced)",
    "EC": "Electronics and Communication Engineering",
    "EE": "Electrical And Electronics Engineering",
    "EG": "Energy Engineering",
    "EI": "Electronics and Instrumentation Engineering",
    "EL": "Electronics and Instrumentation Technology",
    "EN": "Environmental Engineering",
    "EP": "BTech Technology and Entrepreneurship",
    "ER": "Electrical and Computer Engineering",
    "ES": "Electronics and Computer Engineering",
    "ET": "Electronics and Telecommunication",
    "EV": "Electronics Engineering (VLSI Design)",
    "IB": "Computer Science Engg - IoT including Blockchain",
    "IC": "Computer Science - Internet of Things",
    "IE": "Information Science and Engineering",
    "IG": "Information Technology",
    "II": "Electronics and Communication - Industrial",
    "IM": "Industrial Engineering and Management",
    "IO": "Computer Science Engineering - Internet of Things",
    "IP": "Industrial and Production Engineering",
    "IS": "Information Science and Technology",
    "IT": "Instrumentation Technology",
    "IY": "Computer Science - Information Technology - Cyber Security",
    "LA": "B Plan",
    "LC": "Computer Science Engineering - Block Chain",
    "LJ": "BTech in Computer Science",
    "MC": "Mathematics and Computing",
    "MD": "Medical Electronics",
    "ME": "Mechanical Engineering",
    "MK": "Mechanical Engineering (Kannada Medium)",
    "MM": "Mechanical and Smart Manufacturing",
    "MN": "Mining Engineering",
    "MR": "Marine Engineering",
    "MS": "Manufacturing Science and Engineering",
    "MT": "Mechatronics",
    "NT": "Nano Technology",
    "OP": "Computer Science Engineering - DevOps",
    "OT": "Industrial IoT",
    "PE": "Petrochemical Engineering",
    "PL": "Petroleum Engineering",
    "PM": "Precision Manufacturing",
    "PT": "Polymer Science and Technology",
    "RA": "Robotics and Automation",
    "RB": "Robotics",
    "RI": "Robotics and Artificial Intelligence",
    "RM": "Computer Science - Robotic Engineering - AI",
    "RO": "Automation and Robotics Engineering",
    "SA": "Smart Agritech",
    "SE": "Aerospace Engineering",
    "SS": "Computer Science and System Engineering",
    "ST": "Silk Technology",
    "TC": "Telecommunication Engineering",
    "TE": "Tool Engineering",
    "TX": "Textile Technology",
    "UP": "Planning",
    "UR": "Planning",
    "ZC": "Computer Science",
    "AM": "B Tech in Computer Science & Engg (AI & ML)",
    "BA": "B.Tech (Agricultural Engineering)",
    "BB": "B Tech in Electronics & Communication",
    "BF": "B Tech (Hons) Comp Sci and Engg (Data)",
    "BG": "B Tech in Artificial Intelligence and Data",
    "BH": "B Tech in Artificial Intelligence and ML",
    "BJ": "B Tech in Electrical & Electronics",
    "BK": "B Tech in Energy Engineering",
    "BL": "B Tech in Aerospace Engineering",
    "BN": "B Tech in Computer Science and Tech (Big Data)",
    "BO": "B Tech in Bio-Technology",
    "BP": "B Tech in Civil Engineering",
    "BQ": "B Tech in Computer Science",
    "BU": "B Tech in Computer Science and Information",
    "BV": "B Tech in Computer Engineering",
    "BW": "B Tech in Computer Science",
    "BX": "B Tech in Computer Science and Engg (Cyber)",
    "BY": "B Tech in Computer Science",
    "BZ": "B Tech in Computer Science",
    "CL": "B Tech in Electronics & Computer",
    "CN": "B Tech in Computer Science and Engg (IoT and ...)",
    "CQ": "B Tech in Computer Science",
    "CU": "B Tech in Information Science",
    "CW": "B Tech in Information Technology",
    "CX": "B Tech in Information Science & ...",
    "CZ": "B Tech in Computer Science",
    "DA": "B Tech in Mathematics and Computing",
    "DB": "B Tech in Mechanical Engineering",
    "DD": "B Tech in Mechatronics Engineering",
    "DE": "B Tech in Petroleum Engineering",
    "DF": "B Tech in Robotics and Automation",
    "DH": "B Tech in Robotics and Artificial Intelligence",
    "DI": "B Tech in Robotic Engineering",
    "DJ": "B Tech in Robotics",
    "DK": "B Tech in Computer Science and System",
    "DL": "B Tech in Computer Science",
    "DN": "B Tech in VLSI",
    "LD": "B Tech in Computer Science (Data)",
    "LE": "B Tech in Computer Science (AI & ML)",
    "LF": "B Tech in Computer Science (Cloud)",
    "LG": "B Tech in Computer Science (Cyber)",
    "LH": "B Tech in Computer Science (Information)",
    "LK": "B Tech in Computer Science (Internet of Things)",
}


def make_unique_key(entry):
    """Create a unique key for deduplication."""
    year = entry.get('year')
    inst = entry.get('institute_code') or entry.get('instituteCode') or ''
    course = entry.get('course_code') or entry.get('courseCode') or ''
    cat = entry.get('category') or ''
    rank = entry.get('closing_rank') or entry.get('closingRank') or ''
    rnd = entry.get('round') or ''
    return f"{year}-{inst}-{course}-{cat}-{rank}-{rnd}"


def normalize_entry(entry):
    """Normalize entry to consistent format with accurate course names."""
    year = entry.get('year')
    if isinstance(year, str):
        year = int(year)
    
    course_code = entry.get('course_code') or entry.get('courseCode') or ''
    
    # Get accurate course name from our mapping
    course_name = COURSE_MAPPING.get(course_code, 
                  entry.get('course_name') or entry.get('courseName') or course_code)
    
    inst_code = entry.get('institute_code') or entry.get('instituteCode') or ''
    inst_name = entry.get('institute_name') or entry.get('instituteName') or f"College {inst_code}"
    
    closing_rank = entry.get('closing_rank') or entry.get('closingRank')
    if isinstance(closing_rank, str):
        try:
            closing_rank = int(float(closing_rank.replace(',', '')))
        except:
            closing_rank = 0
    
    category = entry.get('category') or ''
    rnd = entry.get('round') or ''
    
    # Generate consistent ID
    key = make_unique_key(entry)
    record_id = f"{year}-{inst_code}-{course_code}-{category}-{hashlib.md5(key.encode()).hexdigest()[:6]}"
    
    return {
        'id': record_id,
        'year': year,
        'round': rnd,
        'institute_code': inst_code,
        'institute_name': inst_name,
        'course_code': course_code,
        'course_name': course_name,
        'category': category,
        'closing_rank': closing_rank,
        'source': entry.get('source_file') or entry.get('source') or 'merged'
    }


def load_consolidated(path):
    """Load entries from consolidated JSON."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if isinstance(data, dict) and 'cutoffs' in data:
            return data['cutoffs']
        elif isinstance(data, list):
            return data
        else:
            return []
    except Exception as e:
        logger.warning(f"Could not load {path}: {e}")
        return []


def main():
    root = Path(__file__).parent.parent
    
    all_entries = []
    seen_keys = set()
    sources = {}
    
    # 1. Load our fresh backup (priority 1 - most accurate course names)
    backup_path = root / 'public' / 'data' / 'backup_cutoffs.json'
    if backup_path.exists():
        logger.info(f"Loading our backup from {backup_path.name}")
        data = json.load(open(backup_path, 'r', encoding='utf-8'))
        entries = data.get('cutoffs', [])
        for e in entries:
            key = make_unique_key(e)
            if key not in seen_keys:
                seen_keys.add(key)
                all_entries.append(normalize_entry(e))
        sources['backup'] = len(entries)
        logger.info(f"  Loaded {len(entries)} entries, added {len(all_entries)} new")
    
    # 2. Load consolidated file
    cons_path = root / 'public' / 'kcet_cutoffs_consolidated.json'
    if cons_path.exists():
        logger.info(f"Loading consolidated from {cons_path.name}")
        entries = load_consolidated(cons_path)
        added = 0
        for e in entries:
            key = make_unique_key(e)
            if key not in seen_keys:
                seen_keys.add(key)
                all_entries.append(normalize_entry(e))
                added += 1
        sources['consolidated'] = len(entries)
        logger.info(f"  Loaded {len(entries)} entries, added {added} new")
    
    # 3. Load cutoffs.json
    cutoffs_path = root / 'public' / 'data' / 'cutoffs.json'
    if cutoffs_path.exists():
        logger.info(f"Loading cutoffs from {cutoffs_path.name}")
        entries = load_consolidated(cutoffs_path)
        added = 0
        for e in entries:
            key = make_unique_key(e)
            if key not in seen_keys:
                seen_keys.add(key)
                all_entries.append(normalize_entry(e))
                added += 1
        sources['cutoffs'] = len(entries)
        logger.info(f"  Loaded {len(entries)} entries, added {added} new")
    
    logger.info(f"\nTotal merged entries: {len(all_entries)}")
    
    # Calculate stats
    by_year = {}
    by_round = {}
    by_course = {}
    institutes = set()
    
    for e in all_entries:
        by_year[e['year']] = by_year.get(e['year'], 0) + 1
        by_round[e['round']] = by_round.get(e['round'], 0) + 1
        by_course[e['course_code']] = by_course.get(e['course_code'], 0) + 1
        institutes.add(e['institute_code'])
    
    # Save output
    out_dir = root / 'public' / 'data'
    out_dir.mkdir(parents=True, exist_ok=True)
    
    output = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_records': len(all_entries),
            'total_institutes': len(institutes),
            'total_courses': len(by_course),
            'total_categories': len(set(e['category'] for e in all_entries)),
            'years_covered': sorted([int(y) for y in by_year.keys()]),
            'records_by_year': by_year,
            'records_by_round': by_round,
            'sources_merged': sources
        },
        'course_mapping': COURSE_MAPPING,
        'cutoffs': all_entries
    }
    
    out_file = out_dir / 'backup_cutoffs.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Saved to: {out_file}")
    
    # Save course mapping
    with open(out_dir / 'course_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(COURSE_MAPPING, f, indent=2, ensure_ascii=False)
    
    # Summary
    print("\n" + "=" * 70)
    print("MERGED BACKUP COMPLETE")
    print("=" * 70)
    print(f"Total unique records: {len(all_entries)}")
    print(f"Unique institutes: {len(institutes)}")
    print(f"Unique courses: {len(by_course)}")
    print(f"\nRecords by Year: {dict(sorted([(int(k), v) for k, v in by_year.items()]))}")
    print(f"Records by Round: {dict(sorted([(str(k), v) for k, v in by_round.items()]))}")
    print(f"\nSources merged: {sources}")
    print(f"\nTop 15 Courses:")
    for code, count in sorted(by_course.items(), key=lambda x: x[1], reverse=True)[:15]:
        print(f"  {code}: {count:6d} - {COURSE_MAPPING.get(code, 'Unknown')[:45]}")


if __name__ == '__main__':
    main()
