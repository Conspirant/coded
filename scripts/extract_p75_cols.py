import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
p = pdf[75 - 1].render(scale=2.0).to_pil()
w, h = p.size

# Column 3: x from 0.48 to 0.75
# Column 4: x from 0.74 to 1.0
subtasks = [
    {"name": "p75_col3", "crop": (0.48, 0.0, 0.75, 1.0), "desc": "Page 75 column 3 (Q38 to Q42)"},
    {"name": "p75_col4", "crop": (0.74, 0.0, 1.0, 1.0), "desc": "Page 75 column 4 (Q43 to Q46)"}
]

for st in subtasks:
    c = st['crop']
    crop_img = p.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    temp_img = f"scratch/phys23/parsed_chunks/{st['name']}.png"
    crop_img.save(temp_img)
    
    with open(temp_img, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""Transcribe all questions from this column: {st['desc']}.
Preserve mathematical formulas in LaTeX.
Output: Question number, Year, Full question text, and 4 options (a, b, c, d)."""

    print(f"Extracting {st['name']}...")
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': [
                {'type': 'text', 'text': prompt},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
            ]}],
            'max_tokens': 2000
        },
        timeout=60
    )
    content = resp.json()['choices'][0]['message']['content']
    out_json = f"scratch/phys23/parsed_chunks/{st['name']}.json"
    with open(out_json, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Done {st['name']} ({len(content)} chars)")

pdf.close()
