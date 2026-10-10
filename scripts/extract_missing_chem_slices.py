import base64
import requests
import json
import time
import os

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

os.makedirs('scratch/chem_missing', exist_ok=True)

targets = [
    ('scratch/chem_slices/p102_r_bottom.jpg', 'p102_bottom', 'Questions 9 to 14'),
    ('scratch/chem_slices/p103_l_top.jpg', 'p103_l_top', 'Questions 15 to 23'),
    ('scratch/chem_slices/p103_l_bottom.jpg', 'p103_l_bottom', 'Questions 24 to 32')
]

prompt_tmpl = """Extract all multiple choice questions on this page of KCET Chemistry Chapter 1 (Some Basic Concepts of Chemistry).
For EACH question, output:
* Question [Number] ([Year]): [Question text with LaTeX $...$ for chemical formulas and math]
  - a) [Option a with LaTeX $...$]
  - b) [Option b with LaTeX $...$]
  - c) [Option c with LaTeX $...$]
  - d) [Option d with LaTeX $...$]
"""

for path, tag, desc in targets:
    out_file = f'scratch/chem_missing/{tag}.txt'
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100:
        print(f"Skipping {tag} (already exists)")
        continue
    print(f"Extracting {tag} ({desc})...", flush=True)
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    
    t0 = time.time()
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': prompt_tmpl},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                ]
            }],
            'max_tokens': 1500,
            'temperature': 0.1
        },
        timeout=60
    )
    if resp.status_code == 200:
        content = resp.json()['choices'][0]['message']['content']
        print(f"[{tag}] Finished in {time.time()-t0:.1f}s, length: {len(content)}")
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(content)
    else:
        print(f"[{tag}] Error {resp.status_code}: {resp.text}")
    time.sleep(1)

print("All missing slices extraction finished!")
