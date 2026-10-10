import base64
import requests
import json
import time
import os
import re

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

def extract_as_bullets(img_path, tag):
    print(f"Extracting {tag}...", flush=True)
    with open(img_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()

    prompt = """Extract all multiple choice questions on this page of KCET Chemistry Chapter 1.
Format as bullets:
* Question [Number]: [Question text with LaTeX $...$]
  * Options: [Option a], [Option b], [Option c], [Option d]
  * Year: [Year]
  * Correct answer: [Correct option or letter]
  * Explanation: [1 sentence explanation]
"""
    t0 = time.time()
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
        timeout=50
    )
    if resp.status_code == 200:
        content = resp.json()['choices'][0]['message']['content']
        print(f"[{tag}] Finished in {time.time() - t0:.1f}s, length: {len(content)}")
        with open(f'scratch/bullet_{tag}.txt', 'w', encoding='utf-8') as f:
            f.write(content)
        return content
    else:
        print(f"[{tag}] Error {resp.status_code}: {resp.text}")
        return ""

for path, tag in [
    ('scratch/temp_slice_105l.jpg', '105l'),
    ('scratch/temp_slice_105r.jpg', '105r'),
    ('scratch/temp_slice_106l.jpg', '106l')
]:
    if os.path.exists(path):
        extract_as_bullets(path, tag)
        time.sleep(2)

print("All bullet extractions complete!")
