import base64
import requests

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

for name, path in [('Chem Bottom', 'scratch/chem_bottom.jpg'), ('Math Bottom', 'scratch/math_bottom.jpg')]:
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
                    {'type': 'text', 'text': 'Read the ANSWER KEY and question numbers at the bottom of this image. List them.'},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                ]
            }],
            'max_tokens': 300
        },
        timeout=30
    )
    print(f"=== {name} ===")
    print(resp.json()['choices'][0]['message']['content'])
