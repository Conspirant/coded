import pypdfium2 as pdfium
import requests, base64, json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

with open('scratch/chem19/answer_key_strict.json', 'r', encoding='utf-8') as f:
    ans_key = json.load(f)

print(f"Loaded answer key for {len(ans_key)} questions.")

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Let's inspect pages 164, 165, 166 for Biomolecules questions
# Page 164: Column 3 and 4
# Page 165: Column 1, 2, 3, 4
# Page 166: Column 1, 2
# Solutions start on Page 166 Column 2 bottom, Page 167, Page 168

# Let's write a targeted extraction prompt for Nvidia LLama 3.2 Vision to extract all questions and solutions in structured JSON
def extract_batch(pages_info, prompt_text):
    # pages_info: list of (page_num, crop_box)
    images_b64 = []
    for pno, crop_box in pages_info:
        p = pdf[pno - 1].render(scale=2.0).to_pil()
        if crop_box:
            p = p.crop(crop_box)
        temp_path = f'scratch/chem19/temp_{pno}.png'
        p.save(temp_path)
        with open(temp_path, 'rb') as f:
            images_b64.append(base64.b64encode(f.read()).decode())
            
    content = [{'type': 'text', 'text': prompt_text}]
    for b64 in images_b64:
        content.append({'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}})
        
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': content}],
            'max_tokens': 4000
        }
    )
    raw = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in raw:
        raw = raw.split('```json')[1].split('```')[0].strip()
    elif '```' in raw:
        raw = raw.split('```')[1].split('```')[0].strip()
    return raw

# Let's extract Q1 to Q20 from Page 164 & 165
# Let's extract Q21 to Q47 from Page 165 & 166
# Let's extract solutions from Pages 166, 167, 168
