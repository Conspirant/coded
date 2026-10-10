import json
import requests
import base64
import re
import sys

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

with open('scratch/chapter_slices/Mathematics_ch2_p170_left_top.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Extract questions as JSON array. For each: q_num (int), question (str), options (array of 4 strings), year (int). Wrap math in $...$.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]
        }],
        'max_tokens': 1000,
        'temperature': 0.1
    }
)
raw = resp.json()['choices'][0]['message']['content']
with open('scratch/p170_top_raw.txt', 'w', encoding='utf-8') as f:
    f.write(raw)

print("Saved raw p170 top to scratch/p170_top_raw.txt")
