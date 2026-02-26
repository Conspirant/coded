import sys
sys.path.append('.')
from scripts.rebuild_kcet_final import extract_pdfs_for_year

rows = extract_pdfs_for_year('2025')
print(f"\nTotal 2025 rows: {len(rows)}")

e007_rows = [r for r in rows if r['institute_code'] == 'E007' and r['round'] == 'R2']
print(f"E007 R2 rows: {len(e007_rows)}")

from pprint import pprint
for r in e007_rows[:10]:
    pprint(r)

import json
with open('debug_2025_pdf.json', 'w') as f:
    json.dump(rows, f, indent=2)
