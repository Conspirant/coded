import json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/phys23/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
print(f"Total lines in phys23 OCR text: {len(lines)}")

# Look for ANSWER KEY
for i, line in enumerate(lines):
    if 'ANSWER' in line.upper() or 'KEY' in line.upper():
        print(f"Line {i}: {line}")
        for j in range(i, min(len(lines), i+45)):
            print(f"  {lines[j]}")
        print("---")
