"""
Focused analysis of HTML structure for KCET cutoff files.
Extract sample data from each year format to understand patterns.
"""

from bs4 import BeautifulSoup
import re
import os

def extract_page_text(page_div):
    """Extract all text with CSS positions from a page div."""
    elements = []
    # Find all positioned divs with text
    for div in page_div.find_all('div'):
        style = div.get('style', '')
        if 'left:' in style and 'top:' in style:
            text = div.get_text(strip=True)
            if text:
                # Parse left and top
                left_m = re.search(r'left:\s*([\d.]+)em', style)
                top_m = re.search(r'top:\s*([\d.]+)em', style)
                if left_m and top_m:
                    elements.append({
                        'text': text,
                        'left': float(left_m.group(1)),
                        'top': float(top_m.group(1)),
                    })
    # Sort by top then left
    elements.sort(key=lambda e: (e['top'], e['left']))
    return elements

def analyze_file(filepath, label, pages_to_check=None):
    print(f"\n{'='*80}")
    print(f"ANALYZING: {label}")
    print(f"{'='*80}")
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'lxml')
    body = soup.find('body')
    top_divs = body.find_all('div', recursive=False)
    print(f"Total pages: {len(top_divs)}")
    
    if pages_to_check is None:
        pages_to_check = [0, 1, 2, len(top_divs)//2]
    
    for pg in pages_to_check:
        if pg >= len(top_divs):
            continue
        print(f"\n--- Page {pg + 1} ---")
        elements = extract_page_text(top_divs[pg])
        for el in elements[:60]:
            print(f"  L={el['left']:6.1f} T={el['top']:6.1f} | {el['text'][:100]}")

base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'

# Check 2025 format (pages 1,2,3 and a middle page)
analyze_file(os.path.join(base, 'kcet-2025-round1-cutoffs.html'), '2025 R1', [0, 1, 2, 3])
print("\n\n" + "="*80)
print("="*80)

# Check 2023 format
analyze_file(os.path.join(base, 'kcet-2023-round1-cutoffs.html'), '2023 R1', [0, 1, 2, 3])
print("\n\n" + "="*80)
print("="*80)

# Check 2024 format
analyze_file(os.path.join(base, 'kcet-2024-round1-cutoffs.html'), '2024 R1', [0, 1, 2])
