"""
Analyze the HTML structure of KCET cutoff files for 2023, 2024, and 2025.
These are PDF-to-HTML conversions with absolute positioning.
We need to understand:
1. How pages are structured (div containers)
2. How text spans are positioned
3. How to identify college names, course names, categories, and cutoff values
4. Differences between 2023/2024 format and 2025 format
"""

from bs4 import BeautifulSoup
import re
import os

def analyze_file(filepath, label, max_pages=3):
    print(f"\n{'='*80}")
    print(f"ANALYZING: {label}")
    print(f"File: {filepath}")
    print(f"{'='*80}")
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    print(f"File size: {len(content):,} bytes")
    
    soup = BeautifulSoup(content, 'lxml')
    
    # Find all page containers - typically top-level divs in body
    body = soup.find('body')
    if not body:
        print("No body found!")
        return
    
    # Get direct children of body
    top_divs = body.find_all('div', recursive=False)
    print(f"Number of top-level divs (pages): {len(top_divs)}")
    
    # Analyze first few pages
    for page_idx, page_div in enumerate(top_divs[:max_pages]):
        print(f"\n--- Page {page_idx + 1} ---")
        print(f"Page div classes: {page_div.get('class', [])}")
        
        # Get all text-containing spans
        spans = page_div.find_all('span')
        print(f"Number of spans: {len(spans)}")
        
        # Extract text content with positions
        text_elements = []
        for span in spans:
            text = span.get_text(strip=True)
            if text:
                # Get parent div's style for positioning
                parent = span.find_parent('div')
                parent_style = parent.get('style', '') if parent else ''
                parent_class = parent.get('class', []) if parent else []
                span_class = span.get('class', [])
                text_elements.append({
                    'text': text,
                    'span_class': span_class,
                    'parent_class': parent_class,
                    'parent_style': parent_style[:100]
                })
        
        print(f"Text elements with content: {len(text_elements)}")
        for i, elem in enumerate(text_elements[:50]):
            print(f"  [{i}] text='{elem['text'][:80]}' span_class={elem['span_class']} parent_style='{elem['parent_style'][:60]}'")

    # Also look at a middle page to see the data pattern
    mid_page = len(top_divs) // 2
    if mid_page > max_pages:
        print(f"\n--- Page {mid_page + 1} (middle page) ---")
        page_div = top_divs[mid_page]
        spans = page_div.find_all('span')
        text_elements = []
        for span in spans:
            text = span.get_text(strip=True)
            if text:
                parent = span.find_parent('div')
                parent_style = parent.get('style', '') if parent else ''
                text_elements.append({
                    'text': text,
                    'parent_style': parent_style[:100]
                })
        
        print(f"Text elements: {len(text_elements)}")
        for i, elem in enumerate(text_elements[:50]):
            print(f"  [{i}] text='{elem['text'][:80]}' style='{elem['parent_style'][:60]}'")

base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'

# Analyze one file from each year
analyze_file(os.path.join(base, 'kcet-2025-round1-cutoffs.html'), '2025 Round 1', max_pages=3)
analyze_file(os.path.join(base, 'kcet-2023-round1-cutoffs.html'), '2023 Round 1', max_pages=3)
analyze_file(os.path.join(base, 'kcet-2024-round1-cutoffs.html'), '2024 Round 1', max_pages=3)
