import base64
import requests
import json
import time
import os

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

# Load Answer Key
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

slices = [
    ('scratch/chem_slices/p102_r_top.jpg', 'slice_1', '1 to 7'),
    ('scratch/chem_slices/p102_r_bottom.jpg', 'slice_2', '8 to 14'),
    ('scratch/chem_slices/p103_l_top.jpg', 'slice_3', '15 to 22'),
    ('scratch/chem_slices/p103_l_bottom.jpg', 'slice_4', '23 to 29'),
    ('scratch/chem_slices/p103_r_top.jpg', 'slice_5', '30 to 37'),
    ('scratch/chem_slices/p103_r_bottom.jpg', 'slice_6', '38 to 45')
]

os.makedirs('scratch/chem_results', exist_ok=True)

def extract_slice(img_path, tag, q_range):
    out_file = f'scratch/chem_results/{tag}.json'
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100:
        print(f"Skipping {tag} (already extracted).")
        with open(out_file, 'r', encoding='utf-8') as f:
            return json.load(f)
            
    print(f"Extracting {tag} (Questions {q_range})...", flush=True)
    with open(img_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()

    prompt = f"""You are transcribing KCET Chemistry PYQ Chapter 1 (Some Basic Concepts of Chemistry).
Extract all multiple choice questions visible on this page slice (Questions {q_range}).
For EACH question:
- "q_num": integer question number (e.g. 1, 2, ...)
- "question": exact question text. Use LaTeX $...$ for chemical formulas (e.g. $CaCO_3$, $CO_2$, $H_2SO_4$, $N_2$), units (e.g. $\\text{{dm}}^3$, $\\text{{g/mol}}$), exponents, fractions.
- "options": array of exactly 4 strings [option A, option B, option C, option D]. Clean text with LaTeX $...$. Do NOT include "a)", "b)", etc. prefixes.
- "year": integer KCET year printed next to the question (e.g. 2006, 2014, 2021). If not found, use 2020.
- "explanation": brief concise explanation for the answer (1-2 sentences with LaTeX formulas).

Return ONLY a valid JSON array of objects:
[
  {{
    "q_num": 1,
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "year": 2006,
    "explanation": "..."
  }}
]
"""
    t0 = time.time()
    try:
        resp = requests.post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
            json={
                'model': 'meta/llama-3.2-11b-vision-instruct',
                'messages': [{
                    'role': 'user',
                    'content': [
                        {'type': 'text', 'text': prompt},
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                    ]
                }],
                'max_tokens': 2000,
                'temperature': 0.1
            },
            timeout=60
        )
        if resp.status_code != 200:
            print(f"Error {resp.status_code}: {resp.text}")
            return []
        content = resp.json()['choices'][0]['message']['content'].strip()
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].split('```')[0].strip()
        
        data = json.loads(content)
        print(f"[{tag}] Successfully parsed {len(data)} questions in {time.time() - t0:.1f}s")
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        print(f"[{tag}] Exception: {e}")
        return []

all_extracted = []
for path, tag, q_range in slices:
    res = extract_slice(path, tag, q_range)
    all_extracted.extend(res)
    time.sleep(2)

print(f"\nTotal questions extracted across slices: {len(all_extracted)}")
