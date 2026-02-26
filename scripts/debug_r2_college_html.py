import os
from bs4 import BeautifulSoup

def find_college_div_html(filepath):
    print(f"Searching for 'College:' div in {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    soup = BeautifulSoup(content, 'lxml')
    # Search entire soup for string
    # target = soup.find(string=lambda t: t and 'College:' in t)
    # The string might be part of a text node.
    
    # Iterate all divs
    divs = soup.find_all('div')
    for div in divs:
         text = div.get_text()
         if 'College:' in text and len(text) < 500: # avoid big containers
             print("\nFOUND DIV MATCH:")
             print(f"Classes: {div.get('class')}")
             print("HTML:")
             print(div.prettify())
             
             # Check parent
             parent = div.parent
             print(f"Parent classes: {parent.get('class')}")
             break

base = r'c:\Users\risha\OneDrive\Desktop\coded-main\HTMLCUTO'
fpath = os.path.join(base, 'kcet-2025-round2-cutoffs.html')
find_college_div_html(fpath)
