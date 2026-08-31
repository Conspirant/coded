"""
NEET 2026 Karnataka - Complete PDF Extraction Pipeline
======================================================
Extracts data from:
1. Medical Final Allotment (pdfplumber tables)
2. Medical Mock Allotment (pdfplumber tables)
3. Dental Final Allotment (pdfplumber tables)
4. Dental Mock Allotment (pdfplumber tables)
5. Dental Fee Structure (pdfplumber text parsing)
6. MBBS Fee Structure (OCR via pytesseract + pdf2image, fallback to manual)

Output: JSON files in root folder for frontend consumption.
"""
import pdfplumber
import json
import os
import re
import sys
import time

ROOT = r"c:\Users\risha\OneDrive\Desktop\coded-main"

# ============================================================
# PART 1: ALLOTMENT LIST EXTRACTION (4 PDFs, identical format)
# ============================================================
# Columns: SL.NO | All India Rank | Course Code | Name of College | Course Name | Allotted Category | Course_fees | Status

def extract_allotment_pdf(filepath, label):
    """Extract allotment data from a KEA NEET seat allotment PDF."""
    print(f"\n{'='*60}")
    print(f"Extracting: {label}")
    print(f"File: {os.path.basename(filepath)}")
    
    rows = []
    seen_sl = set()
    
    with pdfplumber.open(filepath) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total pages: {total_pages}")
        
        for page_idx, page in enumerate(pdf.pages):
            if page_idx % 100 == 0:
                print(f"  Processing page {page_idx + 1}/{total_pages}...")
            
            tables = page.extract_tables()
            if not tables:
                continue
            
            for table in tables:
                for row in table:
                    if not row or len(row) < 8:
                        continue
                    
                    sl_no = (row[0] or '').strip()
                    
                    # Skip header rows
                    if sl_no in ('SL.NO', 'SL. NO', 'Sl.No', '') or 'SL' in sl_no.upper():
                        continue
                    
                    # Validate SL.NO is numeric
                    try:
                        sl_int = int(sl_no)
                    except (ValueError, TypeError):
                        continue
                    
                    # Skip duplicates (header repeats on every page)
                    if sl_int in seen_sl:
                        continue
                    seen_sl.add(sl_int)
                    
                    # Clean newlines from cell values
                    def clean(val):
                        if val is None:
                            return ''
                        return re.sub(r'\s+', ' ', val.strip())
                    
                    rank = clean(row[1])
                    course_code = clean(row[2])
                    college_name = clean(row[3])
                    course_name = clean(row[4])
                    allotted_category = clean(row[5])
                    course_fees = clean(row[6])
                    status = clean(row[7])
                    
                    # Parse rank and fees to integers
                    try:
                        rank_int = int(rank)
                    except:
                        rank_int = None
                    
                    try:
                        fees_int = int(course_fees)
                    except:
                        fees_int = None
                    
                    # Determine seat type from course code suffix and course name
                    # Course code patterns: M001MG (MBBS-GOVT), M036MP (MBBS-PRIV), M003MN (MBBS-NRI)
                    # D101DG (BDS-GOVT), D661DP (BDS-PRIV), etc.
                    seat_type = 'Unknown'
                    if course_name:
                        cn_upper = course_name.upper()
                        if 'GOVT' in cn_upper:
                            seat_type = 'Government'
                        elif 'PRIV' in cn_upper:
                            seat_type = 'Private'
                        elif 'NRI' in cn_upper:
                            seat_type = 'NRI'
                        elif 'MGMT' in cn_upper or 'MANAGEMENT' in cn_upper:
                            seat_type = 'Management'
                    
                    # Determine course type
                    course_type = 'Unknown'
                    if 'MBBS' in (course_name or '').upper():
                        course_type = 'MBBS'
                    elif 'BDS' in (course_name or '').upper():
                        course_type = 'BDS'
                    
                    # Extract college code (first part before course suffix)
                    college_code = course_code[:4] if course_code else ''
                    
                    rows.append({
                        'sl_no': sl_int,
                        'all_india_rank': rank_int,
                        'course_code': course_code,
                        'college_code': college_code,
                        'college_name': college_name,
                        'course_name': course_name,
                        'course_type': course_type,
                        'seat_type': seat_type,
                        'allotted_category': allotted_category,
                        'course_fees': fees_int,
                        'status': status,
                    })
    
    # Sort by SL.NO
    rows.sort(key=lambda x: x['sl_no'])
    print(f"  Total records extracted: {len(rows)}")
    
    # Quick stats
    categories = {}
    for r in rows:
        cat = r['allotted_category']
        categories[cat] = categories.get(cat, 0) + 1
    print(f"  Categories: {dict(sorted(categories.items(), key=lambda x: -x[1]))}")
    
    seat_types = {}
    for r in rows:
        st = r['seat_type']
        seat_types[st] = seat_types.get(st, 0) + 1
    print(f"  Seat types: {dict(sorted(seat_types.items(), key=lambda x: -x[1]))}")
    
    if rows:
        print(f"  Rank range: {rows[0]['all_india_rank']} - {rows[-1]['all_india_rank']}")
    
    return rows


# ============================================================
# PART 2: DENTAL FEE STRUCTURE (text-based extraction)
# ============================================================

def extract_dental_fee(filepath):
    """Extract dental fee structure from text-based PDF."""
    print(f"\n{'='*60}")
    print(f"Extracting: Dental Fee Structure")
    
    all_text = ''
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                all_text += text + '\n'
    
    lines = all_text.strip().split('\n')
    
    colleges = []
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip headers and notes
        if not line or 'Karnataka Examinations' in line or 'Dental COLLEGE-WISE' in line or \
           'NOTE:' in line or 'COLLEGE' in line.upper() and 'CODE' in line.upper() or \
           line == 'CODE' or 'SL ' in line and 'COLLEGE NAME' in line or \
           'ALL FEES' in line or 'Fees Includes' in line:
            i += 1
            continue
        
        # Try to match a row starting with SL number
        # Pattern: SL_NO CODE CollegeName CollegeType GovtFees PrivateFees MgmtFees NRIFees
        # Some colleges span multiple lines
        
        # Check if line starts with a number (SL NO)
        match = re.match(r'^(\d+)\s+([A-Z]\d+)\s+(.+)', line)
        if match:
            sl_no = int(match.group(1))
            college_code = match.group(2)
            rest = match.group(3)
            
            # College name may span multiple lines until we find the fee numbers
            full_rest = rest
            
            # Check if this line has the fees already
            # Look for the pattern: CollegeType FeeNumbers
            fee_pattern = r'(Government|Minority\s*\(L,R\)|Minority\s*\(L\)|Private UnAided|Private/\s*Deemed Univer)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)'
            
            fee_match = re.search(fee_pattern, full_rest)
            
            if not fee_match:
                # Fees might be on the next line(s)
                while i + 1 < len(lines):
                    i += 1
                    next_line = lines[i].strip()
                    
                    # Skip page numbers
                    if re.match(r'^\d+$', next_line) and int(next_line) < 10:
                        continue
                    
                    full_rest += ' ' + next_line
                    fee_match = re.search(fee_pattern, full_rest)
                    if fee_match:
                        break
            
            if fee_match:
                college_type = fee_match.group(1).strip()
                govt_fees = int(fee_match.group(2))
                private_fees = int(fee_match.group(3))
                management_fees = int(fee_match.group(4))
                nri_fees = int(fee_match.group(5))
                
                # College name is everything before the college type
                college_name = full_rest[:fee_match.start()].strip()
                # Clean up
                college_name = re.sub(r'\s+', ' ', college_name).strip(' ,')
                
                colleges.append({
                    'sl_no': sl_no,
                    'college_code': college_code,
                    'college_name': college_name,
                    'college_type': college_type,
                    'govt_fees': govt_fees,
                    'private_fees': private_fees,
                    'management_fees': management_fees,
                    'nri_fees': nri_fees,
                    'course': 'BDS',
                })
        
        i += 1
    
    print(f"  Total colleges extracted: {len(colleges)}")
    for c in colleges:
        print(f"    {c['sl_no']:3d}. [{c['college_code']}] {c['college_name'][:50]:50s} | G:{c['govt_fees']:>8d} P:{c['private_fees']:>8d} M:{c['management_fees']:>8d} N:{c['nri_fees']:>8d}")
    
    return colleges


# ============================================================
# PART 3: MBBS FEE STRUCTURE (OCR-based or manual)
# ============================================================

def extract_mbbs_fee_ocr(filepath):
    """Try OCR extraction for MBBS fee structure. Falls back to manual data from screenshot."""
    print(f"\n{'='*60}")
    print(f"Extracting: MBBS Fee Structure (OCR)")
    
    # Try OCR first
    try:
        from pdf2image import convert_from_path
        import pytesseract
        
        # Check poppler
        images = convert_from_path(filepath, dpi=300)
        print(f"  Converted {len(images)} pages to images")
        
        all_text = ''
        for idx, img in enumerate(images):
            print(f"  OCR page {idx+1}...")
            # Use table-friendly OCR config
            text = pytesseract.image_to_string(img, config='--psm 6')
            all_text += text + '\n'
            print(f"  Page {idx+1} extracted {len(text)} chars")
        
        # Parse OCR text
        return parse_mbbs_fee_text(all_text)
        
    except Exception as e:
        print(f"  OCR failed: {e}")
        print(f"  Using manual data from screenshot reference...")
        return extract_mbbs_fee_manual()


def parse_mbbs_fee_text(text):
    """Parse the OCR'd MBBS fee text."""
    lines = text.strip().split('\n')
    colleges = []
    
    for line in lines:
        # Try to match: SL CollegeCode CollegeName CollegeType GovtFees PrivateFees MgmtFees NRIFees
        # The OCR text format might vary, so try multiple patterns
        match = re.match(r'(\d+)\s+([A-Z]\d+)\s+(.+?)\s+(Government|Minority.*?|Private.*?|Deemed.*?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)', line)
        if match:
            colleges.append({
                'sl_no': int(match.group(1)),
                'college_code': match.group(2),
                'college_name': match.group(3).strip(),
                'college_type': match.group(4).strip(),
                'govt_fees': int(match.group(5)),
                'private_fees': int(match.group(6)),
                'management_fees': int(match.group(7)),
                'nri_fees': int(match.group(8)),
                'course': 'MBBS',
            })
    
    return colleges


def extract_mbbs_fee_manual():
    """Manual entry from screenshot data - the visible rows from the user's screenshot."""
    # Data transcribed from the user's screenshot of the MBBS fee structure
    # This covers the first ~16 rows visible + will be extended from OCR if possible
    data = [
        (1, 'M001', 'Bangalore Medical College,NO-2, Fort, K R ROAD,Bangalore', 'Government', 64350, 0, 0, 0),
        (2, 'M021', 'Mysore Medical College,Irwin Road,Mysore', 'Government', 64350, 0, 2509350, 2509350),
        (3, 'M024', 'Mandya Institute of Medical Sciences,District Hospital,Mandya', 'Government', 64350, 0, 2509350, 2509350),
        (4, 'M025', 'Hassan Institute of Medical Sciences,Near Chamarajendra Hospital,Hassan', 'Government', 64350, 0, 2509350, 2509350),
        (5, 'M031', 'Karnataka Institute of Medical Sciences,Vidyanagar,Hubli', 'Government', 64350, 0, 2509350, 2509350),
        (6, 'M037', 'Belgaum Institute of Medical Sciences,Dr B R Ambedkar Road,Belgaum', 'Government', 64350, 0, 2509350, 2509350),
        (7, 'M041', 'Vijayanagar Institute of Medical Sciences,Cantonment,Bellary', 'Government', 64350, 0, 2509350, 2509350),
        (8, 'M044', 'Bidar Institute of Medical Sciences,Udgir Road,Bidar', 'Government', 64350, 0, 2509350, 2509350),
        (9, 'M045', 'Raichur Institute of Medical Sciences,Sy No 307 & 308,Raichur', 'Government', 64350, 0, 2509350, 2509350),
        (10, 'M083', 'Shimoga Institute of Medical Sciences,Sagar Road,Shimoga', 'Government', 64350, 0, 0, 0),
        (11, 'M096', 'ESI Medical College,Rajajinagar,Bangalore', 'Government', 109350, 0, 0, 0),
        (12, 'M070', 'ESI Medical College,Sedam Road,Gulbarga', 'Government', 109350, 0, 0, 0),
        (13, 'M072', 'Gulbarga Institute of Medical Sciences,VIRESHNAGAR SEDAM ROAD,GULBARGA', 'Government', 64350, 0, 2509350, 2509350),
        (14, 'M073', 'Koppal Institute of Medical Sciences,GANGAVATI ROAD,KIDDIDAL GATE,KOPPAL', 'Government', 64350, 0, 2509350, 2509350),
        (15, 'M074', 'K.H. Patil Institute of Medical Sciences (previously Gadag Institute of Medical Sciences,Malusamudra, Mulugund Road,Gadag)', 'Government', 64350, 0, 2509350, 2509350),
        (16, 'M075', 'Chamarajanagar Institute of Medical Science,SURVEY NO 124,YADAPURA CHAMARAJANAGAR', 'Government', 64350, 0, 0, 0),
    ]
    
    colleges = []
    for row in data:
        colleges.append({
            'sl_no': row[0],
            'college_code': row[1],
            'college_name': row[2],
            'college_type': row[3],
            'govt_fees': row[4],
            'private_fees': row[5],
            'management_fees': row[6],
            'nri_fees': row[7],
            'course': 'MBBS',
        })
    
    print(f"  Manual entries loaded: {len(colleges)} (partial - from screenshot)")
    print(f"  NOTE: This is a partial dataset from the visible screenshot rows.")
    print(f"         Install Tesseract OCR + Poppler for full extraction.")
    return colleges


# ============================================================
# PART 4: DERIVE CUTOFF DATA FROM ALLOTMENT LISTS
# ============================================================

def derive_cutoffs(allotment_data, label):
    """
    Derive college-wise closing ranks (cutoffs) from allotment data.
    Cutoff = highest (worst) rank allotted for each college + category + seat type combination.
    """
    print(f"\n{'='*60}")
    print(f"Deriving cutoffs: {label}")
    
    # Group by (college_code, course_code, allotted_category)
    groups = {}
    for row in allotment_data:
        key = (row['course_code'], row['allotted_category'])
        if key not in groups:
            groups[key] = {
                'course_code': row['course_code'],
                'college_code': row['college_code'],
                'college_name': row['college_name'],
                'course_name': row['course_name'],
                'course_type': row['course_type'],
                'seat_type': row['seat_type'],
                'allotted_category': row['allotted_category'],
                'course_fees': row['course_fees'],
                'allotted_ranks': [],
            }
        if row['all_india_rank'] is not None:
            groups[key]['allotted_ranks'].append(row['all_india_rank'])
    
    cutoffs = []
    for key, group in groups.items():
        ranks = sorted(group['allotted_ranks'])
        if not ranks:
            continue
        
        cutoffs.append({
            'course_code': group['course_code'],
            'college_code': group['college_code'],
            'college_name': group['college_name'],
            'course_name': group['course_name'],
            'course_type': group['course_type'],
            'seat_type': group['seat_type'],
            'allotted_category': group['allotted_category'],
            'course_fees': group['course_fees'],
            'opening_rank': ranks[0],
            'closing_rank': ranks[-1],
            'total_allotted': len(ranks),
        })
    
    # Sort by closing rank
    cutoffs.sort(key=lambda x: x['closing_rank'])
    
    print(f"  Total cutoff entries: {len(cutoffs)}")
    
    # Sample output
    for c in cutoffs[:5]:
        print(f"    {c['course_code']:10s} {c['allotted_category']:6s} | Open: {c['opening_rank']:>8d} Close: {c['closing_rank']:>8d} | Seats: {c['total_allotted']}")
    print(f"    ...")
    for c in cutoffs[-3:]:
        print(f"    {c['course_code']:10s} {c['allotted_category']:6s} | Open: {c['opening_rank']:>8d} Close: {c['closing_rank']:>8d} | Seats: {c['total_allotted']}")
    
    return cutoffs


# ============================================================
# MAIN EXECUTION
# ============================================================

def main():
    start = time.time()
    output = {}
    
    # 1. Extract all 4 allotment lists
    allotment_files = {
        'medical_r1_final': 'UGNEET -2026 MEDICAL 1st ROUND FINAL SEAT ALLOTMENT LIST.pdf',
        'medical_r1_mock': 'UGNEET -2026 MEDICAL 1st ROUND MOCK SEAT ALLOTMENT LIST [17-08-2026].pdf',
        'dental_r1_final': 'UGNEET -2026 DENTAL 1st ROUND FINAL SEAT ALLOTMENT LIST.pdf',
        'dental_r1_mock': 'UGNEET -2026 DENTAL 1st ROUND MOCK SEAT ALLOTMENT LIST [17-08-2026].pdf',
    }
    
    for key, filename in allotment_files.items():
        path = os.path.join(ROOT, filename)
        if os.path.exists(path):
            data = extract_allotment_pdf(path, key)
            output[f'allotment_{key}'] = data
            
            # Derive cutoffs
            cutoffs = derive_cutoffs(data, key)
            output[f'cutoffs_{key}'] = cutoffs
        else:
            print(f"\nFILE NOT FOUND: {filename}")
    
    # 2. Extract dental fee structure
    dental_fee_path = os.path.join(ROOT, "dental fee_removed.pdf")
    if os.path.exists(dental_fee_path):
        dental_fees = extract_dental_fee(dental_fee_path)
        output['fee_structure_dental'] = dental_fees
    
    # 3. Extract MBBS fee structure (OCR or manual)
    mbbs_fee_path = os.path.join(ROOT, "mbbs college wise fee_removed.pdf")
    if os.path.exists(mbbs_fee_path):
        mbbs_fees = extract_mbbs_fee_ocr(mbbs_fee_path)
        output['fee_structure_mbbs'] = mbbs_fees
    
    # 4. Build unified fee lookup
    all_fees = output.get('fee_structure_dental', []) + output.get('fee_structure_mbbs', [])
    output['fee_structure_all'] = all_fees
    
    # ============================================================
    # SAVE OUTPUT FILES
    # ============================================================
    
    # Save individual files
    files_saved = []
    
    for key in ['allotment_medical_r1_final', 'allotment_medical_r1_mock', 
                'allotment_dental_r1_final', 'allotment_dental_r1_mock']:
        if key in output:
            outpath = os.path.join(ROOT, f"neet_2026_{key}.json")
            with open(outpath, 'w', encoding='utf-8') as f:
                json.dump(output[key], f, indent=2, ensure_ascii=False)
            files_saved.append((outpath, len(output[key])))
    
    for key in ['cutoffs_medical_r1_final', 'cutoffs_medical_r1_mock',
                'cutoffs_dental_r1_final', 'cutoffs_dental_r1_mock']:
        if key in output:
            outpath = os.path.join(ROOT, f"neet_2026_{key}.json")
            with open(outpath, 'w', encoding='utf-8') as f:
                json.dump(output[key], f, indent=2, ensure_ascii=False)
            files_saved.append((outpath, len(output[key])))
    
    # Save fee structures
    for key in ['fee_structure_dental', 'fee_structure_mbbs', 'fee_structure_all']:
        if key in output:
            outpath = os.path.join(ROOT, f"neet_2026_{key}.json")
            with open(outpath, 'w', encoding='utf-8') as f:
                json.dump(output[key], f, indent=2, ensure_ascii=False)
            files_saved.append((outpath, len(output[key])))
    
    # Save a combined master file
    master = {
        'metadata': {
            'year': 2026,
            'exam': 'NEET UG',
            'authority': 'KEA - Karnataka Examinations Authority',
            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'source_files': list(allotment_files.values()) + ['dental fee_removed.pdf', 'mbbs college wise fee_removed.pdf'],
        },
        'summary': {
            'medical_final_allotments': len(output.get('allotment_medical_r1_final', [])),
            'medical_mock_allotments': len(output.get('allotment_medical_r1_mock', [])),
            'dental_final_allotments': len(output.get('allotment_dental_r1_final', [])),
            'dental_mock_allotments': len(output.get('allotment_dental_r1_mock', [])),
            'medical_final_cutoff_entries': len(output.get('cutoffs_medical_r1_final', [])),
            'dental_final_cutoff_entries': len(output.get('cutoffs_dental_r1_final', [])),
            'dental_fee_colleges': len(output.get('fee_structure_dental', [])),
            'mbbs_fee_colleges': len(output.get('fee_structure_mbbs', [])),
        },
        'cutoffs_medical_r1_final': output.get('cutoffs_medical_r1_final', []),
        'cutoffs_medical_r1_mock': output.get('cutoffs_medical_r1_mock', []),
        'cutoffs_dental_r1_final': output.get('cutoffs_dental_r1_final', []),
        'cutoffs_dental_r1_mock': output.get('cutoffs_dental_r1_mock', []),
        'fee_structure': output.get('fee_structure_all', []),
    }
    
    master_path = os.path.join(ROOT, "neet_2026_master.json")
    with open(master_path, 'w', encoding='utf-8') as f:
        json.dump(master, f, indent=2, ensure_ascii=False)
    files_saved.append((master_path, 'master'))
    
    elapsed = time.time() - start
    
    print(f"\n\n{'='*60}")
    print(f"EXTRACTION COMPLETE in {elapsed:.1f}s")
    print(f"{'='*60}")
    print(f"\nFiles saved:")
    for path, count in files_saved:
        size = os.path.getsize(path)
        print(f"  {os.path.basename(path):50s} | Records: {str(count):>6s} | Size: {size/1024:.1f}KB")
    
    print(f"\nSummary:")
    for k, v in master['summary'].items():
        print(f"  {k}: {v}")


if __name__ == '__main__':
    main()
