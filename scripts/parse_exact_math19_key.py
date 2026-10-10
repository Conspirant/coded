import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Page 234 or 235: Let's render and crop the ANSWER KEY table for Vector Algebra
for pno in [234, 235]:
    p = pdf[pno - 1].render(scale=3.0).to_pil()
    w, h = p.size
    # Save the whole page
    os.makedirs('scratch/math19', exist_ok=True)
    p_path = f'scratch/math19/pdf_p{pno}_highres.png'
    p.save(p_path)
    
    # Crop middle area where ANSWER KEY grid usually sits
    crop_grid = p.crop((0, int(h * 0.3), w, int(h * 0.85)))
    crop_path = f'scratch/math19/p{pno}_grid.png'
    crop_grid.save(crop_path)
    
    with open(crop_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': [
                {'type': 'text', 'text': 'Extract the complete ANSWER KEY table for Vector Algebra (Chapter 19 Mathematics) from this image. Return a strict JSON mapping every question number string to its option letter: {"1": "a", "2": "b", ...}. Output ONLY valid JSON.'},
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
    print(f"Page {pno} Key:", raw)
    if "{" in raw and "}" in raw and len(raw) > 50:
        with open('scratch/math19/answer_key_strict.json', 'w', encoding='utf-8') as f:
            f.write(raw)
        print(f"Saved Math 19 key successfully from page {pno}!")
        break
