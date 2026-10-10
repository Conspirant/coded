import pypdfium2 as pdfium
import requests
import base64
import json

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
img = pdf[10].render(scale=1.5).to_pil()
w, h = img.size
crop = img.crop((0, int(h * 0.45), w//2, h))
crop.save('scratch/p11l_key_crop.jpg')

with open('scratch/p11l_key_crop.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Extract all rows from the ANSWER KEY table here as a JSON object: {"1": "a", "2": "b", ...}'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]
        }],
        'max_tokens': 600,
        'temperature': 0.1
    }
)
content = resp.json()['choices'][0]['message']['content'].strip()
print("Physics Ch 4 Key:")
print(content)
with open('scratch/phys_ch4_key.json', 'w', encoding='utf-8') as f:
    f.write(content)
