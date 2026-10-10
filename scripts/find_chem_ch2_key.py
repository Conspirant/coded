import pypdfium2 as pdfium
import requests
import base64
import json

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

for p_num, side, y1, y2, tag in [(108, 'left', 0.6, 1.0, 'p108l_btm'), (107, 'right', 0.6, 1.0, 'p107r_btm')]:
    page = pdf[p_num - 1]
    img = page.render(scale=1.5).to_pil()
    w, h = img.size
    crop = img.crop((0, int(h * y1), w//2, int(h * y2))) if side == 'left' else img.crop((w//2, int(h * y1), w, int(h * y2)))
    path = f'scratch/{tag}.jpg'
    crop.save(path, quality=85)
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
                    {'type': 'text', 'text': 'Read all text in this crop. Is there an ANSWER KEY table? If yes, extract all rows as JSON: {"1": "a", ...}'},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                ]
            }],
            'max_tokens': 400,
            'temperature': 0.1
        }
    )
    print(f"=== {tag} ===")
    print(resp.json()['choices'][0]['message']['content'].strip())
