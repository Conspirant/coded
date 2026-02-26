import pdfplumber
import pandas as pd
import re
import os
import csv
from pathlib import Path

CATEGORY_MAPPING = {
    '1G': '1G', '1K': '1K', '1R': '1R',
    '2AG': '2AG', '2AK': '2AK', '2AR': '2AR',
    '2BG': '2BG', '2BK': '2BK', '2BR': '2BR',
    '3AG': '3AG', '3AK': '3AK', '3AR': '3AR',
    '3BG': '3BG', '3BK': '3BK', '3BR': '3BR',
    'GM': 'GM', 'GMK': 'GMK', 'GMR': 'GMR',
    'SCG': 'SCG', 'SCK': 'SCK', 'SCR': 'SCR',
    'STG': 'STG', 'STK': 'STK', 'STR': 'STR',
    'GMP': 'GMP', 'NRI': 'NRI', 'OPN': 'OPN', 'OTH': 'OTH'
}

def parse_filename(filename):
    """
    Extract Year and Round from filename.
    Format example: kcet-2025-round1-cutoffs.pdf
    """
    year = "Unknown"
    match_year = re.search(r'20\d{2}', filename)
    if match_year:
        year = match_year.group(0)
        
    round_val = "Unknown"
    filename_lower = filename.lower()
    if 'mock' in filename_lower:
        if 'round1' in filename_lower: round_val = "Mock Round 1"
        elif 'round2' in filename_lower: round_val = "Mock Round 2"
        else: round_val = "Mock"
    elif 'extended' in filename_lower:
        if 'round3' in filename_lower: round_val = "Round 3 Extended"
        else: round_val = "Extended"
    elif 'round1' in filename_lower:
        round_val = "Round 1"
    elif 'round2' in filename_lower:
        round_val = "Round 2"
    elif 'round3' in filename_lower:
        round_val = "Round 3"
        
    return year, round_val

def clean_location(college_name):
    if ',' in college_name:
        parts = college_name.split(',')
        return parts[-1].strip().replace(')', '').strip()
    return "Karnataka"

def extract_from_pdf(pdf_path):
    print(f"Processing PDF: {pdf_path}")
    data_rows = []
    file_name = os.path.basename(pdf_path)
    year, round_val = parse_filename(file_name)
    
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"  Pages: {total_pages}")
        
        current_college_code = None
        current_college_name = None
        current_location = None
        
        for p_idx, page in enumerate(pdf.pages):
            if p_idx % 20 == 0: print(f"  Scanning page {p_idx}/{total_pages}...")
            
            # 1. Extract Text strings to find College Headers with their Y positions
            words = page.extract_words()
            # Construct lines
            lines = {} # top -> text
            for w in words:
                top = round(w['top'])
                if top not in lines: lines[top] = []
                lines[top].append(w['text'])
            
            # Sort lines by top
            sorted_tops = sorted(lines.keys())
            college_headers = [] # (top, code, name)
            
            for top in sorted_tops:
                line_text = " ".join(lines[top])
                # Regex for "College: (Code)Name" or similar
                # Found in layout: "College: (E001)Univesity..."
                match = re.search(r'College\s*:\s*[\(]?([A-Z0-9]+)[\)]?\s*(.+)', line_text, re.IGNORECASE)
                if match:
                    code = match.group(1)
                    name = match.group(2)
                    college_headers.append({'top': top, 'code': code, 'name': name})

            # Important: carry current college even for pages without tables.
            # Some PDFs have college header on one page and table on the next.
            if college_headers:
                last_header = max(college_headers, key=lambda x: x['top'])
                current_college_code = last_header['code']
                current_college_name = last_header['name']
                current_location = clean_location(current_college_name)
            
            # 2. Find Tables
            tables = page.find_tables()
            
            for table_obj in tables:
                table_top = table_obj.bbox[1]
                
                # Find the closest college header ABOVE this table
                # Filter headers where header.top < table_top
                potential_colleges = [ch for ch in college_headers if ch['top'] < table_top]
                
                if potential_colleges:
                    # Pick the one with largest top (closest to table)
                    best_match = max(potential_colleges, key=lambda x: x['top'])
                    current_college_code = best_match['code']
                    current_college_name = best_match['name']
                    current_location = clean_location(current_college_name)
                elif current_college_code is None:
                    # If this is the start of a page and no header above, 
                    # it continues from previous page (retained current_college_code)
                    pass
                
                # Extract Data
                # extract_table() returns list of lists
                table_data = table_obj.extract()
                if not table_data: continue
                
                # Identify columns
                header_row = None
                category_indices = {} # cat -> index
                
                for row in table_data:
                    # Clean None values
                    row = [str(cell) if cell is not None else "" for cell in row]
                    row_str = " ".join(row)
                    
                    # Detect Header
                    if "Course" in row_str and "GM" in row_str:
                        # Map columns
                        for idx, cell in enumerate(row):
                            cell_clean = cell.strip().replace('\n', '')
                            if cell_clean in CATEGORY_MAPPING:
                                category_indices[CATEGORY_MAPPING[cell_clean]] = idx
                        continue
                    
                    # Process Data Row
                    if category_indices and len(row) > 0:
                        course_name = row[0].strip().replace('\n', ' ')
                        if not course_name or "Course" in course_name: continue
                        
                        for cat, idx in category_indices.items():
                            if idx < len(row):
                                val = row[idx].strip()
                                if val in ['--', '', '-']: continue
                                
                                try:
                                    cutoff = int(float(val.replace(',', '')))
                                    data_rows.append({
                                        'CollegeName': current_college_name,
                                        'CollegeCode': current_college_code,
                                        'CourseCode': course_name,
                                        'Category': cat,
                                        'CutoffRank': cutoff,
                                        'Location': current_location,
                                        'Year': year,
                                        'Round': round_val
                                    })
                                except:
                                    pass

    return data_rows

def main():
    root_dir = Path('.')
    pdf_files = list(root_dir.glob('kcet-2025*.pdf'))
    
    all_data = []
    print(f"Found {len(pdf_files)} PDF files for 2025.")
    
    for pdf in pdf_files:
        if 'cutoff' in pdf.name.lower():
            all_data.extend(extract_from_pdf(pdf))
            
    # Save to temp CSV
    output_file = 'kcet_2025_pdf_extracted.csv'
    fieldnames = ['CollegeName', 'CollegeCode', 'CourseCode', 'Category', 'CutoffRank', 'Location', 'Year', 'Round']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_data)
        
    print(f"PDF Extraction complete. Rows: {len(all_data)}")
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    main()
