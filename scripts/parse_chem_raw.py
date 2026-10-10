import re
import json
import sys

# Set standard output to utf-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('scratch/chem_top_raw.json', 'r', encoding='utf-8') as f:
    text_top = f.read()

with open('scratch/chem_bottom_raw.json', 'r', encoding='utf-8') as f:
    text_bot = f.read()

print('Top text length:', len(text_top))
print('Bot text length:', len(text_bot))
