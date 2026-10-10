import json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/phys23/accurate_cols/parsed_columns.json', 'r', encoding='utf-8') as f:
    cols = json.load(f)

# Concatenate all column lines in reading order
full_stream = []
for c in cols:
    full_stream.append(f"\n=== PAGE {c['page']} COL {c['col']} ===\n")
    full_stream.extend(c['lines'])

full_text = '\n'.join(full_stream)
with open('scratch/phys23/accurate_cols/full_text_stream.txt', 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f"Total lines in full stream: {len(full_stream)}")

# Let's inspect where questions 1 to 76 start
q_indices = {}
for qnum in range(1, 77):
    # Pattern for question number
    pattern = rf'(\b{qnum}\.\s+)'
    matches = list(re.finditer(pattern, full_text))
    if matches:
        q_indices[qnum] = matches[0].start()

print(f"Found {len(q_indices)} / 76 question markers.")
missing = [q for q in range(1, 77) if q not in q_indices]
print(f"Missing question markers in regex: {missing}")
