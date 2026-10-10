import pypdfium2 as pdfium
import requests
import base64

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

for p in range(8, 12):
    page = pdf[p - 1]
    img = page.render(scale=1.2).to_pil()
    w, h = img.size
    for side in ['left', 'right']:
        col = img.crop((0, 0, w//2, h)) if side == 'left' else img.crop((w//2, 0, w, h))
        path = f'scratch/ch4_check_{p}_{side}.jpg'
        col.save(path, quality=75)
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
                        {'type': 'text', 'text': 'Is the table titled "ANSWER KEY" on this page? If yes, where (top/mid/bottom) and what is the first row (e.g. 1.(a) or 1. (b))? If no, say "NO".'},
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                    ]
                }],
                'max_tokens': 100,
                'temperature': 0.1
            }
        )
        print(f"P{p}_{side}:", resp.json()['choices'][0]['message']['content'].strip())
