import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Let's inspect where Vector Algebra starts and where its Answer Key is located
# Math Ch 19 is Vector Algebra on pages 232-237
# Let's find answer key on pages 234, 235, 236
os.makedirs('scratch/math19', exist_ok=True)

# Let's inspect pages 232 to 237
for pno in range(232, 238):
    p = pdf[pno - 1].render(scale=2.0).to_pil()
    w, h = p.size
    crop_top = p.crop((0, 0, w, int(h * 0.4)))
    temp_p = f'scratch/math19/p{pno}_top.png'
    crop_top.save(temp_p)
    
    with open(temp_p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{'role': 'user', 'content': [
                {'type': 'text', 'text': f'Identify the header/chapter name, whether an ANSWER KEY table exists on Page {pno}, and what question numbers are present. Return brief JSON: {{"page": {pno}, "chapter": str, "has_answer_key": bool, "q_range": str}}'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
            ]}],
            'max_tokens': 300
        },
        timeout=30
    )
    print(f"Page {pno}:", resp.json()['choices'][0]['message']['content'])
