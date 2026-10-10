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

def extract_from_slice(img_path, page_desc, prompt_extra=""):
    im = Image.open(img_path)
    im.thumbnail((1200, 1600))
    temp_path = 'scratch/temp_extract.jpg'
    im.save(temp_path, quality=85)
    
    with open(temp_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""You are an expert exam digitizer for Karnataka CET (KCET).
This image shows: {page_desc} of KCET Chemistry Chapter 1: Some Basic Concepts of Chemistry.
{prompt_extra}

Extract all questions visible on this page.
For each question:
- question: text with proper LaTeX $...$ for chemical formulas ($CaCO_3$, $H_2SO_4$, $CO_2$), math symbols, and units ($g$, $mol$, $dm^3$).
- options: array of 4 options (a, b, c, d) with LaTeX $...$.
- year: exam year (e.g. 2006, 2012, etc.) printed next to question.
- correct_answer: 0 for a, 1 for b, 2 for c, 3 for d (look at answer key or solution).
- explanation: step-by-step solution with LaTeX $...$.

Return ONLY a valid JSON array:
[
  {{
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
  }}
]
"""

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
            'max_tokens': 2500,
            'temperature': 0.1
        },
        timeout=60
    )
    if resp.status_code != 200:
        print(f"Error: {resp.status_code} - {resp.text}")
        return []
    content = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in content:
        content = content.split('```json')[1].split('```')[0].strip()
    elif '```' in content:
        content = content.split('```')[1].split('```')[0].strip()
    try:
        return json.loads(content)
    except Exception as e:
        print(f"JSON Parse error: {e}")
        return []

# Slices for Chemistry Chapter 1
slices = [
    ('scratch/chem_p102_right.jpg', 'Questions 1-8'),
    ('scratch/chem_p103_right.jpg', 'Questions 9-16'),
    ('scratch/chem_p104_right.jpg', 'Questions 17-24'),
    ('scratch/chem_p105_left.jpg', 'Questions 25-32'),
    ('scratch/chem_p105_right.jpg', 'Questions 33-38'),
    ('scratch/chem_p106_left.jpg', 'Questions 39-42 and solutions')
]

all_extracted = []
for path, desc in slices:
    if os.path.exists(path):
        print(f"\nProcessing {desc} ({path})...", flush=True)
        t0 = time.time()
        qs = extract_from_slice(path, desc)
        print(f"Extracted {len(qs)} questions in {time.time() - t0:.1f}s", flush=True)
        all_extracted.extend(qs)

# Deduplicate by question text
unique_qs = []
seen = set()
for q in all_extracted:
    short_q = q['question'][:30].strip().lower()
    if short_q not in seen:
        seen.add(short_q)
        unique_qs.append(q)

print(f"\nTotal unique questions extracted for Chemistry Chapter 1: {len(unique_qs)}")
with open('scratch/chem_all_42_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(unique_qs, f, indent=2)
