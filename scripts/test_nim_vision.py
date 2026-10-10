import base64
import requests
import time
from PIL import Image

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

img = Image.open('scratch/chem_ch1/p102_right.png')
img.thumbnail((1200, 1600))
img.save('scratch/chem_ch1/p102_opt.jpg', quality=85)

with open('scratch/chem_ch1/p102_opt.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

print('Optimized base64 size:', len(b64) // 1024, 'KB')

t0 = time.time()
resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Extract questions and answers from this image in JSON format.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]
        }],
        'max_tokens': 2000,
        'temperature': 0.1
    },
    timeout=60
)
print('Status:', resp.status_code, 'Time:', f'{time.time() - t0:.1f}s')
data = resp.json()
if 'choices' in data:
    print('Content:', data['choices'][0]['message']['content'][:500])
else:
    print('Error:', data)
