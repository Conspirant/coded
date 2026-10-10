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

def extract_one_slice(img_path, slice_tag):
    im = Image.open(img_path)
    im.thumbnail((1000, 1400))
    temp = f'scratch/temp_{slice_tag}.jpg'
    im.save(temp, quality=80)
    
    with open(temp, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()

    prompt = """Extract all questions on this page of KCET Chemistry Chapter 1 (Some Basic Concepts of Chemistry).
Format math and chemical formulas with LaTeX $...$.
Return a JSON array:
[
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "chapter_number": 1,
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correct_answer": 0,
    "year": 2012,
    "explanation": "..."
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
                'max_tokens': 1200,
                'temperature': 0.1
            },
            timeout=40
        )
        content = resp.json()['choices'][0]['message']['content']
        # extract json array
        start = content.find('[')
        end = content.rfind(']')
        if start != -1 and end != -1 and end > start:
            parsed = json.loads(content[start:end+1])
            print(f"[{slice_tag}] Successfully extracted {len(parsed)} questions in {time.time() - t0:.1f}s", flush=True)
            return parsed
        else:
            print(f"[{slice_tag}] No JSON array found in output ({time.time() - t0:.1f}s)", flush=True)
            with open(f'scratch/raw_{slice_tag}.txt', 'w', encoding='utf-8') as f:
                f.write(content)
            return []
    except Exception as e:
        print(f"[{slice_tag}] Failed: {e}", flush=True)
        return []

targets = [
    ('scratch/chem_p103_right.jpg', 'slice_103r'),
    ('scratch/chem_p104_right.jpg', 'slice_104r'),
    ('scratch/chem_p105_left.jpg', 'slice_105l'),
    ('scratch/chem_p105_right.jpg', 'slice_105r'),
    ('scratch/chem_p106_left.jpg', 'slice_106l')
]

all_new = []
for p, tag in targets:
    if os.path.exists(p):
        qs = extract_one_slice(p, tag)
        all_new.extend(qs)
        time.sleep(2)

print(f"\nTotal new questions extracted: {len(all_new)}", flush=True)
with open('scratch/chem_new_slices.json', 'w', encoding='utf-8') as f:
    json.dump(all_new, f, indent=2)
