import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Render pages 73 to 77 for Physics Ch 23
os.makedirs('scratch/phys23/diagram_check', exist_ok=True)

for pno in range(73, 78):
    p = pdf[pno - 1].render(scale=2.0).to_pil()
    temp_p = f'scratch/phys23/diagram_check/p{pno}.png'
    p.save(temp_p)
    
    with open(temp_p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': [
                {'type': 'text', 'text': f'Identify all question numbers on Page {pno} for Ray Optics (Chapter 23 Physics) that contain ray diagrams, lenses/prisms/mirrors optical diagrams, or graphs in question or options. Return JSON list: [{{"q_num": int, "has_diagram": bool, "diagram_type": str, "location": "question"|"options"}}]'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
            ]}],
            'max_tokens': 1000
        },
        timeout=60
    )
    print(f"=== PAGE {pno} DIAGRAM CHECK ===")
    print(resp.json()['choices'][0]['message']['content'])
