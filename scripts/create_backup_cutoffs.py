#!/usr/bin/env python3
"""
KCET Cutoff FINAL Extractor - v4
Designed to extract 200k+ records by properly handling:
- All 24 category columns (1G, 1K, 1R, 2AG...STR)
- Multiple stacked colleges per sheet
- All sheets across all XLSX files
"""

import pandas as pd
import json
import os
import re
from pathlib import Path
from datetime import datetime
import logging
import hashlib

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

# ALL 24 CATEGORIES from the screenshots - exact match
ALL_CATEGORIES = {
    # Primary 24 categories  
    '1G', '1K', '1R',
    '2AG', '2AK', '2AR',
    '2BG', '2BK', '2BR',
    '3AG', '3AK', '3AR',
    '3BG', '3BK', '3BR',
    'GM', 'GMK', 'GMR',
    'SCG', 'SCK', 'SCR',
    'STG', 'STK', 'STR',
    # Additional categories that may appear
    '2A', '2B', '3A', '3B', 'SC', 'ST',
    'HYK', 'HKK', 'HKR', 'HK',
    'PH', 'NCC', 'EX', 'CAK', 'GMD', 'RU', 'SNQ'
}


def generate_id(year, inst, course, cat, rnd, rank):
    base = f"{year}-{inst}-{course}-{cat}-{rnd}-{rank}"
    return f"{year}-{inst}-{course}-{cat}-{hashlib.md5(base.encode()).hexdigest()[:6]}"


def parse_course(text):
    """Extract course code from text."""
    if pd.isna(text):
        return None, None
    text = str(text).strip()
    if not text or len(text) < 2:
        return None, None
    
    # Skip headers and metadata
    skip_words = ['college', 'course', 'engineering cutoff', 'rank', 'seat', 'karnataka', 
                  'allotment', 'session', 'type', 'table', 'nan', 'unnamed', 'institute',
                  'cutoff', 'general', 'closing', 'course name', 'branch']
    text_lower = text.lower()
    if any(s in text_lower for s in skip_words):
        return None, None
    
    # Pattern: "XX Description" (e.g., "AI Artificial Intelligence")
    match = re.match(r'^([A-Z]{2})\s+(.+)$', text)
    if match:
        code = match.group(1)
        if code in COURSE_MAPPING:
            return code, COURSE_MAPPING[code]
        return code, match.group(2).strip()
    
    # Full name to code mapping
    text_upper = text.upper()
    name_to_code = {
        'COMPUTER SCIENCE AND ENGINEERING': 'CS', 'COMPUTER SCIENCE': 'CS', 'COMPUTERS': 'CS',
        'ELECTRONICS AND COMMUNICATION': 'EC', 'ELECTRONICS': 'EC',
        'MECHANICAL ENGINEERING': 'ME', 'MECHANICAL': 'ME',
        'CIVIL ENGINEERING': 'CE', 'CIVIL': 'CE',
        'ELECTRICAL': 'EE', 'ELECTRICAL AND ELECTRONICS': 'EE', 'EE ELECTRICAL': 'EE',
        'INFORMATION SCIENCE': 'IE', 'INFO.SCIENCE': 'IE', 'INFO SCIENCE': 'IE',
        'CHEMICAL': 'CH', 'BIOTECHNOLOGY': 'BT', 'BIO TECHNOLOGY': 'BT', 'BIO-TECHNOLOGY': 'BT',
        'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI', 'ARTIFICIAL INTELLIGENCE': 'AI',
        'ARTIFICIAL INTEL': 'AI', 'AI ARTIFICIAL': 'AI',
        'DATA SCIENCE': 'AD', 'DATA SCIENCES': 'DC',
        'ARCHITECTURE': 'AR', 'AR ARCHITECTURE': 'AR',
        'MECHATRONICS': 'MT', 'MT MECHATRONICS': 'MT',
        'ROBOTICS AND AUTOMATION': 'RA', 'ROBOTICS': 'RA', 'RA ROBOTICS': 'RA',
        'AEROSPACE': 'SE', 'AERO SPACE': 'SE', 'SE AERO': 'SE',
        'AERONAUTICAL': 'AE', 'AE AERONAUTICAL': 'AE',
        'AUTOMOBILE': 'AU', 'AU AUTOMOBILE': 'AU',
        'AUTOMOTIVE': 'AT', 'AT AUTOMOTIVE': 'AT',
        'BIO MEDICAL': 'BM', 'BIOMEDICAL': 'BM', 'BM BIO': 'BM',
        'CONSTRUCTION TECHNOLOGY': 'CT', 'CT CONSTRUCTION': 'CT',
        'TELECOMMUNICATION': 'TC', 'TC TELECOM': 'TC', 'TELECOMM': 'TC',
        'INDUSTRIAL ENGINEERING': 'IM', 'IM IND': 'IM', 'IND. ENGG': 'IM',
        'MEDICAL ELECTRONICS': 'MD', 'MD MEDICAL': 'MD',
        'COMPUTER AND COMMUNICATION': 'CC', 'CC COMPUTER': 'CC',
        'COMPUTER ENGINEERING': 'CO', 'CO COMPUTER': 'CO',
        'ENVIRONMENTAL': 'EN', 'EN ENVIRONMENTAL': 'EN',
        'MINING': 'MN', 'MN MINING': 'MN',
        'POLYMER': 'PT', 'PT POLYMER': 'PT',
        'SILK TECH': 'ST', 'SILK TECHNOLOGY': 'ST',
        'TEXTILE': 'TX', 'TX TEXTILE': 'TX',
        'PLANNING': 'UP', 'UP PLANNING': 'UP',
        'CYBER SECURITY': 'CY', 'CY CYBER': 'CY', 'CS- CYBER': 'CY',
        'INTERNET OF THINGS': 'IO', 'IOT': 'IO', 'CS- IOT': 'IO',
        'INSTRUMENTATION': 'IT', 'IT INSTRUMENT': 'IT',
        'VLSI': 'EV', 'EV VLSI': 'EV',
        'ELEC. INST': 'EI', 'ELECTRONICS AND INSTRUMENTATION': 'EI',
        'CB CIVIL': 'CE', 'CS COMPUTER': 'CS', 'EC ELECTRON': 'EC', 'ME MECHANICAL': 'ME',
    }
    
    for name, code in name_to_code.items():
        if name in text_upper:
            return code, COURSE_MAPPING.get(code, text)
    
    # Try finding 2-letter code at start
    if len(text) >= 2 and text[:2].isupper() and text[:2].isalpha():
        code = text[:2]
        if code in COURSE_MAPPING:
            return code, COURSE_MAPPING[code]
    
    return None, text


def find_college_code(row):
    """Find college code from any cell in this row."""
    for cell in row:
        if pd.isna(cell):
            continue
        text = str(cell)
        
        # Look for E followed by 3 digits
        match = re.search(r'\b(E\d{3})\b', text)
        if match:
            code = match.group(1)
            # Try to get name
            name_match = re.search(rf'{code}\s+(.+?)(?:\s*\(|\s*$)', text)
            name = name_match.group(1).strip() if name_match else f"College {code}"
            return code, name
        
        # Also check for "College:" prefix
        if 'College' in text and 'E0' in text:
            match = re.search(r'(E\d{3})', text)
            if match:
                return match.group(1), text.split(match.group(1))[-1].strip()[:50]
    
    return None, None


def is_category_header(row):
    """Check if this row is a category header row."""
    cat_count = 0
    cat_positions = {}
    
    for col_idx, cell in enumerate(row):
        if pd.isna(cell):
            continue
        cell_str = str(cell).strip()
        if cell_str in ALL_CATEGORIES:
            cat_count += 1
            cat_positions[col_idx] = cell_str
    
    # Need at least 5 categories to be a valid header (more strict)
    return cat_count >= 5, cat_positions


def extract_sheet(df, year, round_info, source_file):
    """Extract all cutoff data from a sheet."""
    records = []
    
    current_college = None
    current_college_name = None
    current_categories = {}  # col_idx -> category
    
    for row_idx in range(len(df)):
        row = df.iloc[row_idx]
        
        # Check for college info
        college_code, college_name = find_college_code(row)
        if college_code:
            current_college = college_code
            current_college_name = college_name
            continue  # Don't try to parse this as data
        
        # Check if this is a category header row
        is_header, cat_positions = is_category_header(row)
        if is_header:
            current_categories = cat_positions
            continue
        
        # Skip if we don't have college and categories yet
        if not current_college or not current_categories:
            continue
        
        # Try to parse this as a data row
        course_cell = row.iloc[0] if len(row) > 0 else None
        course_code, course_name = parse_course(course_cell)
        
        if not course_code:
            continue
        
        # Extract all cutoff values for this course
        for col_idx, category in current_categories.items():
            if col_idx >= len(row):
                continue
            
            val = row.iloc[col_idx]
            if pd.isna(val):
                continue
            
            val_str = str(val).strip().replace(',', '')
            
            # Skip non-numeric values
            if val_str in ['--', '-', '', 'NA', 'N/A', 'nan', 'NaN']:
                continue
            
            try:
                closing_rank = int(float(val_str))
                if 0 < closing_rank < 500000:
                    record = {
                        'id': generate_id(year, current_college, course_code, category, round_info, closing_rank),
                        'year': year,
                        'round': round_info,
                        'institute_code': current_college,
                        'institute_name': current_college_name or f"College {current_college}",
                        'course_code': course_code,
                        'course_name': course_name if course_name else COURSE_MAPPING.get(course_code, course_code),
                        'category': category,
                        'closing_rank': closing_rank,
                        'source_file': source_file
                    }
                    records.append(record)
            except (ValueError, TypeError):
                pass
    
    return records


def parse_filename(filename):
    """Extract year and round info from filename."""
    year_match = re.search(r'20\d{2}', filename)
    year = int(year_match.group()) if year_match else 2024
    
    fl = filename.lower()
    if 'mock' in fl:
        if 'round2' in fl:
            return year, 'MOCK'
        return year, 'MOCK'
    elif 'round3' in fl or 'extended' in fl:
        return year, 'EXT'
    elif 'round2' in fl:
        return year, 'R2'
    else:
        return year, 'R1'


def process_file(file_path):
    """Process all sheets in an XLSX file."""
    filename = os.path.basename(file_path)
    logger.info(f"Processing: {filename}")
    
    year, round_info = parse_filename(filename)
    all_records = []
    
    try:
        xl = pd.ExcelFile(file_path)
        total_sheets = len(xl.sheet_names)
        logger.info(f"  Sheets: {total_sheets}")
        
        for idx, sheet_name in enumerate(xl.sheet_names):
            try:
                df = xl.parse(sheet_name, header=None)
                if df.empty:
                    continue
                
                records = extract_sheet(df, year, round_info, filename)
                all_records.extend(records)
                
                if (idx + 1) % 10 == 0 or idx == total_sheets - 1:
                    logger.info(f"    Processed {idx + 1}/{total_sheets} sheets, {len(all_records)} records")
                    
            except Exception as e:
                logger.warning(f"    Error in sheet {sheet_name}: {e}")
        
        logger.info(f"  Total from {filename}: {len(all_records)} records")
        
    except Exception as e:
        logger.error(f"Error processing {filename}: {e}")
        import traceback
        traceback.print_exc()
    
    return all_records


def main():
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    
    xlsx_files = sorted(root_dir.glob('kcet-*.xlsx'))
    
    if not xlsx_files:
        logger.error("No XLSX files found")
        return
    
    logger.info(f"Found {len(xlsx_files)} XLSX files to process")
    for f in xlsx_files:
        logger.info(f"  - {f.name}")
    
    all_records = []
    files_processed = []
    
    for f in xlsx_files:
        try:
            records = process_file(str(f))
            all_records.extend(records)
            files_processed.append(f.name)
        except Exception as e:
            logger.error(f"Failed to process {f.name}: {e}")
    
    logger.info(f"\nTotal raw records: {len(all_records)}")
    
    # Deduplicate
    seen_ids = set()
    unique_records = []
    for r in all_records:
        if r['id'] not in seen_ids:
            seen_ids.add(r['id'])
            unique_records.append(r)
    
    logger.info(f"Unique records after dedup: {len(unique_records)}")
    
    # Calculate stats
    by_year = {}
    by_round = {}
    by_course = {}
    
    for r in unique_records:
        by_year[r['year']] = by_year.get(r['year'], 0) + 1
        by_round[r['round']] = by_round.get(r['round'], 0) + 1
        by_course[r['course_code']] = by_course.get(r['course_code'], 0) + 1
    
    # Create output
    out_dir = root_dir / 'public' / 'data'
    out_dir.mkdir(parents=True, exist_ok=True)
    
    output = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_records': len(unique_records),
            'files_processed': files_processed,
            'years_covered': sorted(set(r['year'] for r in unique_records)),
            'records_by_year': by_year,
            'records_by_round': by_round
        },
        'course_mapping': COURSE_MAPPING,
        'cutoffs': unique_records
    }
    
    out_file = out_dir / 'backup_cutoffs.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Saved to: {out_file}")
    
    # Save mapping
    with open(out_dir / 'course_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(COURSE_MAPPING, f, indent=2, ensure_ascii=False)
    
    # Summary
    print("\n" + "=" * 70)
    print("EXTRACTION COMPLETE")
    print("=" * 70)
    print(f"Files processed: {len(files_processed)}")
    print(f"Total unique records: {len(unique_records)}")
    print(f"\nRecords by Year: {dict(sorted(by_year.items()))}")
    print(f"Records by Round: {dict(sorted(by_round.items()))}")
    print(f"\nTop 20 Courses:")
    for code, count in sorted(by_course.items(), key=lambda x: x[1], reverse=True)[:20]:
        print(f"  {code}: {count:6d} - {COURSE_MAPPING.get(code, 'Unknown')[:40]}")


if __name__ == '__main__':
    main()
