import base64
import requests
import json
import time

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

def inspect_page(img_path):
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
                    {'type': 'text', 'text': '1. Subject and Chapter title?\n2. Is this Questions or Answers/Solutions or Index?\n3. List exact Question numbers visible (e.g. Q1, Q2, ...).\nKeep under 4 lines.'},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                ]
            }],
            'max_tokens': 150,
            'temperature': 0.1
        },
        timeout=30
    )
    if resp.status_code == 200:
        return resp.json()['choices'][0]['message']['content'].strip()
    return f'Error {resp.status_code}'

pages = [
    ('scratch/chem_inspect/p102_right.jpg', 'Chem p102_right'),
    ('scratch/chem_inspect/p103_left.jpg', 'Chem p103_left'),
    ('scratch/chem_inspect/p103_right.jpg', 'Chem p103_right'),
    ('scratch/chem_inspect/p104_left.jpg', 'Chem p104_left'),
    ('scratch/chem_inspect/p104_right.jpg', 'Chem p104_right'),
    ('scratch/chem_inspect/p105_left.jpg', 'Chem p105_left'),
    ('scratch/chem_inspect/p105_right.jpg', 'Chem p105_right'),
    ('scratch/chem_inspect/p106_left.jpg', 'Chem p106_left'),
    ('scratch/chem_inspect/p106_right.jpg', 'Chem p106_right'),
    ('scratch/math_inspect/p169_right.jpg', 'Math p169_right'),
    ('scratch/math_inspect/p170_left.jpg', 'Math p170_left'),
    ('scratch/math_inspect/p170_right.jpg', 'Math p170_right'),
    ('scratch/math_inspect/p171_left.jpg', 'Math p171_left')
]

with open('scratch/inspect_report.txt', 'w', encoding='utf-8') as out:
    for p, label in pages:
        res = inspect_page(p)
        out.write(f'=== {label} ===\n{res}\n\n')
        out.flush()
        time.sleep(1)

print("Inspection report saved to scratch/inspect_report.txt")
