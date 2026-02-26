from bs4 import BeautifulSoup
import re
import os

def extract_page_text(page_div):
    elements = []
    for div in page_div.find_all('div'):
        style = div.get('style', '')
        if 'left:' in style and 'top:' in style:
            text = div.get_text(strip=True)
            if text:
                left_m = re.search(r'left:\s*([\d.]+)em', style)
                top_m = re.search(r'top:\s*([\d.]+)em', style)
                if left_m and top_m:
                    elements.append({
                        'text': text,
                        'left': float(left_m.group(1)),
                        'top': float(top_m.group(1)),
                    })
    elements.sort(key=lambda e: (e['top'], e['left']))
    return elements

base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'
fpath = os.path.join(base, 'kcet-2025-round3-cutoffs.html')

print(f"Analyzing {fpath}")
with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Extract all CSS blocks
style_blocks = re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)
if style_blocks:
    css = "\n".join(style_blocks)
    print(f"Found {len(style_blocks)} CSS blocks. Total CSS length: {len(css)}")
    
    # Parse .x and .y classes
    # .x1{left:123.4px} or similar
    # Regex allowing for optional whitespace
    x_map = {}
    y_map = {}
    
    x_matches = re.finditer(r'\.(x[\da-f]+)\s*\{\s*left\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in x_matches:
        x_map[m.group(1)] = float(m.group(2))
        
    y_matches = re.finditer(r'\.(y[\da-f]+)\s*\{\s*bottom\s*:\s*([\d.]+)\s*px\s*;?\s*\}', css, re.IGNORECASE)
    for m in y_matches:
        y_map[m.group(1)] = float(m.group(2))
        
    print(f"Found {len(x_map)} X classes and {len(y_map)} Y classes")
    if x_map:
        print("Sample X:", list(x_map.items())[:5])
    if y_map:
        print("Sample Y:", list(y_map.items())[:5])
else:
    print("No CSS style block found!")

soup = BeautifulSoup(content, 'lxml')
body = soup.find('body')
if not body:
    print("No body found!")
    exit()

pages = body.find_all('div', recursive=False)
print(f"Total pages: {len(pages)}")

print(f"Total top-level divs: {len(pages)}")
for i, p in enumerate(pages):
    print(f"Div {i}: id={p.get('id')} class={p.get('class')}")
    if p.get('id') == 'page-container':
        print("  Found page-container! inspecting children...")
        pages = p.find_all('div', recursive=False)
        print(f"  Number of pages: {len(pages)}")
        if len(pages) > 0:
            page1 = pages[0]
            print(f"  Page 1 ID: {page1.get('id')} Class: {page1.get('class')}")
            # Look for the content container 'pc'
            pc = page1.find('div', class_=lambda x: x and 'pc' in x)
            if pc:
                print(f"  Found content container: {pc.get('class')}")
                # Look for text vars
                children = pc.find_all(recursive=False)
                print(f"  Content children count: {len(children)}")
                for child in children[:5]:
                    print(f"    Tags: {child.name} Class: {child.get('class')} Text: {child.get_text()[:50]}")
                    if child.name == 'div' and 't' in (child.get('class') or []):
                         # Often class 't' is used for text lines
                         pass
                
                # Check for any text-containing divs deeper
                text_divs = pc.find_all('div', class_='t')
                print(f"  't' class divs found: {len(text_divs)}")
                if text_divs:
                    print("  Sample text div:")
                    print(text_divs[0].prettify())
            else:
                print("  No 'pc' div found in Page 1")
