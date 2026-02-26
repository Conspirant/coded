import os
import json
import re
from bs4 import BeautifulSoup, NavigableString, Tag
from collections import defaultdict

def get_column_x_map(header_row):
    """
    Map column names to their X-coordinate (Left) from the header row.
    Returns: { '1G': 25.1, '1K': 28.5, ... }
    """
    col_map = {}
    for item in header_row:
        text = item['text'].strip()
        
        if text in ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', 
                    '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 
                    'GM', 'GMK', 'GMR', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']:
            col_map[text] = item['left']
            
    return col_map

def extract_css_maps(content):
    x_map = {}
    y_map = {}
    spacer_map = {}
    font_size_map = {}
    
    style_blocks = re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)
    css = "\n".join(style_blocks)
    
    x_matches = re.finditer(r'\.(x[\da-f]+)\s*\{\s*left\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in x_matches: x_map[m.group(1)] = float(m.group(2))
        
    y_matches = re.finditer(r'\.(y[\da-f]+)\s*\{\s*bottom\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in y_matches: y_map[m.group(1)] = float(m.group(2))
        
    s_matches = re.finditer(r'\.(_[\da-f]+)\s*\{\s*width\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in s_matches: spacer_map[m.group(1)] = float(m.group(2))
        
    fs_matches = re.finditer(r'\.(fs[\da-f]+)\s*\{\s*font-size\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in fs_matches: font_size_map[m.group(1)] = float(m.group(2))
        
    return x_map, y_map, spacer_map, font_size_map

def process_complex_div(div, base_x, base_y, x_map, y_map, spacer_map, font_size_map):
    sub_elements = []
    font_size = 12.0
    classes = div.get('class', [])
    for cls in classes:
        if cls in font_size_map:
            font_size = font_size_map[cls]
            break
            
    char_width_est = font_size * 0.5 
    current_x = base_x
    
    for child in div.children:
        if isinstance(child, NavigableString):
            text = str(child)
            if not text: continue
            
            sub_elements.append({
                'text': text,
                'left': current_x,
                'bottom': base_y,
                'top': -base_y
            })
            
            width = len(text) * char_width_est
            current_x += width
            
        elif isinstance(child, Tag):
            if child.name == 'span':
                span_classes = child.get('class', [])
                width_added = 0
                for cls in span_classes:
                    if cls in spacer_map:
                        width_added = spacer_map[cls]
                        break
                current_x += width_added
                
    return sub_elements

def process_pages(pages, year, round_num, is_pdf2htmlex=False, css_maps=None):
    all_rows = []
    current_college = None
    column_centroids = None
    last_data_row = None
    
    x_map, y_map, spacer_map, font_size_map = css_maps if css_maps else ({},{},{},{})
    
    col_tolerance = 40 if is_pdf2htmlex else 1.8 
    course_split_x = 100 if is_pdf2htmlex else 5.5
    
    HEADER_TOKENS = set(['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', 
                        '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 
                        'GM', 'GMK', 'GMR', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR',
                        'Course', 'Name', 'Course Name'])

    for page_idx, page in enumerate(pages):
        elements = []
        
        if is_pdf2htmlex:
            pc = page.find('div', class_=lambda x: x and 'pc' in x)
            if not pc: continue
            divs = pc.find_all('div', class_='t')
            for div in divs:
                classes = div.get('class', [])
                x_val = None
                y_val = None
                for cls in classes:
                    if cls in x_map: x_val = x_map[cls]
                    if cls in y_map: y_val = y_map[cls]
                
                if x_val is not None and y_val is not None:
                    child_elems = process_complex_div(div, x_val, y_val, x_map, y_map, spacer_map, font_size_map)
                    elements.extend(child_elems)
                    
        else:
            for div in page.find_all('div'):
                style = div.get('style', '')
                text = div.get_text(strip=True)
                if not text: continue
                
                top_match = re.search(r'top:\s*([\d.]+)em', style)
                left_match = re.search(r'left:\s*([\d.]+)em', style)
                
                if top_match and left_match:
                    top_val = float(top_match.group(1))
                    elements.append({
                        'text': text,
                        'top': top_val,
                        'left': float(left_match.group(1))
                    })

        lines = defaultdict(list)
        for el in elements:
            if is_pdf2htmlex:
                row_key = round(el['top'], 0) 
            else:
                row_key = round(el['top'], 1)
            lines[row_key].append(el)
        
        sorted_rows = sorted(lines.keys())
        
        for row_y in sorted_rows:
            row_items = sorted(lines[row_y], key=lambda x: x['left'])
            full_text = " ".join([item['text'] for item in row_items])
            
            # Header Processing
            if "Course Name" in full_text and "1G" in full_text:
                # Potential Header
                potential_centroids = get_column_x_map(row_items)
                if len(potential_centroids) > 20: 
                    column_centroids = potential_centroids
                    last_data_row = None
                
                # Check for Mixed Row (Header + Data)
                # Filter out header tokens
                cleaned_items = [x for x in row_items if x['text'].strip() not in HEADER_TOKENS]
                # Reconstruct text without header tokens
                cleaned_text = " ".join([x['text'] for x in cleaned_items]).strip()

                if not cleaned_text:
                    # Pure Header, skip
                    continue
                else:
                    # Mixed Row. Use cleaned_items as row_items for data processing
                    row_items = cleaned_items
                    full_text = cleaned_text
                    # Fall through to College/Data logic

            if "College:" in full_text or "(E" in full_text or "Engineering" in full_text: 
                # Regex to handle "College: (E001) Name" and "College: E001 Name"
                # And "College : E001"
                match = re.search(r'College\s*:?\s*(?:\(\s*)?([A-Z0-9]+)(?:\s*\))?\s+(.*)', full_text, re.IGNORECASE)
                if match:
                    code = match.group(1)
                    name = match.group(2).strip()
                    current_college = {'code': code, 'name': name}
                    last_data_row = None
                    continue

            if not current_college or not column_centroids: continue
            
            course_items = [x for x in row_items if x['left'] < course_split_x]
            data_items = [x for x in row_items if x['left'] >= course_split_x]
            
            current_row_course_text = " ".join([x['text'] for x in course_items]).strip()
            
            has_data = False
            row_dict = {
                'college_code': current_college['code'],
                'college_name': current_college['name'],
                'year': year,
                'round': round_num,
                'raw_course_text': current_row_course_text
            }
            
            # Match 24 columns sequence?
            # If is_pdf2htmlex and data_items count is 24, we can map by index! because x coords are estimated.
            map_by_sequence = False
            if is_pdf2htmlex and len(data_items) == 24:
                map_by_sequence = True
                
            sorted_cols = sorted(column_centroids.items(), key=lambda x: x[1])
            col_names_ordered = [x[0] for x in sorted_cols] # 1G, 1K... ordered by X

            if map_by_sequence and len(col_names_ordered) == 24:
                # Sequence mapping
                for idx, item in enumerate(data_items):
                    col_name = col_names_ordered[idx]
                    val = item['text'].strip()
                    if val == '--':
                        row_dict[col_name] = None
                        has_data = True
                    elif re.match(r'^\d+$', val):
                        row_dict[col_name] = int(val)
                        has_data = True
            else:
                # Coordinate mapping
                for item in data_items:
                    closest_col = None
                    min_dist = 999
                    for col_name, col_x in column_centroids.items():
                        dist = abs(item['left'] - col_x)
                        if dist < col_tolerance:
                            if dist < min_dist:
                                min_dist = dist
                                closest_col = col_name

                    if closest_col:
                        val = item['text'].strip()
                        if val == '--':
                            row_dict[closest_col] = None
                            has_data = True
                        elif re.match(r'^\d+$', val):
                            row_dict[closest_col] = int(val)
                            has_data = True
            
            if has_data:
                all_rows.append(row_dict)
                last_data_row = row_dict
            elif current_row_course_text and not data_items:
                if last_data_row:
                    last_data_row['raw_course_text'] += " " + current_row_course_text

    return all_rows

def parse_pdf2htmlEX_file(filepath, year, round_num):
    print(f"Parsing (pdf2htmlEX) {filepath}...")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    css_maps = extract_css_maps(content)
    x, y, s, fs = css_maps
    print(f"  Extracted {len(x)} X, {len(y)} Y, {len(s)} Spacer, {len(fs)} Font classes")

    soup = BeautifulSoup(content, 'lxml')
    page_container = soup.find(id='page-container')
    if not page_container:
        body = soup.find('body')
        pages = body.find_all('div', recursive=False)
    else:
        pages = page_container.find_all('div', recursive=False)
    pages = [p for p in pages if 'pf' in (p.get('class') or [])]
    return process_pages(pages, year, round_num, is_pdf2htmlex=True, css_maps=css_maps)

def parse_simple_style_file(filepath, year, round_num):
    print(f"Parsing (Simple Style) {filepath}...")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    soup = BeautifulSoup(content, 'lxml')
    body = soup.find('body')
    if not body: return []
    pages = body.find_all('div', recursive=False)
    return process_pages(pages, year, round_num, is_pdf2htmlex=False)

def parse_dispatch(filepath, year, round_num):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        head = f.read(2000) 
    if 'pdf2htmlEX' in head or 'page-container' in head:
        return parse_pdf2htmlEX_file(filepath, year, round_num)
    else:
        return parse_simple_style_file(filepath, year, round_num)

def parse_all_2025():
    base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'
    files = [
        ('kcet-2025-round1-cutoffs.html', 1),
        ('kcet-2025-round2-cutoffs.html', 2),
        ('kcet-2025-round3-cutoffs.html', 3)
    ]
    full_data = []
    for fname, rnd in files:
        fpath = os.path.join(base, fname)
        if os.path.exists(fpath):
            data = parse_dispatch(fpath, 2025, rnd)
            print(f"  > Extracted {len(data)} rows from {fname}")
            full_data.extend(data)
        else:
            print(f"File not found: {fname}")
    return full_data

if __name__ == '__main__':
    data = parse_all_2025()
    with open('cutoff_2025_extracted.json', 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Total 2025 Rows: {len(data)}")
