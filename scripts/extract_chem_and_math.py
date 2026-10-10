import os
import base64
import requests
import json
import time
from PIL import Image

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

def stitch_and_optimize(img1_path, img2_path, target_path):
    im1 = Image.open(img1_path)
    im2 = Image.open(img2_path)
    
    # Calculate dimensions for side-by-side
    target_h = max(im1.height, im2.height)
    # Resize keeping aspect ratio
    im1_scaled = im1.resize((int(im1.width * (target_h / im1.height)), target_h), Image.Resampling.LANCZOS)
    im2_scaled = im2.resize((int(im2.width * (target_h / im2.height)), target_h), Image.Resampling.LANCZOS)
    
    total_w = im1_scaled.width + im2_scaled.width
    combined = Image.new('RGB', (total_w, target_h), (255, 255, 255))
    combined.paste(im1_scaled, (0, 0))
    combined.paste(im2_scaled, (im1_scaled.width, 0))
    
    # Scale down total combined image so it fits within 2000x1800
    combined.thumbnail((2000, 1800), Image.Resampling.LANCZOS)
    combined.save(target_path, quality=88)
    
    with open(target_path, 'rb') as f:
        return base64.b64encode(f.read()).decode()

def extract_chapter(question_img_path, solution_img_path, subject, chapter_name, chapter_number):
    print(f"\n=======================================================", flush=True)
    print(f"Extracting {subject} Chapter {chapter_number}: {chapter_name}", flush=True)
    print(f"=======================================================", flush=True)
    
    stitched_b64 = stitch_and_optimize(question_img_path, solution_img_path, f'scratch/combined_{subject.lower()}_ch{chapter_number}.jpg')
    
    prompt = f"""You are an expert exam digitizer for Karnataka CET (KCET).
Below is an image with TWO pages side-by-side:
- Left half: The Questions page for {subject} Chapter {chapter_number} ({chapter_name}) from the KCET Chapterwise PYQ book.
- Right half: The Solutions and Answer Key page for this chapter.

Task:
Extract all questions from the question page.
For EACH question:
1. Extract the exact question text. Format any chemical formulas (like $CaCO_3$, $CO_2$, $KOH$), mathematical expressions (fractions, exponents like $11.2\\text{{ dm}}^3$, sets like $A \\cap B$), or variables with standard LaTeX ($...$).
2. Extract the 4 options (a, b, c, d) with clean LaTeX formatting.
3. Find the exam year (e.g. 2006, 2012, 2018, etc.) printed next to the question.
4. Match the question with the Answer Key and Solutions on the right half. Set 'correct_answer' to 0 for (a), 1 for (b), 2 for (c), 3 for (d).
5. Extract the complete step-by-step solution into 'explanation', formatted with clean LaTeX math ($...$). Ensure every equation has closing dollar signs ($...$).

Return ONLY valid JSON array with this schema (NO commentary, NO markdown fences):
[
  {{
    "subject": "{subject}",
    "chapter": "{chapter_name}",
    "chapter_number": {chapter_number},
    "question": "string with $...$",
    "options": [
      "option A with $...$",
      "option B with $...$",
      "option C with $...$",
      "option D with $...$"
    ],
    "correct_answer": 0,
    "year": 2006,
    "explanation": "Step-by-step explanation with $...$",
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
                    {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{stitched_b64}'}}
                ]
            }],
            'max_tokens': 4000,
            'temperature': 0.1
        },
        timeout=120
    )
    
    print(f"Vision API responded in {time.time() - t0:.1f}s", flush=True)
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
        print(f"Successfully parsed {len(data)} questions for {subject} Ch {chapter_number}!")
        return data
    except Exception as e:
        print(f"JSON Parse error: {e}")
        with open(f'scratch/{subject.lower()}_raw.txt', 'w', encoding='utf-8') as f:
            f.write(content)
        return []

if __name__ == '__main__':
    # 1. Chemistry Chapter 1
    chem_data = extract_chapter(
        'scratch/chem_ch1/p102_right.png',
        'scratch/chem_ch1/p103_left.png',
        'Chemistry',
        'Some Basic Concepts of Chemistry',
        1
    )
    if chem_data:
        with open('src/data/pyq_chem_ch1.json', 'w', encoding='utf-8') as f:
            json.dump(chem_data, f, indent=2)
        print(f"Saved {len(chem_data)} Chemistry questions to src/data/pyq_chem_ch1.json")

    # 2. Mathematics Chapter 1
    math_data = extract_chapter(
        'scratch/math_ch1/p169_right.png',
        'scratch/math_ch1/p170_left.png',
        'Mathematics',
        'Sets',
        1
    )
    if math_data:
        with open('src/data/pyq_math_ch1.json', 'w', encoding='utf-8') as f:
            json.dump(math_data, f, indent=2)
        print(f"Saved {len(math_data)} Mathematics questions to src/data/pyq_math_ch1.json")
