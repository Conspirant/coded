import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

with open('scratch/chem19/answer_key_strict.json', 'r', encoding='utf-8') as f:
    ans_key = json.load(f)

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

def extract_vision(img, prompt):
    os.makedirs('scratch/chem19/temp', exist_ok=True)
    temp_p = 'scratch/chem19/temp/temp.png'
    img.save(temp_p)
    with open(temp_p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': [
                {'type': 'text', 'text': prompt},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
            ]}],
            'max_tokens': 3500
        },
        timeout=60
    )
    raw = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in raw:
        raw = raw.split('```json')[1].split('```')[0].strip()
    elif '```' in raw:
        raw = raw.split('```')[1].split('```')[0].strip()
    return raw

# Page 164: Chemistry Ch 19 starts on the right half (Columns 3 & 4)
p164 = pdf[163].render(scale=2.5).to_pil()
w, h = p164.size
p164_right = p164.crop((w // 2, 0, w, h))

# Page 165: Full page has questions
p165 = pdf[164].render(scale=2.5).to_pil()
w, h = p165.size
p165_left = p165.crop((0, 0, w // 2, h))
p165_right = p165.crop((w // 2, 0, w, h))

# Page 166: Left half has questions Q38 to Q47, then Answer Key
p166 = pdf[165].render(scale=2.5).to_pil()
w, h = p166.size
p166_left = p166.crop((0, 0, w // 2, h))

prompt_q = """Extract all multiple choice questions from this page image.
For each question, return a JSON object with:
- "q_num": int (question number, e.g. 1, 2, ...)
- "year": int (e.g. 2006, 2015, ...)
- "question": string (full question text, use LaTeX $...$ for chemical formulas, e.g. $\\text{C}_6\\text{H}_{12}\\text{O}_6$, $\\alpha$-D-glucose)
- "options": list of 4 strings (e.g. ["(a) ...", "(b) ...", "(c) ...", "(d) ..."] without the (a)/(b) prefixes)
- "has_diagram": bool (true if this question has a molecular structure image/diagram)

Return a JSON list of objects: [{...}, {...}]"""

print("Extracting P164 right...")
res1 = extract_vision(p164_right, prompt_q)
with open('scratch/chem19/qs_p164.json', 'w', encoding='utf-8') as f:
    f.write(res1)
print("Saved P164 qs.")

print("Extracting P165 left...")
res2 = extract_vision(p165_left, prompt_q)
with open('scratch/chem19/qs_p165_l.json', 'w', encoding='utf-8') as f:
    f.write(res2)
print("Saved P165 left qs.")

print("Extracting P165 right...")
res3 = extract_vision(p165_right, prompt_q)
with open('scratch/chem19/qs_p165_r.json', 'w', encoding='utf-8') as f:
    f.write(res3)
print("Saved P165 right qs.")

print("Extracting P166 left...")
res4 = extract_vision(p166_left, prompt_q)
with open('scratch/chem19/qs_p166_l.json', 'w', encoding='utf-8') as f:
    f.write(res4)
print("Saved P166 left qs.")
