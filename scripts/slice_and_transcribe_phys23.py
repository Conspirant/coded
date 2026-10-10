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
os.makedirs('scratch/phys23/verified_slices', exist_ok=True)

# Define precise column regions for questions on each page:
# Pages 73 to 77
regions = [
    {"name": "p73_c3", "pno": 73, "crop": (0.50, 0.0, 0.75, 1.0), "desc": "Page 73 Column 3: Q1 to Q5"},
    {"name": "p73_c4", "pno": 73, "crop": (0.75, 0.0, 1.0, 1.0), "desc": "Page 73 Column 4: Q6 to Q10"},
    {"name": "p74_c1", "pno": 74, "crop": (0.00, 0.0, 0.25, 1.0), "desc": "Page 74 Column 1: Q11 to Q15"},
    {"name": "p74_c2", "pno": 74, "crop": (0.25, 0.0, 0.50, 1.0), "desc": "Page 74 Column 2: Q15(end) to Q20"},
    {"name": "p74_c3", "pno": 74, "crop": (0.50, 0.0, 0.75, 1.0), "desc": "Page 74 Column 3: Q21 to Q24"},
    {"name": "p74_c4", "pno": 74, "crop": (0.75, 0.0, 1.0, 1.0), "desc": "Page 74 Column 4: Q25 to Q29"},
    {"name": "p75_c1", "pno": 75, "crop": (0.00, 0.0, 0.25, 1.0), "desc": "Page 75 Column 1: Q30 to Q34"},
    {"name": "p75_c2", "pno": 75, "crop": (0.25, 0.0, 0.50, 1.0), "desc": "Page 75 Column 2: Q34(end) to Q38"},
    {"name": "p75_c3", "pno": 75, "crop": (0.50, 0.0, 0.75, 1.0), "desc": "Page 75 Column 3: Q39 to Q43"},
    {"name": "p75_c4", "pno": 75, "crop": (0.75, 0.0, 1.0, 1.0), "desc": "Page 75 Column 4: Q44 to Q48"},
    {"name": "p76_c1", "pno": 76, "crop": (0.00, 0.0, 0.25, 1.0), "desc": "Page 76 Column 1: Q49 to Q53"},
    {"name": "p76_c2", "pno": 76, "crop": (0.25, 0.0, 0.50, 1.0), "desc": "Page 76 Column 2: Q53(end) to Q57"},
    {"name": "p76_c3", "pno": 76, "crop": (0.50, 0.0, 0.75, 1.0), "desc": "Page 76 Column 3: Q58 to Q62"},
    {"name": "p76_c4", "pno": 76, "crop": (0.75, 0.0, 1.0, 1.0), "desc": "Page 76 Column 4: Q63 to Q67"},
    {"name": "p77_c1", "pno": 77, "crop": (0.00, 0.0, 0.25, 0.50), "desc": "Page 77 Column 1: Q68 to Q72"},
    {"name": "p77_c2", "pno": 77, "crop": (0.25, 0.0, 0.50, 0.50), "desc": "Page 77 Column 2: Q73 to Q76"}
]

# Render image for each slice at 3.0 scale for ultra high resolution
for r in regions:
    p = pdf[r['pno'] - 1].render(scale=3.0).to_pil()
    w, h = p.size
    c = r['crop']
    crop_img = p.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    img_path = f"scratch/phys23/verified_slices/{r['name']}.png"
    crop_img.save(img_path)
    print(f"Rendered {r['name']}")

pdf.close()

def transcribe_slice(r):
    out_file = f"scratch/phys23/verified_slices/{r['name']}.json"
    img_path = f"scratch/phys23/verified_slices/{r['name']}.png"
    
    with open(img_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""Transcribe EVERY question in this column image ({r['desc']}) exactly as printed in the book.
DO NOT summarize. DO NOT invent questions.
For each question, output:
- Question number
- Year
- Exact Question text (use LaTeX for formulas: e.g. $\\sin\\theta$, $\\mu = 1.5$, $n_1, n_2, n_3$)
- 4 Options: (a), (b), (c), (d)
- If the question contains a diagram, note [DIAGRAM]
Output formatted text."""

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
                'max_tokens': 2000
            },
            timeout=60
        )
        content = resp.json()['choices'][0]['message']['content']
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Done {r['name']} ({len(content)} chars)")
    except Exception as e:
        print(f"Error on {r['name']}: {e}")

print("Transcribing all 16 slices in parallel...")
with ThreadPoolExecutor(max_workers=8) as executor:
    list(executor.map(transcribe_slice, regions))

print("All slices transcribed!")
