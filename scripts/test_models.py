import requests
import base64
import time

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

with open('scratch/math_ch2_slices/p170_left_top.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

models = [
    'meta/llama-3.2-11b-vision-instruct',
    'microsoft/phi-3-vision-128k-instruct',
    'meta/llama-3.2-90b-vision-instruct'
]

for model in models:
    t0 = time.time()
    try:
        resp = requests.post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
            json={
                'model': model,
                'messages': [{
                    'role': 'user',
                    'content': [
                        {'type': 'text', 'text': 'Extract questions as a JSON array: [{"q": "..."}]'},
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                    ]
                }],
                'max_tokens': 400
            },
            timeout=25
        )
        print(f"{model} -> status={resp.status_code} in {time.time()-t0:.1f}s")
        if resp.status_code == 200:
            print("Preview:", resp.json()['choices'][0]['message']['content'][:120])
    except Exception as e:
        print(f"{model} failed in {time.time()-t0:.1f}s: {e}")
