
import os
import json
import csv
import re
from bs4 import BeautifulSoup
from collections import defaultdict

def get_em_per_char():
    # Courier New standard approx
    return 0.605

def parse_header_row(row_items):
    """
    Identify column headers and their absolute left positions.
    Returns dict: { '1G': 17.1, '1K': 20.1, ... }
    """
    combined_text = " ".join([x['text'] for x in row_items])
    if "1G" not in combined_text or "GM" not in combined_text:
        return None
        
    cols = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', 
            '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 
            'GM', 'GMK', 'GMR', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']
            
    col_map = {}
    
    # Iterate through fragments to find headers
    # We search inside each text fragment
    for item in row_items:
        text = item['text']
        left = item['left']
        
        # A fragment might be "1G 1K 1R"
        # We need finding the start index of each token
        
        em = get_em_per_char()
        
        # Naive approach: splits by space, assumes single space = 1 char width?
        # Actually in HTML text, multiple spaces are collapsed.
        # But we can search for substrings.
        
        for col in cols:
            # We search for " 1G " or "1G" at start etc.
            # But simpler: just find()
            idx = text.find(col)
            if idx != -1:
                # Basic sanity check: is it a standalone token?
                # Check boundaries if needed, but let's trust Unique strings.
                
                # Calculate absolute position
                # text[0] is at 'left'
                # char '1' is at left + idx * em
                abs_pos = left + (idx * em)
                col_map[col] = abs_pos
    
    return col_map

def parse_monospaced_file(filepath, year):
    print(f"Parsing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'lxml')
    body = soup.find('body')
    pages = body.find_all('div', recursive=False)
    
    all_rows = []
    current_college = None
    col_map = None
    em_width = get_em_per_char()
    
    COL_ORDER = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', 
                 '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 
                 'GM', 'GMK', 'GMR', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']
    
    for page_idx, page in enumerate(pages):
        # Extract elements
        elements = []
        for div in page.find_all('div'):
            style = div.get('style', '')
            text = div.get_text(strip=True)
            if not text: continue
            
            top_match = re.search(r'top:\s*([\d.]+)em', style)
            left_match = re.search(r'left:\s*([\d.]+)em', style)
            
            if top_match and left_match:
                elements.append({
                    'text': text,
                    'top': float(top_match.group(1)),
                    'left': float(left_match.group(1))
                })
        
        # Group by line
        lines = defaultdict(list)
        for el in elements:
            row_key = round(el['top'], 1)
            lines[row_key].append(el)
        
        sorted_rows = sorted(lines.keys())
        
        for row_y in sorted_rows:
            row_items = sorted(lines[row_y], key=lambda x: x['left'])
            full_text = " ".join([item['text'] for item in row_items])
            
            # 1. Update Header Map if found
            potential_map = parse_header_row(row_items)
            if potential_map and len(potential_map) > 5:
                col_map = potential_map
                # print(f"Header updated on Page {page_idx+1}")
                continue

            # 2. Check College
            # Look for "E001" pattern
            # Pattern: Start of line has code like "1E001" or "E001"
            first_text = row_items[0]['text']
            code_match = re.match(r'^(\d*)([A-Z]\d{3})\s+', first_text)
            if not code_match:
                 # Try full text match logic in case it's in a later fragment (rare)
                 code_match = re.match(r'^(\d*)([A-Z]\d{3})\s+', full_text)
            
            if code_match and "College" in full_text:  # Strong signal
                clean_code = code_match.group(2)
                # extract name from the *full text* line
                # Find where the code ends in full_text
                match_span = code_match.span()
                raw_name = full_text[match_span[1]:].strip()
                
                # Cleanup name
                cleaned_name = raw_name
                for junk in ["( PUBLIC UNIV. )", "(AUTONOMOUS)", "College of Engineering", "Institute of Technology"]:
                     # We can keep Institute/College but remove parens
                     pass
                cleaned_name = re.sub(r'\s*\(.*?\)\s*', ' ', cleaned_name).strip()
                cleaned_name = re.sub(r'\s+', ' ', cleaned_name)
                
                current_college = {'code': clean_code, 'name': cleaned_name}
                # print(f"College: {clean_code} {cleaned_name}")
                continue
            
            # 3. Data Row
            if not current_college or not col_map: continue
            
            # Must contain data digits?
            # Or be "--"
            if not re.search(r'[\d\-]', full_text): continue
            
            # Course Identification:
            # Usually starts Left < 15.0
            # Identify "Course Code" and "Course Name"
            c_code = ""
            c_name = ""
            
            # Gather course fragments
            course_frags = [x for x in row_items if x['left'] < 16.0]
            data_frags = [x for x in row_items if x['left'] >= 16.0]
            
            if not course_frags: 
                # Continuation of previous course? 
                # For now assume new row = new course or skip
                continue
                
            course_text = " ".join([x['text'] for x in course_frags]).strip()
            # Split: "AI Artificial"
            parts = course_text.split(' ', 1)
            if len(parts) == 2:
                c_code, c_name = parts
            else:
                c_code = parts[0]
                c_name = parts[0]
            
            if len(c_code) > 6 or "CUTOFF" in c_code: continue
            
            # Extract Data using Virtual Line
            # Create a character array of size 200
            # We map 0.0em -> index 0
            # index = int(left / em_width)
            
            # Improve alignment:
            # Shift everything so that '1G' aligns to index 0?
            # No, map absolute.
            
            # We construct string
            line_len = 300
            line_chars = [' '] * line_len
            
            for item in data_frags:
                start_raw = item['left']
                start_idx = int(start_raw / em_width)
                t = item['text']
                for i, char in enumerate(t):
                    if start_idx + i < line_len:
                        current = line_chars[start_idx + i]
                        # Assume left-most wins or Overwrite?
                        # Text shouldn't overlap usually.
                        line_chars[start_idx + i] = char
            
            virtual_line = "".join(line_chars)
            
            # Extract columns
            row_dict = {
                'college_code': current_college['code'],
                'college_name': current_college['name'],
                'course_code': c_code,
                'course_name': c_name,
                'year': year
            }
            
            for i, col in enumerate(COL_ORDER):
                if col not in col_map: continue
                
                # Start index for this column
                start_em = col_map[col]
                start_idx = int(start_em / em_width)
                
                # End index?
                # Midpoint to next column
                if i < len(COL_ORDER) - 1:
                    next_col = COL_ORDER[i+1]
                    if next_col in col_map:
                        next_em = col_map[next_col]
                        # Use strictly defined width if next col exists
                        # Allow some padding.
                        # The number for '1G' is usually left-aligned to 1G header?
                        # Or centered?
                        # In the viz:
                        # 1G at 17.1. Data '9507' at 17.1. Left aligned!
                        # So we read from start_idx until next_idx
                        next_idx = int(next_em / em_width)
                        # But spacing is tight. 3.0em = 5 chars.
                        # We take slice [start_idx : next_idx]
                        end_idx = next_idx
                    else:
                        end_idx = start_idx + 8
                else:
                    end_idx = start_idx + 8
                
                # Slice
                val_raw = virtual_line[start_idx:end_idx].strip()
                
                # Smarter cleanup:
                # If val_raw contains space, take first part?
                # "9507 18" -> likely "9507" belonging here, "18..." belongs to next?
                # But next column would handle "18..." if indices are correct.
                # Just take full chunk and clean.
                
                val = val_raw.split(' ')[0] # take first token
                
                clean_val = None
                if re.match(r'^\d+$', val):
                    clean_val = int(val)
                elif "--" in val:
                    clean_val = None
                
                row_dict[col] = clean_val

            all_rows.append(row_dict)
            
    return all_rows

if __name__ == '__main__':
    base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'
    
    # 2023
    data_2023 = parse_monospaced_file(os.path.join(base, 'kcet-2023-round1-cutoffs.html'), 2023)
    with open('cutoff_2023_extracted.json', 'w') as f:
        json.dump(data_2023, f, indent=2)
    print(f"2023 Extracted: {len(data_2023)} rows")

    # 2024
    data_2024 = parse_monospaced_file(os.path.join(base, 'kcet-2024-round1-cutoffs.html'), 2024)
    with open('cutoff_2024_extracted.json', 'w') as f:
        json.dump(data_2024, f, indent=2)
    print(f"2024 Extracted: {len(data_2024)} rows")
