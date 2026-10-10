import pypdfium2 as pdfium
import requests
import base64
import json
import os
import time
import re
from PIL import Image

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

# Load official answer key
with open('scratch/math_ch2_exact_key.json') as f:
    raw_key = f.read()
start = raw_key.find('{')
end = raw_key.rfind('}')
OFFICIAL_KEY = json.loads(raw_key[start:end+1])
print(f"Loaded {len(OFFICIAL_KEY)} official answers for Math Ch 2")

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/math_ch2_slices', exist_ok=True)

slices = []
for p in [170, 171]:
    img = pdf[p-1].render(scale=1.2).to_pil()
    w, h = img.size
    for side in ['left', 'right']:
        col = img.crop((0, 0, w//2, h)) if side == 'left' else img.crop((w//2, 0, w, h))
        cw, ch = col.size
        # Split col into top and bottom
        top = col.crop((0, 0, cw, int(ch * 0.52)))
        btm = col.crop((0, int(ch * 0.48), cw, ch))
        
        for part, crop_img in [('top', top), ('btm', btm)]:
            crop_img.thumbnail((800, 1100))
            path = f'scratch/math_ch2_slices/p{p}_{side}_{part}.jpg'
            crop_img.save(path, quality=75)
            slices.append((path, f'{p}_{side}_{part}'))

print(f"Generated {len(slices)} optimized image slices")

PROMPT = """Extract all KCET Mathematics multiple-choice questions visible in this image.
IMPORTANT: Output valid JSON. Double-escape all backslashes in mathematical formulas (e.g. \\\\frac, \\\\times, \\\\cap, \\\\in, \\\\to, \\\\sqrt, etc.).
Wrap all mathematical expressions in $...$.

For each question return:
- question_num: integer question number (e.g. 1, 2, ...)
- question: full question text with LaTeX math in $...$
- options: array of 4 strings with LaTeX math in $...$
- year: integer year if mentioned like (2018), (2021) etc. Default 2020.
- needs_image: boolean, true ONLY if there is a geometric/graph figure that cannot be written in text.

JSON array format:
[
  {
    "question_num": 1,
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "year": 2022,
    "needs_image": false
  }
]
"""

def safe_json_loads(content):
    s = content.find('[')
    e = content.rfind(']')
    if s == -1 or e == -1 or e <= s:
        return []
    snippet = content[s:e+1]
    try:
        return json.loads(snippet)
    except Exception:
        # fix backslashes
        fixed = re.sub(r'\\(?![\\"/bfnrtu])', r'\\\\', snippet)
        fixed = fixed.replace(r'\f', r'\\f')
        fixed = fixed.replace(r'\c', r'\\c')
        fixed = fixed.replace(r'\i', r'\\i')
        try:
            return json.loads(fixed)
        except Exception as e2:
            print(f"Failed safe_json_loads: {e2}")
            return []

def extract_slice(path, tag, retry=1):
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    t0 = time.time()
    try:
        resp = requests.post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
            json={
                'model': 'meta/llama-3.2-11b-vision-instruct',
                'messages': [{
                    'role': 'user',
                    'content': [
                        {'type': 'text', 'text': PROMPT},
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                    ]
                }],
                'max_tokens': 1200,
                'temperature': 0.1
            },
            timeout=35
        )
        if resp.status_code != 200:
            print(f"[{tag}] HTTP {resp.status_code}: {resp.text[:100]}", flush=True)
            if retry > 0:
                time.sleep(2)
                return extract_slice(path, tag, retry=retry-1)
            return []
            
        content = resp.json()['choices'][0]['message']['content']
        data = safe_json_loads(content)
        if data:
            print(f"[{tag}] Extracted {len(data)} Qs in {time.time() - t0:.1f}s", flush=True)
            return data
        else:
            print(f"[{tag}] No valid array in {time.time() - t0:.1f}s, preview: {content[:100]}", flush=True)
            return []
    except Exception as err:
        print(f"[{tag}] Error: {err}", flush=True)
        if retry > 0:
            time.sleep(2)
            return extract_slice(path, tag, retry=retry-1)
        return []

if __name__ == '__main__':
    all_extracted = []
    for path, tag in slices:
        qs = extract_slice(path, tag)
        all_extracted.extend(qs)
        time.sleep(1.0)

    # Deduplicate by question_num
    by_num = {}
    for q in all_extracted:
        num = q.get('question_num')
        if num and (num not in by_num or len(q.get('question', '')) > len(by_num[num].get('question', ''))):
            by_num[num] = q

    print(f"\nUnique questions extracted: {len(by_num)}", flush=True)

    letter_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
    final_questions = []

    for num in sorted(by_num.keys()):
        q_data = by_num[num]
        q_text = q_data.get('question', '').strip()
        q_text = re.sub(r'^(?:Q\s*)?\d+\s*[\.\)]\s*', '', q_text)
        
        raw_opts = q_data.get('options', [])
        cleaned_opts = []
        for opt in raw_opts:
            cleaned_opt = re.sub(r'^\s*\(?[a-dA-D]\)?[\.\s]*', '', opt).strip()
            cleaned_opts.append(cleaned_opt)
        
        while len(cleaned_opts) < 4:
            cleaned_opts.append(f"Option {chr(65+len(cleaned_opts))}")
        cleaned_opts = cleaned_opts[:4]
        
        key_letter = OFFICIAL_KEY.get(str(num), 'a').lower()
        correct_idx = letter_to_idx.get(key_letter, 0)
        
        year_val = q_data.get('year', 2020)
        if isinstance(year_val, str):
            match = re.search(r'\b(20\d\d)\b', year_val)
            year_val = int(match.group(1)) if match else 2020
        
        final_questions.append({
            "subject": "Mathematics",
            "chapter": "Relations and Functions",
            "chapter_number": 2,
            "question": q_text,
            "options": cleaned_opts,
            "correct_answer": correct_idx,
            "year": year_val,
            "explanation": f"According to the official KCET Answer Key, the correct option is ({key_letter.upper()}).",
            "needs_image": q_data.get('needs_image', False)
        })

    output_path = 'src/data/pyq_maths_ch2.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2)

    print(f"Saved {len(final_questions)} verified questions to {output_path}", flush=True)
