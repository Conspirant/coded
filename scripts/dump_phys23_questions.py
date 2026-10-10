import json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/phys23/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's save numbered text
with open('scratch/phys23/phys23_numbered.txt', 'w', encoding='utf-8') as f:
    for idx, l in enumerate(text.split('\n')):
        f.write(f'{idx:4d}: {l}\n')

print('Wrote scratch/phys23/phys23_numbered.txt')
