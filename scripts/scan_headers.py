import pypdfium2 as pdfium
import requests
import base64
import json
import os
import time

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/header_test', exist_ok=True)

def check_header(p_num, side):
    page = pdf[p_num - 1]
    img = page.render(scale=1.2).to_pil()
    w, h = img.size
    crop = img.crop((0, 0, w//2, int(h*0.22))) if side == 'left' else img.crop((w//2, 0, w, int(h*0.22)))
    path = f'scratch/header_test/p{p_num}_{side}.jpg'
    crop.save(path, quality=80)
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    try:
        resp = requests.post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
            json={
                'model': 'meta/llama-3.2-11b-vision-instruct',
                'messages': [{
                    'role': 'user',
                    'content': [
                        {'type': 'text', 'text': 'Is there a chapter title banner in this image? Return ONLY JSON: {"is_start": true/false, "title": "...", "chapter_number": int/null}'},
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                    ]
                }],
                'max_tokens': 100,
                'temperature': 0.1
            },
            timeout=15
        )
        return resp.json()['choices'][0]['message']['content'].strip()
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    for p in [3, 4, 5, 6, 7]:
        for s in ['left', 'right']:
            res = check_header(p, s)
            print(f'P{p}_{s}: {res}', flush=True)
