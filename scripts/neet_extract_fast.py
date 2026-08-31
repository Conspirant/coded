"""
NEET 2026 - Fast extraction: Process each PDF individually with streaming.
Step 1: Extract the two smaller files first (dental fee + dental allotments).
"""
import pdfplumber
import json
import os
import re
import time
import gc

ROOT = r"c:\Users\risha\OneDrive\Desktop\coded-main"

def clean(val):
    if val is None:
        return ''
    return re.sub(r'\s+', ' ', val.strip())

def extract_allotment(filepath, label):
    """Stream-extract allotment data one page at a time."""
    print(f"[{label}] Starting extraction from {os.path.basename(filepath)}")
    rows = []
    seen_sl = set()
    
    pdf = pdfplumber.open(filepath)
    total = len(pdf.pages)
    print(f"[{label}] {total} pages")
    
    for pi in range(total):
        if pi % 50 == 0:
            print(f"[{label}] Page {pi+1}/{total}...")
        
        page = pdf.pages[pi]
        tables = page.extract_tables()
        
        for table in (tables or []):
            for row in table:
                if not row or len(row) < 8:
                    continue
                sl = (row[0] or '').strip()
                if not sl.isdigit():
                    continue
                sl_int = int(sl)
                if sl_int in seen_sl:
                    continue
                seen_sl.add(sl_int)
                
                rank_str = clean(row[1])
                course_code = clean(row[2])
                college_name = clean(row[3])
                course_name = clean(row[4])
                category = clean(row[5])
                fees_str = clean(row[6])
                status = clean(row[7])
                
                rank = int(rank_str) if rank_str.isdigit() else None
                fees = int(fees_str) if fees_str.isdigit() else None
                
                seat_type = 'Unknown'
                cn = (course_name or '').upper()
                if 'GOVT' in cn: seat_type = 'Government'
                elif 'PRIV' in cn: seat_type = 'Private'
                elif 'NRI' in cn: seat_type = 'NRI'
                
                course_type = 'MBBS' if 'MBBS' in cn else ('BDS' if 'BDS' in cn else 'Unknown')
                
                rows.append({
                    'sl_no': sl_int,
                    'all_india_rank': rank,
                    'course_code': course_code,
                    'college_code': course_code[:4] if course_code else '',
                    'college_name': college_name,
                    'course_name': course_name,
                    'course_type': course_type,
                    'seat_type': seat_type,
                    'allotted_category': category,
                    'course_fees': fees,
                    'status': status,
                })
        
        # Free page memory
        page.flush_cache()
    
    pdf.close()
    rows.sort(key=lambda x: x['sl_no'])
    print(f"[{label}] Extracted {len(rows)} records")
    return rows

def derive_cutoffs(data):
    groups = {}
    for r in data:
        key = (r['course_code'], r['allotted_category'])
        if key not in groups:
            groups[key] = {**{k: r[k] for k in ['course_code','college_code','college_name','course_name','course_type','seat_type','allotted_category','course_fees']}, 'ranks': []}
        if r['all_india_rank']:
            groups[key]['ranks'].append(r['all_india_rank'])
    
    cutoffs = []
    for key, g in groups.items():
        ranks = sorted(g['ranks'])
        if not ranks:
            continue
        cutoffs.append({
            'course_code': g['course_code'],
            'college_code': g['college_code'],
            'college_name': g['college_name'],
            'course_name': g['course_name'],
            'course_type': g['course_type'],
            'seat_type': g['seat_type'],
            'allotted_category': g['allotted_category'],
            'course_fees': g['course_fees'],
            'opening_rank': ranks[0],
            'closing_rank': ranks[-1],
            'total_allotted': len(ranks),
        })
    cutoffs.sort(key=lambda x: x['closing_rank'])
    return cutoffs

def extract_dental_fee():
    path = os.path.join(ROOT, "dental fee_removed.pdf")
    print(f"[dental_fee] Extracting from {os.path.basename(path)}")
    
    all_text = ''
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                all_text += t + '\n'
    
    lines = all_text.strip().split('\n')
    colleges = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        match = re.match(r'^(\d+)\s+([A-Z]\d+)\s+(.+)', line)
        if match:
            sl_no = int(match.group(1))
            code = match.group(2)
            rest = match.group(3)
            full = rest
            
            fee_pat = r'(Government|Minority\s*\(L,R\)|Minority\s*\(L\)|Private UnAided|Private/\s*Deemed Univer)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)'
            fm = re.search(fee_pat, full)
            
            if not fm:
                while i + 1 < len(lines):
                    i += 1
                    nl = lines[i].strip()
                    if re.match(r'^\d+$', nl) and int(nl) < 10:
                        continue
                    full += ' ' + nl
                    fm = re.search(fee_pat, full)
                    if fm:
                        break
            
            if fm:
                colleges.append({
                    'sl_no': sl_no,
                    'college_code': code,
                    'college_name': re.sub(r'\s+', ' ', full[:fm.start()]).strip(' ,'),
                    'college_type': fm.group(1).strip(),
                    'govt_fees': int(fm.group(2)),
                    'private_fees': int(fm.group(3)),
                    'management_fees': int(fm.group(4)),
                    'nri_fees': int(fm.group(5)),
                    'course': 'BDS',
                })
        i += 1
    
    print(f"[dental_fee] Extracted {len(colleges)} colleges")
    return colleges

def save_json(data, filename):
    path = os.path.join(ROOT, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    size = os.path.getsize(path)
    print(f"  Saved {filename} ({len(data)} records, {size/1024:.1f}KB)")
    return path

# ==================== MAIN ====================
start = time.time()

# Step 1: Dental fee (smallest)
dental_fees = extract_dental_fee()
save_json(dental_fees, 'neet_2026_fee_structure_dental.json')
gc.collect()

# Step 2: Dental allotments (131 pages each)
for key, filename in [
    ('dental_r1_final', 'UGNEET -2026 DENTAL 1st ROUND FINAL SEAT ALLOTMENT LIST.pdf'),
    ('dental_r1_mock', 'UGNEET -2026 DENTAL 1st ROUND MOCK SEAT ALLOTMENT LIST [17-08-2026].pdf'),
]:
    path = os.path.join(ROOT, filename)
    data = extract_allotment(path, key)
    save_json(data, f'neet_2026_allotment_{key}.json')
    cutoffs = derive_cutoffs(data)
    save_json(cutoffs, f'neet_2026_cutoffs_{key}.json')
    del data, cutoffs
    gc.collect()

# Step 3: Medical allotments (600+ pages each)
for key, filename in [
    ('medical_r1_final', 'UGNEET -2026 MEDICAL 1st ROUND FINAL SEAT ALLOTMENT LIST.pdf'),
    ('medical_r1_mock', 'UGNEET -2026 MEDICAL 1st ROUND MOCK SEAT ALLOTMENT LIST [17-08-2026].pdf'),
]:
    path = os.path.join(ROOT, filename)
    data = extract_allotment(path, key)
    save_json(data, f'neet_2026_allotment_{key}.json')
    cutoffs = derive_cutoffs(data)
    save_json(cutoffs, f'neet_2026_cutoffs_{key}.json')
    del data, cutoffs
    gc.collect()

# Step 4: MBBS fee (manual from screenshot - OCR needs Tesseract)
mbbs_fees = [
    {'sl_no':1,'college_code':'M001','college_name':'Bangalore Medical College,NO-2, Fort, K R ROAD,Bangalore','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':0,'nri_fees':0,'course':'MBBS'},
    {'sl_no':2,'college_code':'M021','college_name':'Mysore Medical College,Irwin Road,Mysore','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':3,'college_code':'M024','college_name':'Mandya Institute of Medical Sciences,District Hospital,Mandya','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':4,'college_code':'M025','college_name':'Hassan Institute of Medical Sciences,Near Chamarajendra Hospital,Hassan','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':5,'college_code':'M031','college_name':'Karnataka Institute of Medical Sciences,Vidyanagar,Hubli','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':6,'college_code':'M037','college_name':'Belgaum Institute of Medical Sciences,Dr B R Ambedkar Road,Belgaum','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':7,'college_code':'M041','college_name':'Vijayanagar Institute of Medical Sciences,Cantonment,Bellary','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':8,'college_code':'M044','college_name':'Bidar Institute of Medical Sciences,Udgir Road,Bidar','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':9,'college_code':'M045','college_name':'Raichur Institute of Medical Sciences,Sy No 307 & 308,Raichur','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':10,'college_code':'M083','college_name':'Shimoga Institute of Medical Sciences,Sagar Road,Shimoga','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':0,'nri_fees':0,'course':'MBBS'},
    {'sl_no':11,'college_code':'M096','college_name':'ESI Medical College,Rajajinagar,Bangalore','college_type':'Government','govt_fees':109350,'private_fees':0,'management_fees':0,'nri_fees':0,'course':'MBBS'},
    {'sl_no':12,'college_code':'M070','college_name':'ESI Medical College,Sedam Road,Gulbarga','college_type':'Government','govt_fees':109350,'private_fees':0,'management_fees':0,'nri_fees':0,'course':'MBBS'},
    {'sl_no':13,'college_code':'M072','college_name':'Gulbarga Institute of Medical Sciences,VIRESHNAGAR SEDAM ROAD,GULBARGA','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':14,'college_code':'M073','college_name':'Koppal Institute of Medical Sciences,GANGAVATI ROAD,KIDDIDAL GATE,KOPPAL','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':15,'college_code':'M074','college_name':'K.H. Patil Institute of Medical Sciences (previously Gadag Institute of Medical Sciences),Malusamudra, Mulugund Road,Gadag','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':2509350,'nri_fees':2509350,'course':'MBBS'},
    {'sl_no':16,'college_code':'M075','college_name':'Chamarajanagar Institute of Medical Science,SURVEY NO 124,YADAPURA CHAMARAJANAGAR','college_type':'Government','govt_fees':64350,'private_fees':0,'management_fees':0,'nri_fees':0,'course':'MBBS'},
]
save_json(mbbs_fees, 'neet_2026_fee_structure_mbbs.json')
print(f"  NOTE: MBBS fee is partial (16 govt colleges from screenshot). Install Tesseract for full OCR extraction.")

# Combined fees
all_fees = dental_fees + mbbs_fees
save_json(all_fees, 'neet_2026_fee_structure_all.json')

elapsed = time.time() - start
print(f"\n{'='*60}")
print(f"DONE in {elapsed:.1f}s")
print(f"{'='*60}")
