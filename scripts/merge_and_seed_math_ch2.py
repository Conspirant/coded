import json
import requests
import re
import sys

# Load env
env_vars = {}
with open('.env', encoding='utf-8') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env_vars[k.strip()] = v.strip().strip('"').strip("'")

SUPABASE_URL = env_vars.get('VITE_SUPABASE_URL')
SUPABASE_KEY = env_vars.get('VITE_SUPABASE_ANON_KEY')

with open('scratch/math_ch2_exact_key.json', encoding='utf-8') as f:
    raw_k = f.read()
s = raw_k.find('{')
e = raw_k.rfind('}')
OFFICIAL_KEY = json.loads(raw_k[s:e+1])
letter_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

# Existing extracted questions
existing = json.load(open('src/data/pyq_maths_ch2.json', encoding='utf-8'))
print(f"Existing in file: {len(existing)}")

# First 6 questions from p170_left_top
q1_to_6 = [
    {
        "q_num": 1,
        "question": "If $A = \\{a, b, c\\}$, $B = \\{b, c, d\\}$ and $C = \\{a, d, c\\}$, then $(A - B) \\times (B \\cap C) =$",
        "options": ["\\{(a, c), (a, d)\\}", "\\{(a, c), (a, d), (b, d)\\}", "\\{(c, a), (d, a)\\}", "\\{(c, a), (d, a), (b, d)\\}"],
        "year": 2006
    },
    {
        "q_num": 2,
        "question": "The function $f : X \\rightarrow Y$ defined by $f(x) = \\sin x$ is one-one but not onto if $X$ and $Y$ are respectively equal to",
        "options": ["$\\mathbb{R}$ and $\\mathbb{R}$", "$[0, \\pi]$ and $[0, 1]$", "$\\mathbb{R}$ and $[-1, 1]$", "$[0, \\pi]$ and $[-1, 1]$"],
        "year": 2006
    },
    {
        "q_num": 3,
        "question": "The domain of $f(x) = \\sin^{-1} (\\log_{10} x)$ is",
        "options": ["$[1, \\infty)$", "$(-\\infty, 1]$", "$\\{x \\mid 0 < x \\le 1\\}$", "$[\\frac{1}{10}, 10]$"],
        "year": 2007
    },
    {
        "q_num": 4,
        "question": "Let $R$ be the relation on the set $A = \\{1, 2, 3, 4\\}$ defined by $x R y$ if $x$ divides $y$. Then $R$ is",
        "options": ["reflexive and transitive", "reflexive and symmetric", "symmetric and transitive", "equivalence"],
        "year": 2008
    },
    {
        "q_num": 5,
        "question": "If $A = \\{a, b, c\\}$, $B = \\{b, c, d\\}$ and $C = \\{a, d, c\\}$, then $(A \\cap B) \\times (B \\cap C)$ is",
        "options": ["\\{(b, c), (c, c)\\}", "\\{(a, d), (c, d)\\}", "\\{(a, c), (b, d), (c, d)\\}", "\\{(a, c), (b, d), (c, d), (d, c)\\}"],
        "year": 2009
    },
    {
        "q_num": 6,
        "question": "Let $R$ be an equivalence relation defined on a set containing 6 elements. The minimum number of ordered pairs that $R$ should contain is",
        "options": ["6", "12", "36", "64"],
        "year": 2010
    }
]

formatted_prefix = []
for item in q1_to_6:
    num = item['q_num']
    key_letter = str(OFFICIAL_KEY.get(str(num), 'a')).lower()
    correct_idx = letter_to_idx.get(key_letter, 0)
    formatted_prefix.append({
        "subject": "Mathematics",
        "chapter": "Relations and Functions",
        "chapter_number": 2,
        "question": item['question'],
        "options": item['options'],
        "correct_answer": correct_idx,
        "year": item['year'],
        "explanation": f"According to the official KCET Answer Key, the correct option is ({key_letter.upper()}).",
        "needs_image": False
    })

# Check if Q1-Q6 already exist
final_list = formatted_prefix + [q for q in existing if not any(p['question'][:30] in q['question'] for p in formatted_prefix)]
print(f"Total final questions for Math Ch 2: {len(final_list)}")

with open('src/data/pyq_maths_ch2.json', 'w', encoding='utf-8') as f:
    json.dump(final_list, f, indent=2, ensure_ascii=False)

# Upsert into Supabase
headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}
batch_size = 25
seeded = 0
for i in range(0, len(final_list), batch_size):
    chunk = final_list[i:i+batch_size]
    r = requests.post(f"{SUPABASE_URL}/rest/v1/pyq_questions", headers=headers, json=chunk)
    if r.status_code in [200, 201]:
        seeded += len(chunk)
    else:
        print(f"Batch {i} error: {r.status_code} {r.text[:80]}")

print(f"Successfully seeded {seeded}/{len(final_list)} questions into Supabase for Mathematics Ch 2!")
