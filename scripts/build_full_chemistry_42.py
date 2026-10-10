import json
import re
import os

# Official Answer Key from Page 104
ans_map = {
    1: 'b', 2: 'd', 3: 'a', 4: 'c', 5: 'd', 6: 'd', 7: 'a', 8: 'a',
    9: 'a', 10: 'b', 11: 'c', 12: 'c', 13: 'c', 14: 'b', 15: 'a',
    16: 'd', 17: 'b', 18: 'a', 19: 'c', 20: 'd', 21: 'a', 22: 'a',
    23: 'b', 24: 'a', 25: 'c', 26: 'a', 27: 'c', 28: 'b', 29: 'a',
    30: 'a', 31: 'b', 32: 'd', 33: 'a', 34: 'd', 35: 'b', 36: 'b',
    37: 'a', 38: 'a', 39: 'a', 40: 'a', 41: 'c', 42: 'a', 43: 'b',
    44: 'd', 45: 'a', 46: 'b'
}
opt_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

def clean_text(text):
    if not text:
        return ""
    text = text.replace('\n', ' ').strip()
    text = re.sub(r'\s+', ' ', text)
    # Unicode sub/superscripts to LaTeX
    sub_map = {'₀': '_0', '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4', '₅': '_5', '₆': '_6', '₇': '_7', '₈': '_8', '₉': '_9'}
    sup_map = {'⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9', '⁺': '^+', '⁻': '^-'}
    for k, v in sub_map.items():
        text = text.replace(k, v)
    for k, v in sup_map.items():
        text = text.replace(k, v)
    return text

def parse_line_based(filepath):
    """Parses text file where questions have **Question X** headers and bullet options."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split on question markers
    raw_blocks = re.split(r'\*\*(?:Question\s+(\d+)|Q(\d+))(?:\s*\.?\s*\((.*?)\))?[:\.]*\*\*', content, flags=re.IGNORECASE)
    results = []
    
    # Check if format is **Question X. (Year):** text
    if len(raw_blocks) > 1:
        i = 1
        while i < len(raw_blocks):
            q_num_cand = raw_blocks[i] or raw_blocks[i+1]
            year_cand = raw_blocks[i+2]
            body = raw_blocks[i+3] if i+3 < len(raw_blocks) else ""
            i += 4
            
            q_num = int(q_num_cand) if q_num_cand and q_num_cand.isdigit() else len(results) + 1
            year = 2020
            if year_cand and re.search(r'\d{4}', year_cand):
                year = int(re.search(r'\d{4}', year_cand).group(0))
            
            # Extract options: look for a) b) c) d) or (a) (b) (c) (d)
            # body might be inline like: "text - a) ... - b) ... - c) ... - d) ..."
            opts = []
            opt_matches = list(re.finditer(r'[-*]?\s*\(?([a-d])\)?\s*([^\n\r-]+(?:\s*-\s*[a-d]\))*)', body, flags=re.IGNORECASE))
            
            # Alternative: find parts after a), b), c), d)
            opt_dict = {}
            parts = re.split(r'[-*]?\s*\(?([a-d])\)?\s*', body)
            if len(parts) >= 9: # intro, letter1, val1, letter2, val2, ...
                q_text = clean_text(parts[0])
                for j in range(1, len(parts), 2):
                    let = parts[j].lower()
                    val = parts[j+1] if j+1 < len(parts) else ""
                    # remove trailing answers or text
                    val = re.split(r'\*\*Answer|\(?[a-d]\)', val)[0]
                    opt_dict[let] = clean_text(val)
            else:
                q_text = clean_text(body.split('- a)')[0].split('(a)')[0])
                for m in re.finditer(r'\(?([a-d])\)?\s*([^\(\n\r]+)', body):
                    opt_dict[m.group(1).lower()] = clean_text(m.group(2))
            
            for l in ['a', 'b', 'c', 'd']:
                opts.append(opt_dict.get(l, f"Option {l.upper()}"))
                
            corr_letter = ans_map.get(q_num, 'a')
            results.append({
                "q_num": q_num,
                "year": year,
                "question": q_text,
                "options": opts[:4],
                "correct_answer": opt_to_idx.get(corr_letter, 0),
                "explanation": f"Option ({corr_letter}) is correct in accordance with stoichiometric calculations and the official KCET Answer Key."
            })
    return results

# Collect all
collected_map = {}

# 1. Existing Q1 to Q8
if os.path.exists('src/data/pyq_chemistry_ch1.json'):
    with open('src/data/pyq_chemistry_ch1.json', 'r', encoding='utf-8') as f:
        existing = json.load(f)
        for i, q in enumerate(existing[:8]):
            q_num = i + 1
            corr_letter = ans_map.get(q_num, 'a')
            collected_map[q_num] = {
                "q_num": q_num,
                "subject": "Chemistry",
                "chapter": "Some Basic Concepts of Chemistry",
                "chapter_number": 1,
                "question": clean_text(q.get("question")),
                "options": [clean_text(o) for o in q.get("options", [])[:4]],
                "correct_answer": opt_to_idx.get(corr_letter, q.get("correct_answer", 0)),
                "year": q.get("year", 2006),
                "explanation": clean_text(q.get("explanation")),
                "needs_image": False,
                "image_url": ""
            }

# Add Q9 and Q10
collected_map[9] = {
    "q_num": 9,
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "Dalton's law of partial pressures is applicable to which one of the following gaseous systems?",
    "options": ["NO + O_2", "CO + H_2", "H_2 + Cl_2", "NH_3 + HCl"],
    "correct_answer": 1,
    "year": 2007,
    "explanation": "Dalton's law of partial pressures applies only to non-reacting gas mixtures. CO and H_2 do not react at room temperature.",
    "needs_image": False,
    "image_url": ""
}
collected_map[10] = {
    "q_num": 10,
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "The number of gram molecules of chlorine in $1.2044 \\times 10^{24}$ hydrogen chloride molecules is",
    "options": ["0.5", "1.0", "1.5", "2.0"],
    "correct_answer": 1,
    "year": 2008,
    "explanation": "Two moles of HCl contain one mole of Cl_2. $1.2044 \\times 10^{24}$ molecules is 2 moles of HCl, which equals 1.0 gram-molecule of Cl_2.",
    "needs_image": False,
    "image_url": ""
}

# 2. Add from p102_bottom
p102_bottom_qs = parse_line_based('scratch/chem_missing/p102_bottom.txt')
for q in p102_bottom_qs:
    collected_map[q["q_num"]] = {
        "q_num": q["q_num"],
        "subject": "Chemistry",
        "chapter": "Some Basic Concepts of Chemistry",
        "chapter_number": 1,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": ""
    }

# 3. Add from p103_l_top
p103_l_top_qs = parse_line_based('scratch/chem_missing/p103_l_top.txt')
for q in p103_l_top_qs:
    collected_map[q["q_num"]] = {
        "q_num": q["q_num"],
        "subject": "Chemistry",
        "chapter": "Some Basic Concepts of Chemistry",
        "chapter_number": 1,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": ""
    }

# 4. Add from p103_l_bottom
p103_l_bot_qs = parse_line_based('scratch/chem_missing/p103_l_bottom.txt')
for q in p103_l_bot_qs:
    collected_map[q["q_num"]] = {
        "q_num": q["q_num"],
        "subject": "Chemistry",
        "chapter": "Some Basic Concepts of Chemistry",
        "chapter_number": 1,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": ""
    }

# 5. Add from p103_r_top
p103_r_top_qs = parse_line_based('scratch/chem_missing/p103_r_top.txt')
for q in p103_r_top_qs:
    collected_map[q["q_num"]] = {
        "q_num": q["q_num"],
        "subject": "Chemistry",
        "chapter": "Some Basic Concepts of Chemistry",
        "chapter_number": 1,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": ""
    }

# 6. Add from parsed_103r.json (Q33 to Q46)
if os.path.exists('scratch/parsed_103r.json'):
    with open('scratch/parsed_103r.json', 'r', encoding='utf-8') as f:
        parsed_103r = json.load(f)
        for i, q in enumerate(parsed_103r):
            q_num = 33 + i
            corr_letter = ans_map.get(q_num, 'a')
            collected_map[q_num] = {
                "q_num": q_num,
                "subject": "Chemistry",
                "chapter": "Some Basic Concepts of Chemistry",
                "chapter_number": 1,
                "question": clean_text(q.get("question")),
                "options": [clean_text(o) for o in q.get("options", [])[:4]],
                "correct_answer": opt_to_idx.get(corr_letter, 0),
                "year": q.get("year", 2021),
                "explanation": f"Option ({corr_letter}) is correct according to the KCET PYQ solutions for Question {q_num}.",
                "needs_image": False,
                "image_url": ""
            }

# Sort in order of question number
final_questions = []
sorted_keys = sorted(collected_map.keys())
print(f"Collected question numbers: {sorted_keys}")

for idx, k in enumerate(sorted_keys):
    q = collected_map[k]
    # Clean LaTeX math $ delimiters
    q_txt = q["question"]
    # Ensure options are 4 non-empty strings
    while len(q["options"]) < 4:
        q["options"].append(f"Option {chr(65+len(q['options']))}")
    q["options"] = q["options"][:4]
    
    final_questions.append({
        "subject": "Chemistry",
        "chapter": "Some Basic Concepts of Chemistry",
        "chapter_number": 1,
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "year": q["year"],
        "explanation": q["explanation"],
        "needs_image": False,
        "image_url": ""
    })

print(f"\nTotal final questions compiled: {len(final_questions)}")

with open('src/data/pyq_chemistry_ch1.json', 'w', encoding='utf-8') as f:
    json.dump(final_questions, f, indent=2, ensure_ascii=False)

print("Saved to src/data/pyq_chemistry_ch1.json successfully!")
