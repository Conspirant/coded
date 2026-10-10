import base64
import requests
import json
import time
from PIL import Image

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

def extract_section(img_path, prompt, max_tokens=1500):
    with open(img_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
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
            'max_tokens': max_tokens,
            'temperature': 0.1
        },
        timeout=60
    )
    if resp.status_code != 200:
        print(f"Error {resp.status_code}: {resp.text}")
        return ""
    return resp.json()['choices'][0]['message']['content']

# 1. Prepare Chemistry images (Top & Bottom halves)
im_c = Image.open('scratch/chem_ch1/p102_right.png')
wc, hc = im_c.size
im_c.crop((0, 0, wc, int(hc * 0.52))).save('scratch/chem_top.jpg', quality=85)
im_c.crop((0, int(hc * 0.48), wc, hc)).save('scratch/chem_bottom.jpg', quality=85)

# 2. Prepare Math images (Top & Bottom halves)
im_m = Image.open('scratch/math_ch1/p169_right.png')
wm, hm = im_m.size
im_m.crop((0, 0, wm, int(hm * 0.52))).save('scratch/math_top.jpg', quality=85)
im_m.crop((0, int(hm * 0.48), wm, hm)).save('scratch/math_bottom.jpg', quality=85)

print("Images prepared!")

# Extract Chemistry top
prompt_chem = """Extract all questions from this KCET Chemistry exam page.
For each question:
1. Question text with LaTeX for formulas ($CaCO_3$, $CO_2$, $KOH$, etc.).
2. 4 options (a, b, c, d) with LaTeX.
3. Exam year printed next to it.
4. Correct answer index (0 for a, 1 for b, 2 for c, 3 for d).
5. Brief step-by-step solution with LaTeX.

Return ONLY a JSON array:
[
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "..."
  }
]
"""

print("Extracting Chemistry Top...")
c_top_raw = extract_section('scratch/chem_top.jpg', prompt_chem)
with open('scratch/chem_top_raw.json', 'w', encoding='utf-8') as f:
    f.write(c_top_raw)
print("Chemistry Top extracted!")

print("Extracting Chemistry Bottom...")
c_bot_raw = extract_section('scratch/chem_bottom.jpg', prompt_chem)
with open('scratch/chem_bottom_raw.json', 'w', encoding='utf-8') as f:
    f.write(c_bot_raw)
print("Chemistry Bottom extracted!")

prompt_math = """Extract all questions from this KCET Mathematics exam page on Sets.
For each question:
1. Question text with LaTeX for sets ($A \\cap B$, $A \\cup B$, $\\in$, $\\emptyset$, etc.).
2. 4 options (a, b, c, d) with LaTeX.
3. Exam year printed next to it.
4. Correct answer index (0 for a, 1 for b, 2 for c, 3 for d).
5. Step-by-step solution with LaTeX.

Return ONLY a JSON array:
[
  {
    "subject": "Mathematics",
    "chapter": "Sets",
    "chapter_number": 1,
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "..."
  }
]
"""

print("Extracting Math Top...")
m_top_raw = extract_section('scratch/math_top.jpg', prompt_math)
with open('scratch/math_top_raw.json', 'w', encoding='utf-8') as f:
    f.write(m_top_raw)
print("Math Top extracted!")

print("Extracting Math Bottom...")
m_bot_raw = extract_section('scratch/math_bottom.jpg', prompt_math)
with open('scratch/math_bottom_raw.json', 'w', encoding='utf-8') as f:
    f.write(m_bot_raw)
print("Math Bottom extracted!")
