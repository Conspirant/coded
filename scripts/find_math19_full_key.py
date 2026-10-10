import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Let's inspect page 234 and page 235 in full
for pno in [234, 235]:
    p = pdf[pno - 1].render(scale=2.5).to_pil()
    w, h = p.size
    
    # Save image
    temp_p = f'scratch/math19/p{pno}_full.png'
    p.save(temp_p)
    
    with open(temp_p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': [
                {'type': 'text', 'text': f'Inspect Page {pno}. Look for the table with heading "ANSWER KEY". Read ALL numbers and their answer letters from 1 to the last question. Output ONLY a valid JSON object: {{"1": "a", "2": "b", ...}}'},
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
    print(f"=== PAGE {pno} ===")
    print(raw)
