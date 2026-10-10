import json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/chem19/extracted_text.txt', 'r', encoding='utf-8') as f:
    raw_text = f.read()

# Let's inspect where questions are located
print(f"Extracted text length: {len(raw_text)}")

# Let's see the text of page 164, 165, 166
for p in [164, 165, 166]:
    print(f"\n==================== PAGE {p} ====================")
    pattern = rf'==================== Page {p} Column c(\d) ====================\n(.*?)(?===================== Page|\Z)'
    matches = re.findall(pattern, raw_text, re.DOTALL)
    for col, ctext in matches:
        print(f"--- Column {col} ({len(ctext)} chars) ---")
        lines = [l.strip() for l in ctext.split('\n') if l.strip()]
        for l in lines[:10]:
            print("  ", l)
        if len(lines) > 10:
            print("  ...")
