import os
from bs4 import BeautifulSoup

def dump_r2_text(filepath):
    print(f"Dumping text from {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    soup = BeautifulSoup(content, 'lxml')
    page_container = soup.find(id='page-container')
    pages = page_container.find_all('div', recursive=False)
    pages = [p for p in pages if 'pf' in (p.get('class') or [])]
    
    print(f"Total Pages: {len(pages)}")
    
    for i in range(5): # Dump first 5 pages
        if i >= len(pages): break
        print(f"\n--- Page {i} ---")
        page = pages[i]
        
        # Dump all text divs in order
        # Need to sort by top/left ? 
        # pdf2htmlEX divs usually are in DOM order approx correct?
        # Or I can just dump raw.
        
        # Better to sort by Y first.
        # But I don't want to parse CSS again if I can avoid it.
        # I'll just dump DOM order.
        
        pc = page.find('div', class_=lambda x: x and 'pc' in x)
        if not pc: continue
        
        divs = pc.find_all('div', class_='t')
        for div in divs:
            print(div.get_text())

base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'
fpath = os.path.join(base, 'kcet-2025-round2-cutoffs.html')
dump_r2_text(fpath)
