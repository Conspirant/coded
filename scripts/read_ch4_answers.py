import requests
import base64
import json

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

answers = {}

for p, side in [(10, 'left'), (10, 'right'), (11, 'left')]:
    path = f'scratch/ch4_check_{p}_{side}.jpg'
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
                    {'type': 'text', 'text': 'In the EXPLANATIONS section on this page, look at each numbered solution (e.g. "1. (a)", "2. (c)", "3. (d)"). Extract the question number and its answer letter. Return as JSON object: {"1": "a", ...}'},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                ]
            }],
            'max_tokens': 500,
            'temperature': 0.1
        }
    )
    content = resp.json()['choices'][0]['message']['content'].strip()
    print(f"P{p}_{side}:")
    print(content)
    s = content.find('{')
    e = content.rfind('}')
    if s != -1 and e != -1 and e > s:
        try:
            parsed = json.loads(content[s:e+1])
            answers.update(parsed)
        except Exception:
            pass

print(f"\nTotal extracted answers for Chapter 4: {len(answers)}")
print(answers)
with open('scratch/phys_ch4_answers.json', 'w', encoding='utf-8') as f:
    json.dump(answers, f, indent=2)
