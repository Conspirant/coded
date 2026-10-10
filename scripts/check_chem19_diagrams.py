import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Render pages 164, 165, 166 left column
os.makedirs('scratch/chem19/diagram_check', exist_ok=True)

# Let's inspect each page with vision model to list all question numbers with chemical structures / diagrams
for pno in [164, 165, 166]:
    page = pdf[pno - 1].render(scale=2.0).to_pil()
    img_path = f'scratch/chem19/diagram_check/p{pno}.png'
    page.save(img_path)
    
    with open(img_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': f'Identify all question numbers on Page {pno} for Biomolecules (Chapter 19 Chemistry) that contain chemical structures, molecular diagrams, Haworth projections, Fischer projections, or reaction pathways in the question or options. Return JSON list of objects: [{{"q_num": int, "has_diagram": bool, "diagram_description": str, "location": "question"|"options"}}]'},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
                ]
            }],
            'max_tokens': 1000
        }
    )
    print(f"=== PAGE {pno} DIAGRAM CHECK ===")
    print(resp.json()['choices'][0]['message']['content'])
