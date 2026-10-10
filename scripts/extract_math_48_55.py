import requests
import base64
import pypdfium2 as pdfium
import json
import sys

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
img = pdf[170].render(scale=1.5).to_pil() # PDF 171
w, h = img.size
crop = img.crop((w//2, int(h * 0.40), w, h))
crop.save('scratch/p171r_btm_full.jpg', quality=85)

with open('scratch/p171r_btm_full.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Extract questions 48 to 55 from this image. Transcribe question text, year, and all 4 options for each question verbatim.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]
        }],
        'max_tokens': 1200,
        'temperature': 0.1
    }
)
content = resp.json()['choices'][0]['message']['content']
with open('scratch/p171r_q48_55.txt', 'w', encoding='utf-8') as out:
    out.write(content)

print(f"Successfully saved {len(content)} characters to scratch/p171r_q48_55.txt", flush=True)
