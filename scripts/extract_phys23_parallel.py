import pypdfium2 as pdfium
import requests, base64, json, sys, os
from concurrent.futures import ThreadPoolExecutor

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/phys23/parsed_chunks', exist_ok=True)

tasks = [
    {"name": "p73_questions", "pno": 73, "crop": (0.48, 0.0, 1.0, 1.0), "desc": "Questions 1 to 10 of Ray Optics"},
    {"name": "p74_col12", "pno": 74, "crop": (0.0, 0.0, 0.52, 1.0), "desc": "Questions on page 74 left half (Q11-Q19)"},
    {"name": "p74_col34", "pno": 74, "crop": (0.48, 0.0, 1.0, 1.0), "desc": "Questions on page 74 right half (Q20-Q28)"},
    {"name": "p75_col12", "pno": 75, "crop": (0.0, 0.0, 0.52, 1.0), "desc": "Questions on page 75 left half (Q29-Q37)"},
    {"name": "p75_col34", "pno": 75, "crop": (0.48, 0.0, 1.0, 1.0), "desc": "Questions on page 75 right half (Q38-Q46)"},
    {"name": "p76_col12", "pno": 76, "crop": (0.0, 0.0, 0.52, 1.0), "desc": "Questions on page 76 left half (Q47-Q55)"},
    {"name": "p76_col34", "pno": 76, "crop": (0.48, 0.0, 1.0, 1.0), "desc": "Questions on page 76 right half (Q56-Q64)"},
    {"name": "p77_col12", "pno": 77, "crop": (0.0, 0.0, 0.52, 0.55), "desc": "Questions on page 77 top left half (Q65-Q72)"},
    {"name": "p77_hints", "pno": 77, "crop": (0.0, 0.50, 1.0, 1.0), "desc": "Hints & Explanations on page 77"},
    {"name": "p78_hints", "pno": 78, "crop": (0.0, 0.0, 1.0, 1.0), "desc": "Hints & Explanations on page 78"},
    {"name": "p79_hints", "pno": 79, "crop": (0.0, 0.0, 1.0, 1.0), "desc": "Hints & Explanations on page 79"}
]

# Render all images sequentially first
for t in tasks:
    temp_img = f"scratch/phys23/parsed_chunks/{t['name']}.png"
    p = pdf[t['pno'] - 1].render(scale=2.0).to_pil()
    w, h = p.size
    c = t['crop']
    crop_img = p.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    crop_img.save(temp_img)
    print(f"Rendered image for {t['name']}")

pdf.close()

def send_request(t):
    out_json = f"scratch/phys23/parsed_chunks/{t['name']}.json"
    if os.path.exists(out_json) and os.path.getsize(out_json) > 100:
        print(f"Skipping {t['name']} (already exists)")
        return
    
    temp_img = f"scratch/phys23/parsed_chunks/{t['name']}.png"
    with open(temp_img, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""Transcribe all text from this image section: {t['desc']}.
Preserve mathematical formulas in standard LaTeX formatting (e.g. $f = \\frac{{R}}{{2}}$, $\\mu = 1.5$).
For questions: output question number, year, full question text, and 4 options (a, b, c, d).
For hints/explanations: output question number, correct option, and complete solution text with all formulas and derivation steps.
Output clear structured text or markdown."""

    print(f"Calling API for {t['name']}...")
    try:
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
            timeout=90
        )
        content = resp.json()['choices'][0]['message']['content']
        with open(out_json, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Done {t['name']} ({len(content)} chars)")
    except Exception as e:
        print(f"Error on {t['name']}: {e}")

print("Sending network requests in parallel...")
with ThreadPoolExecutor(max_workers=6) as executor:
    list(executor.map(send_request, tasks))

print("All tasks finished successfully!")
