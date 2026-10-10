import base64
import requests
import json
import time
from PIL import Image

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

def extract_page(img_path, subject, chapter_name, chapter_number):
    print(f"Extracting {subject} Chapter {chapter_number}: {chapter_name}...", flush=True)
    
    # Optimize image
    im = Image.open(img_path)
    im.thumbnail((1200, 1600))
    temp_path = f'scratch/opt_{subject.lower()}_ch{chapter_number}.jpg'
    im.save(temp_path, quality=85)
    
    with open(temp_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""You are an expert exam digitizer for Karnataka CET (KCET).
Analyze this page of KCET {subject} questions for Chapter {chapter_number}: {chapter_name}.

Extract EVERY question on this page.
For each question:
1. Extract question text. Wrap any formulas, chemical formulas (e.g. $CaCO_3$, $H_2SO_4$, $CO_2$), math symbols, or units in LaTeX ($...$).
2. Extract the 4 options (a, b, c, d) with LaTeX ($...$).
3. Extract the year (e.g. 2006, 2012, 2018, etc.) shown next to the question.
4. Check the ANSWER KEY shown at the bottom of the page to find the correct answer (0 for a, 1 for b, 2 for c, 3 for d).
5. Provide a clear step-by-step solution / explanation with LaTeX ($...$).

Return ONLY valid JSON array with this schema (no markdown fences):
[
  {{
    "subject": "{subject}",
    "chapter": "{chapter_name}",
    "chapter_number": {chapter_number},
    "question": "question with $...$",
    "options": ["optA", "optB", "optC", "optD"],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "explanation with $...$",
    "needs_image": false,
    "image_url": ""
  }}
]
"""

    t0 = time.time()
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': prompt},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                ]
            }],
            'max_tokens': 3500,
            'temperature': 0.1
        },
        timeout=60
    )
    
    print(f"API finished in {time.time() - t0:.1f}s", flush=True)
    if resp.status_code != 200:
        print(f"Error: {resp.status_code} - {resp.text}")
        return []
        
    content = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in content:
        content = content.split('```json')[1].split('```')[0].strip()
    elif '```' in content:
        content = content.split('```')[1].split('```')[0].strip()
        
    try:
        data = json.loads(content)
        print(f"Extracted {len(data)} questions for {subject}!")
        return data
    except Exception as e:
        print(f"JSON Parse error: {e}")
        with open(f'scratch/{subject.lower()}_raw.txt', 'w', encoding='utf-8') as f:
            f.write(content)
        return []

if __name__ == '__main__':
    # 1. Chemistry Chapter 1
    chem = extract_page('scratch/chem_ch1/p102_right.png', 'Chemistry', 'Some Basic Concepts of Chemistry', 1)
    if chem:
        with open('src/data/pyq_chem_ch1.json', 'w', encoding='utf-8') as f:
            json.dump(chem, f, indent=2)
            
    # 2. Mathematics Chapter 1
    math = extract_page('scratch/math_ch1/p169_right.png', 'Mathematics', 'Sets', 1)
    if math:
        with open('src/data/pyq_math_ch1.json', 'w', encoding='utf-8') as f:
            json.dump(math, f, indent=2)
            
    print("Extraction script complete!")
