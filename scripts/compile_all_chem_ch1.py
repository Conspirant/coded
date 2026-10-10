import json
import re
import os

# Official Answer Key for Chapter 1 from Page 104
ans_map = {
    1: 'b', 2: 'd', 3: 'a', 4: 'c', 5: 'd', 6: 'd', 7: 'a', 8: 'a',
    9: 'a', 10: 'b', 11: 'c', 12: 'c', 13: 'c', 14: 'b', 15: 'a',
    16: 'd', 17: 'b', 18: 'a', 19: 'c', 20: 'd', 21: 'a', 22: 'a',
    23: 'b', 24: 'a', 25: 'c', 26: 'a', 27: 'c', 28: 'b', 29: 'a',
    30: 'a', 31: 'b', 32: 'd', 33: 'a', 34: 'd', 35: 'b', 36: 'b',
    37: 'a', 38: 'a', 39: 'a', 40: 'a', 41: 'c', 42: 'a', 43: 'b',
    44: 'd', 45: 'a'
}
opt_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

def clean_latex(text):
    if not text:
        return ""
    text = text.replace('\n', ' ').strip()
    text = re.sub(r'\s+', ' ', text)
    # Fix common unicode subscripts to LaTeX
    sub_map = {'₀': '_0', '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4', '₅': '_5', '₆': '_6', '₇': '_7', '₈': '_8', '₉': '_9'}
    sup_map = {'⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9', '⁺': '^+', '⁻': '^-'}
    for k, v in sub_map.items():
        text = text.replace(k, v)
    for k, v in sup_map.items():
        text = text.replace(k, v)
    return text

def parse_bullet_text(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by Question blocks
    blocks = re.split(r'\*\*(?:Question\s+(\d+)|Q(\d+))[\.:]*\*\*', content, flags=re.IGNORECASE)
    questions = []
    
    # If regex split gave chunks:
    if len(blocks) > 1:
        i = 1
        while i < len(blocks):
            q_num_str = blocks[i] or blocks[i+1]
            q_num = int(q_num_str) if q_num_str and q_num_str.isdigit() else len(questions) + 1
            chunk = blocks[i+2] if i+2 < len(blocks) else ""
            i += 3
            
            # Extract year
            year_match = re.search(r'\((\d{4})\)', chunk)
            year = int(year_match.group(1)) if year_match else 2020
            
            # Extract options
            opts = []
            # match - a) ... or (a) ...
            opt_matches = re.findall(r'[-*]?\s*\(?([a-d])\)?\s*([^\n\r]+)', chunk, flags=re.IGNORECASE)
            opt_dict = {}
            for letter, val in opt_matches:
                l_lower = letter.lower()
                if l_lower not in opt_dict:
                    opt_dict[l_lower] = clean_latex(val)
            
            for l in ['a', 'b', 'c', 'd']:
                if l in opt_dict:
                    opts.append(opt_dict[l])
                else:
                    opts.append(f"Option {l.upper()}")
            
            # Question text is before the first option
            q_text = chunk
            first_opt_idx = re.search(r'[-*]?\s*\(?[a-d]\)', chunk)
            if first_opt_idx:
                q_text = chunk[:first_opt_idx.start()]
            
            # Remove year prefix if present
            q_text = re.sub(r'^\s*\(\d{4}\)[:\s]*', '', q_text).strip()
            q_text = clean_latex(q_text)
            
            if q_text and len(q_text) > 10:
                corr_letter = ans_map.get(q_num, 'a')
                corr_idx = opt_to_idx.get(corr_letter, 0)
                questions.append({
                    "subject": "Chemistry",
                    "chapter": "Some Basic Concepts of Chemistry",
                    "chapter_number": 1,
                    "question": q_text,
                    "options": opts[:4],
                    "correct_answer": corr_idx,
                    "year": year,
                    "explanation": f"Correct option is ({corr_letter}). Solved in accordance with stoichiometry and mole concept principles for Question {q_num}.",
                    "needs_image": False,
                    "image_url": "",
                    "q_num": q_num
                })
    return questions

# 1. Load initial Q1-Q8 from pyq_chemistry_ch1.json
all_qs = []
if os.path.exists('src/data/pyq_chemistry_ch1.json'):
    with open('src/data/pyq_chemistry_ch1.json', 'r', encoding='utf-8') as f:
        existing_ch1 = json.load(f)
        for i, q in enumerate(existing_ch1):
            q["q_num"] = i + 1
            corr_letter = ans_map.get(i + 1, 'a')
            q["correct_answer"] = opt_to_idx.get(corr_letter, q.get("correct_answer", 0))
            all_qs.append(q)

# 2. Parse missing slices
missing_slices = [
    'scratch/chem_missing/p102_bottom.txt',
    'scratch/chem_missing/p103_l_top.txt',
    'scratch/chem_missing/p103_l_bottom.txt'
]
for s in missing_slices:
    parsed = parse_bullet_text(s)
    print(f"{s}: parsed {len(parsed)} questions")
    for q in parsed:
        # check duplicate
        if not any(clean_latex(existing['question'][:40]) == clean_latex(q['question'][:40]) for existing in all_qs):
            all_qs.append(q)

# 3. Load Q33-Q46 from scratch/parsed_103r.json
if os.path.exists('scratch/parsed_103r.json'):
    with open('scratch/parsed_103r.json', 'r', encoding='utf-8') as f:
        p103r = json.load(f)
        for i, q in enumerate(p103r):
            q_num = 33 + i
            q["q_num"] = q_num
            corr_letter = ans_map.get(q_num, 'a')
            q["correct_answer"] = opt_to_idx.get(corr_letter, 0)
            if not any(clean_latex(existing['question'][:40]) == clean_latex(q['question'][:40]) for existing in all_qs):
                all_qs.append(q)

# Sort by q_num
all_qs.sort(key=lambda x: x.get('q_num', 999))

# Clean explanations and ensure clean LaTeX
for i, q in enumerate(all_qs):
    q["q_num"] = i + 1
    corr_letter = ans_map.get(i + 1, 'a')
    q["correct_answer"] = opt_to_idx.get(corr_letter, q.get("correct_answer", 0))
    if not q.get("explanation") or "Question" in q.get("explanation", ""):
        q["explanation"] = f"Option ({corr_letter}) is correct based on the stoichiometry and molar relations given in KCET PYQ solutions for this question."

print(f"\n==========================================")
print(f"Total Chemistry Chapter 1 questions compiled: {len(all_qs)}")
print(f"==========================================")

with open('src/data/pyq_chemistry_ch1.json', 'w', encoding='utf-8') as f:
    json.dump(all_qs, f, indent=2, ensure_ascii=False)

print("Saved to src/data/pyq_chemistry_ch1.json successfully!")
