import re, sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/chem19/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
print(f"Total lines in chem19 OCR text: {len(lines)}")

# Look for question blocks or answers table
for i, line in enumerate(lines):
    if 'ANSWER' in line.upper() or 'KEY' in line.upper() or 'HINTS' in line.upper() or 'EXPLANATION' in line.upper():
        print(f"Line {i}: {line}")
        for j in range(max(0, i-2), min(len(lines), i+30)):
            print(f"  {lines[j]}")
        break
