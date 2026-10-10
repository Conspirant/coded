import requests
import base64
import json

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

with open('scratch/math_ch2_inspect/p171_right.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Find the ANSWER KEY table on this page. Extract all question numbers and their corresponding answer options (a, b, c, or d) verbatim. Return as JSON object: {"1": "a", "2": "c", ...}'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]
        }],
        'max_tokens': 600,
        'temperature': 0.1
    }
)

content = resp.json()['choices'][0]['message']['content'].strip()
print("Answer key table output:")
print(content)
with open('scratch/math_ch2_key.txt', 'w', encoding='utf-8') as out:
    out.write(content)
