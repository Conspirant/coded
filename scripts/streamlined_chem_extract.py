import base64
import requests
import json
import time
import os
from PIL import Image

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

def extract_slice(img_path, slice_name):
    print(f"Extracting {slice_name} ({img_path})...", flush=True)
    im = Image.open(img_path)
    im.thumbnail((1100, 1500))
    temp = f'scratch/opt_{slice_name}.jpg'
    im.save(temp, quality=80)
    
    with open(temp, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = """Extract all multiple choice questions on this page of KCET Chemistry Chapter 1 (Some Basic Concepts of Chemistry).
For each question:
- question: exact text with LaTeX $...$
- options: 4 options with LaTeX $...$
- year: exam year (e.g. 2006, 2012)
- correct_answer: 0 for (a), 1 for (b), 2 for (c), 3 for (d)
- explanation: concise 1-2 sentence solution with LaTeX $...$

Return ONLY valid JSON array with this schema:
[
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correct_answer": 0,
    "year": 2010,
    "explanation": "...",
    "needs_image": false,
    "image_url": ""
  }
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
                'max_tokens': 1500,
                'temperature': 0.1
            },
            timeout=90
        )
        print(f"Done in {time.time() - t0:.1f}s, Status: {resp.status_code}", flush=True)
        if resp.status_code != 200:
            return []
        raw = resp.json()['choices'][0]['message']['content'].strip()
        if '```json' in raw:
            raw = raw.split('```json')[1].split('```')[0].strip()
        elif '```' in raw:
            raw = raw.split('```')[1].split('```')[0].strip()
        return json.loads(raw)
    except Exception as e:
        print(f"Error: {e}", flush=True)
        return []

slices = [
    ('scratch/chem_p102_right.jpg', 'part1'),
    ('scratch/chem_p103_right.jpg', 'part2'),
    ('scratch/chem_p104_right.jpg', 'part3'),
    ('scratch/chem_p105_left.jpg', 'part4'),
    ('scratch/chem_p105_right.jpg', 'part5'),
    ('scratch/chem_p106_left.jpg', 'part6')
]

all_qs = []
for p, name in slices:
    if os.path.exists(p):
        qs = extract_slice(p, name)
        print(f"Extracted {len(qs)} questions from {name}", flush=True)
        all_qs.extend(qs)

# Filter unique by question text prefix
unique = []
seen = set()
for q in all_qs:
    key = q['question'][:35].lower().strip()
    if key not in seen:
        seen.add(key)
        unique.append(q)

print(f"\n==========================================")
print(f"TOTAL UNIQUE QUESTIONS EXTRACTED: {len(unique)}")
print(f"==========================================")
with open('src/data/pyq_chemistry_ch1_full.json', 'w', encoding='utf-8') as f:
    json.dump(unique, f, indent=2)
