import pandas as pd
import os
import re
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
    'STG': 'STG', 'STK': 'STK', 'STR': 'STR'
}

def clean_location(college_name):
    """
    Heuristic to extract location from college name.
    """
    if ',' in college_name:
        parts = college_name.split(',')
        return parts[-1].strip()
    
    cities = ['Bangalore', 'Bengaluru', 'Mysore', 'Mysuru', 'Mangalore', 'Mangaluru', 
              'Belgaum', 'Belagavi', 'Hubli', 'Hubballi', 'Dharwad', 'Tumkur', 'Tumakuru',
              'Hassan', 'Davangere', 'Davanagere', 'Shimoga', 'Shivamogga', 'Gulbarga', 'Kalaburagi',
              'Bellary', 'Ballari', 'Bijapur', 'Vijayapura', 'Raichur', 'Bidar', 'Kolar', 'Mandya',
              'Udupi', 'Chikmagalur', 'Chikkamagaluru', 'Chitradurga', 'Haveri', 'Gadag', 'Koppal',
              'Bagalkot', 'Bagalkote', 'Yadgir', 'Ramanagara', 'Chikkaballapur', 'Chamarajanagar']
    
    for city in cities:
        if city.lower() in college_name.lower():
            return city
            
    parts = college_name.split(' ')
    if len(parts) > 1:
        return parts[-1].strip()
    return "Karnataka" 

def parse_filename(filename):
    """
    Extract Year and Round from filename.
    Format example: kcet-2023-round1-cutoffs.xlsx
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

def extract_from_excel(file_path):
    print(f"Processing {file_path}...")
    try:
        xls = pd.ExcelFile(file_path)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

    data_rows = []
    
    file_name = os.path.basename(file_path)
    year, round_val = parse_filename(file_name)
    
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name, header=None)
        
        current_college_code = None
        current_college_name = None
        current_location = None
        category_map = {}
        
        # Iterate ALL rows
        for i, row in df.iterrows():
            first_col_val = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
            row_str = " ".join([str(x) for x in row if pd.notna(x)])
            
            # 1. Detect Header Row (updates category mapping)
            is_header_row = False
            # Very relaxed check: "GM" plus almost any other category indicator
            if "GM" in row_str:
                if any(x in row_str for x in ["1G", "1R", "2AG", "2BG", "3AG", "3BG", "SCG", "STG"]):
                    is_header_row = True
            elif ("Course" in row_str or "Branch" in row_str) and "GM" in row_str:
                 is_header_row = True
                 
            if is_header_row:
                temp_category_map = {}
                for idx, val in row.items():
                    val_str = str(val).strip()
                    if val_str in CATEGORY_MAPPING:
                        temp_category_map[idx] = CATEGORY_MAPPING[val_str]
                
                # Only update if we found valid categories
                if temp_category_map:
                    category_map = temp_category_map
                    print(f"  [{file_name}] Found header at row {i} with {len(category_map)} categories")
                    continue

            # 2. Detect College Header
            # Regex to find "E001 - Name" or "E001 Name" or "College: E001..."
            college_match = re.search(r'(?:College\s*[:\-]\s*)?([E]\d{3})\s*[:\-]?\s*(.+)', first_col_val, re.IGNORECASE)
            
            if college_match:
                current_college_code = college_match.group(1).strip()
                current_college_name = college_match.group(2).strip()
                current_location = clean_location(current_college_name)
                # print(f"  Found college: {current_college_code} at row {i}")
                continue
                
            # 3. Process Data Row
            # Needs: Active College, Active Category Map, Non-Header, Non-College row
            if current_college_code and category_map:
                # Exclude obvious non-data
                if "Course" in first_col_val or "College" in first_col_val:
                    continue
                if not first_col_val: # Empty course name
                    continue
                    
                # User wants EXACT course name
                course_code = first_col_val
                
                # Heuristic: Check if at least one category column has a number or '--'
                # to confirm it's a data row and not some other text
                has_data = False
                
                for col_idx, category in category_map.items():
                    if col_idx >= len(row): continue
                    
                    cutoff_val = row.iloc[col_idx]
                    if pd.notna(cutoff_val) and str(cutoff_val).strip() != '':
                        clean_cutoff = str(cutoff_val).replace(',', '').strip()
                        
                        if clean_cutoff == '--': 
                            has_data = True # It is a data row, just empty for this cat
                            continue
                            
                        try:
                            cutoff_rank = int(float(clean_cutoff))
                            has_data = True
                            
                            data_rows.append({
                                'CollegeName': current_college_name,
                                'CollegeCode': current_college_code,
                                'CourseCode': course_code,
                                'Category': category,
                                'CutoffRank': cutoff_rank,
                                'Location': current_location,
                                'Year': year,
                                'Round': round_val
                            })
                        except (ValueError, TypeError):
                            pass
                
                # If no data found in any mapped column, maybe it wasn't a data row?
                # But we filtered empty first_col, so likely it was a course with no data or parsing error.
                            
    return data_rows

def main():
    root_dir = Path('.')
    # Process ALL kcet xlsx files
    xlsx_files = list(root_dir.glob('kcet*.xlsx'))
    
    all_data = []
    
    print(f"Found {len(xlsx_files)} files to process.")
    for file in xlsx_files:
        # Basic check to ensure it looks like a cutoff file
        if 'cutoff' in file.name.lower():
            # USER REQUEST: Skip 2025 XLSX files, use PDF extraction instead
            if '2025' in file.name:
                print(f"Skipping 2025 file (will use PDF): {file.name}")
                continue
                
            all_data.extend(extract_from_excel(file))

    # Write to CSV
    output_file = 'kcet_cutoffs_extracted.csv'
    fieldnames = ['CollegeName', 'CollegeCode', 'CourseCode', 'Category', 'CutoffRank', 'Location', 'Year', 'Round']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_data)
        
    print(f"Extraction complete. Matches found: {len(all_data)}")
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    main()
