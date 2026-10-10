import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Let's inspect where Answer Key is on page 76 / 77
for pno in [76, 77]:
    p = pdf[pno - 1].render(scale=3.0).to_pil()
    w, h = p.size
    crop_grid = p.crop((0, int(h * 0.1), w, int(h * 0.7)))
    temp_p = f'scratch/phys23/p{pno}_key_crop.png'
    crop_grid.save(temp_p)
    
    with open(temp_p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': [
                {'type': 'text', 'text': 'Extract the complete ANSWER KEY table for Ray Optics (Chapter 23 Physics) from this image. Output a strict JSON object mapping question number string to option letter: {"1": "a", "2": "b", ...}. Output ONLY valid JSON.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
            ]}],
            'max_tokens': 1500
        },
        timeout=60
    )
    raw = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in raw:
        raw = raw.split('```json')[1].split('```')[0].strip()
    elif '```' in raw:
        raw = raw.split('```')[1].split('```')[0].strip()
    print(f"=== PAGE {pno} KEY ===")
    print(raw)
    if "{" in raw and "}" in raw and len(raw) > 50:
        with open('scratch/phys23/answer_key_strict.json', 'w', encoding='utf-8') as f:
            f.write(raw)
        print(f"Saved Phys 23 key from page {pno}!")
        break
