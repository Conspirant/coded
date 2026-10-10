import pypdfium2 as pdfium
import os
import base64
import requests
import json

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
total = len(pdf)
print(f"Total pages: {total}")

# Let's sample key pages for Chemistry (102-168) and Mathematics (169-240)
# to map out where each chapter starts
os.makedirs('scratch/chapter_samples', exist_ok=True)

def analyze_header(page_num, side):
    page = pdf[page_num - 1]
    img = page.render(scale=1.2).to_pil()
    w, h = img.size
    if side == 'left':
        crop = img.crop((0, 0, w // 2, int(h * 0.22)))
    else:
        crop = img.crop((w // 2, 0, w, int(h * 0.22)))
    
    sample_path = f'scratch/chapter_samples/p{page_num}_{side}.png'
    crop.save(sample_path)
    
    with open(sample_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': 'Read the header/chapter title from this page top banner. Return ONLY JSON: {"subject": "Physics"|"Chemistry"|"Mathematics", "chapter_number": int or null, "chapter_name": "string" or null, "is_chapter_start": bool}'},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
                ]
            }],
            'max_tokens': 150
        }
    )
    try:
        content = resp.json()['choices'][0]['message']['content'].strip()
        # strip markdown fence
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].split('```')[0].strip()
        data = json.loads(content)
        data['page'] = page_num
        data['side'] = side
        return data
    except Exception as e:
        return {'page': page_num, 'side': side, 'raw': resp.text[:100]}

# Test Chemistry start (page 102 right, page 103 left)
# Test Math start (page 169 right, page 170 left)
for p, s in [(102, 'right'), (103, 'left'), (103, 'right'), (169, 'right'), (170, 'left'), (170, 'right')]:
    res = analyze_header(p, s)
    print(f"P{p} {s}:", res)
