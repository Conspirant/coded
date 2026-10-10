import base64
import requests
import json
import time
from PIL import Image

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

im = Image.open('scratch/chem_ch1/p102_right.png')
w, h = im.size
# Top half
top = im.crop((0, 0, w, h // 2))
top.save('scratch/chem_top.jpg', quality=85)

with open('scratch/chem_top.jpg', 'rb') as f:
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
                {'type': 'text', 'text': 'Extract questions from this image into a JSON array: [{"question": "...", "options": ["..."], "year": 2010, "correct_answer": 0, "explanation": "..."}]. Format math/chemistry with LaTeX $...$. Return ONLY valid JSON array.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]
        }],
        'max_tokens': 1500,
        'temperature': 0.1
    },
    timeout=60
)
print(f'Finished in {time.time() - t0:.1f}s, Status: {resp.status_code}')
data = resp.json()
if 'choices' in data:
    text = data['choices'][0]['message']['content']
    print(text[:400])
else:
    print(data)
