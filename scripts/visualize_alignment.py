
import os
import re
from bs4 import BeautifulSoup
from collections import defaultdict

def visualize_alignment(filepath):
    print(f"Visualizing alignment for {filepath}...")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'lxml')
    body = soup.find('body')
    # Just check first page
    page = body.find('div', recursive=False)
    
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
    
    print("\n--- ALIGNMENT VISUALIZATION ---")
    print("Each line shows: [Top] | [LeftStart] Text [LeftEnd] ...")
    
    for row_y in sorted_rows:
        row_items = sorted(lines[row_y], key=lambda x: x['left'])
        # Print simplistic representation
        line_str = f"{row_y:5.1f} | "
        for item in row_items:
            line_str += f"L={item['left']:5.1f} '{item['text']}' "
        print(line_str[:200]) # Truncate

if __name__ == '__main__':
    base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'
    visualize_alignment(os.path.join(base, 'kcet-2024-round1-cutoffs.html'))
