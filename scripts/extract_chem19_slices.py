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
    temp_p = 'scratch/chem19/temp/temp_slice.png'
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
            'max_tokens': 3000
        },
        timeout=60
    )
    raw = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in raw:
        raw = raw.split('```json')[1].split('```')[0].strip()
    elif '```' in raw:
        raw = raw.split('```')[1].split('```')[0].strip()
    return json.loads(raw)

# Slices of questions
# 1. P164 right (Q1 to Q14)
p164 = pdf[163].render(scale=2.0).to_pil()
w164, h164 = p164.size
q_slice1 = p164.crop((w164 // 2, 0, w164, h164))

# 2. P165 left (Q15 to Q25)
p165 = pdf[164].render(scale=2.0).to_pil()
w165, h165 = p165.size
q_slice2 = p165.crop((0, 0, w165 // 2, h165))

# 3. P165 right (Q26 to Q37)
q_slice3 = p165.crop((w165 // 2, 0, w165, h165))

# 4. P166 left (Q38 to Q47)
p166 = pdf[165].render(scale=2.0).to_pil()
w166, h166 = p166.size
q_slice4 = p166.crop((0, 0, int(w166 * 0.45), int(h166 * 0.7)))

prompt = """Extract all KCET multiple-choice questions from this image for Biomolecules (Chapter 19 Chemistry).
Return ONLY a JSON list of objects:
[
  {
    "q_num": int,
    "year": int,
    "question": "string with LaTeX formulas like $\\alpha$-D-glucose, $\\text{C}_6\\text{H}_{12}\\text{O}_6$",
    "options": ["string for option A", "string for option B", "string for option C", "string for option D"],
    "has_diagram": bool
  }
]"""

print("Extracting Slice 1 (Q1-Q14)...")
qs1 = extract_vision(q_slice1, prompt)
print(f"Extracted {len(qs1)} questions from Slice 1")

print("Extracting Slice 2 (Q15-Q25)...")
qs2 = extract_vision(q_slice2, prompt)
print(f"Extracted {len(qs2)} questions from Slice 2")

print("Extracting Slice 3 (Q26-Q37)...")
qs3 = extract_vision(q_slice3, prompt)
print(f"Extracted {len(qs3)} questions from Slice 3")

print("Extracting Slice 4 (Q38-Q47)...")
qs4 = extract_vision(q_slice4, prompt)
print(f"Extracted {len(qs4)} questions from Slice 4")

all_qs = qs1 + qs2 + qs3 + qs4
print(f"Total extracted questions: {len(all_qs)}")
with open('scratch/chem19/all_questions_raw.json', 'w', encoding='utf-8') as f:
    json.dump(all_qs, f, indent=2)
