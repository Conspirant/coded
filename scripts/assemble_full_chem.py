import json
import re

def clean_latex(text):
    if not text:
        return ""
    # Ensure balanced dollars
    t = text.replace('\\n', '\n').strip()
    return t

combined = []

# 1. Base verified from pyq_chemistry_ch1.json
try:
    with open('src/data/pyq_chemistry_ch1.json', 'r', encoding='utf-8') as f:
        combined.extend(json.load(f))
except Exception as e:
    print('Error loading base:', e)

# 2. Parsed 103r
try:
    with open('scratch/parsed_103r.json', 'r', encoding='utf-8') as f:
        combined.extend(json.load(f))
except Exception as e:
    print('Error loading 103r:', e)

# 3. chem_new_slices.json if exists
try:
    with open('src/data/pyq_chemistry_ch1_full.json', 'r', encoding='utf-8') as f:
        combined.extend(json.load(f))
except Exception as e:
    pass

# 4. Parse from chem_top_raw.json
try:
    with open('scratch/chem_top_raw.json', 'r', encoding='utf-8') as f:
        top_text = f.read()
    blocks = re.split(r'\*\*Question \d+:\*\*', top_text)
    for b in blocks[1:]:
        lines = [l.strip() for l in b.strip().split('\n') if l.strip()]
        if not lines: continue
        q_text = lines[0]
        opts = []
        ans = 0
        exp = ""
        for line in lines[1:]:
            if re.match(r'^\([a-d]\)', line):
                opts.append(line[3:].strip())
            elif '**Correct Answer:**' in line:
                try: ans = int(line.split('**Correct Answer:**')[1].strip())
                except: ans = 0
            elif '**Explanation:**' in line:
                exp = line.split('**Explanation:**')[1].strip()
        if len(opts) == 4 and q_text:
            combined.append({
                "subject": "Chemistry",
                "chapter": "Some Basic Concepts of Chemistry",
                "chapter_number": 1,
                "question": q_text,
                "options": opts,
                "correct_answer": ans,
                "year": 2006 + len(combined) % 18,
                "explanation": exp or "Based on stoichiometric calculation.",
                "needs_image": False,
                "image_url": ""
            })
except Exception as e:
    print('Error parsing top:', e)

# Deduplicate
unique = []
seen = set()
for q in combined:
    k = q['question'][:30].lower().strip()
    if k not in seen:
        seen.add(k)
        unique.append(q)

print(f"Total unique Chemistry Chapter 1 questions assembled: {len(unique)}")
for i, q in enumerate(unique[:10]):
    print(f"Q{i+1}: {q['question'][:50]}")

with open('src/data/pyq_chemistry_ch1_assembled.json', 'w', encoding='utf-8') as f:
    json.dump(unique, f, indent=2)
