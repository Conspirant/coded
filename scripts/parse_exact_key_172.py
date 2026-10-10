import requests
import base64
import json

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

with open('scratch/p172l_top.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Extract every single question number and its answer option from this ANSWER KEY table. Format as JSON object: {"1": "b", "2": "a", ...}. Include all 1 to 53 entries precisely as printed.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]
        }],
        'max_tokens': 800,
        'temperature': 0.1
    }
)

content = resp.json()['choices'][0]['message']['content'].strip()
print("Math Ch 2 Key extracted:")
print(content)
with open('scratch/math_ch2_exact_key.json', 'w', encoding='utf-8') as f:
    f.write(content)
