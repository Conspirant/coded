import os
import re
from bs4 import BeautifulSoup
from collections import defaultdict
import json

def parse_pdf2htmlEX_debug(filepath):
    print(f"Parsing (pdf2htmlEX) {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    # Extract CSS coordinates
    x_map = {}
    y_map = {}
    
    style_blocks = re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)
    css = "\n".join(style_blocks)
    
    x_matches = re.finditer(r'\.(x[\da-f]+)\s*\{\s*left\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in x_matches:
        x_map[m.group(1)] = float(m.group(2))
        
    y_matches = re.finditer(r'\.(y[\da-f]+)\s*\{\s*bottom\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in y_matches:
        y_map[m.group(1)] = float(m.group(2))
        
    print(f"  Extracted {len(x_map)} X classes and {len(y_map)} Y classes")
    
    soup = BeautifulSoup(content, 'lxml')
    page_container = soup.find(id='page-container')
    pages = page_container.find_all('div', recursive=False)
    pages = [p for p in pages if 'pf' in (p.get('class') or [])]
    
    print(f"Total Pages: {len(pages)}")
    
    # Analyze Page 1
    if not pages: return
    
    page = pages[0]
    elements = []
    
    pc = page.find('div', class_=lambda x: x and 'pc' in x)
    if not pc: 
        print("No pc div found")
        return

    divs = pc.find_all('div', class_='t')
    for div in divs:
        classes = div.get('class', [])
        text = div.get_text(strip=True)
        if not text: continue
        
        x_val = None
        y_val = None
        for cls in classes:
            if cls in x_map: x_val = x_map[cls]
            if cls in y_map: y_val = y_map[cls]
        
        if x_val is not None and y_val is not None:
            elements.append({
                'text': text,
                'left': x_val,
                'bottom': y_val,
                'top': -y_val 
            })
            
    # Group by line
    lines = defaultdict(list)
    for el in elements:
        row_key = round(el['top'], 0) # px
        lines[row_key].append(el)
    
    sorted_rows = sorted(lines.keys())
    
    print("\n--- Rows (First 20) ---")
    for row_y in sorted_rows[:20]:
        row_items = sorted(lines[row_y], key=lambda x: x['left'])
        full_text = " ".join([item['text'] for item in row_items])
        print(f"Y={row_y} ({len(row_items)} items): {full_text[:150]}")
        
    # Check specifically for header terms
    print("\n--- Searching for Header ---")
    for row_y in sorted_rows:
        row_items = sorted(lines[row_y], key=lambda x: x['left'])
        full_text = " ".join([item['text'] for item in row_items])
        if "1G" in full_text or "Course Name" in full_text:
             print(f"POTENTIAL HEADER Y={row_y}: {full_text}")
             # Print HTML of the first item to see spacers
             if row_items:
                 # We need the original element to print HTML
                 # But we only stored text/left/top.
                 # Need to find it again? Or store it in 'elements'.
                 pass

    # Re-find header div to print HTML
    if pages:
        pc = pages[0].find('div', class_=lambda x: x and 'pc' in x)
        divs = pc.find_all('div', class_='t')
        for div in divs:
            text = div.get_text()
            if "1G" in text and "Course Name" in text:
                print("HEADER HTML:")
                print(div.prettify())
                break

base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'
fpath = os.path.join(base, 'kcet-2025-round2-cutoffs.html')
parse_pdf2htmlEX_debug(fpath)
