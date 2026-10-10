import requests
import base64
import json

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

results = {}
for part in ['top', 'btm']:
    path = f'scratch/chapter_slices/Physics_ch3_p7_right_{part}.jpg'
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': 'Extract all multiple-choice questions visible on this image. Return as a JSON array of objects: [{"q_num": int, "question": "...", "options": ["...", "...", "...", "..."], "year": int}]'},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                ]
            }],
            'max_tokens': 1000,
            'temperature': 0.1
        }
    )
    raw = resp.json()['choices'][0]['message']['content']
    results[part] = raw

with open('scratch/phys_p7r_raw.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, indent=2, ensure_ascii=False)

print("Saved scratch/phys_p7r_raw.json successfully!")
