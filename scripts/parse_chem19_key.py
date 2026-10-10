import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Page 166: Answer key is in middle/right
p166 = pdf[165].render(scale=2.0).to_pil()
w, h = p166.size
# Crop around answer key table
key_crop = p166.crop((int(w * 0.2), int(h * 0.1), int(w * 0.6), int(h * 0.6)))
os.makedirs('scratch/chem19', exist_ok=True)
key_crop.save('scratch/chem19/answer_key_crop.png')

with open('scratch/chem19/answer_key_crop.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Extract the complete ANSWER KEY table from this image for Biomolecules (Chapter 19 Chemistry). Return ONLY JSON: {"1": "a", "2": "b", ...}. Include all question numbers 1 to 47.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
            ]
        }],
        'max_tokens': 1000
    }
)

content = resp.json()['choices'][0]['message']['content'].strip()
if '```json' in content:
    content = content.split('```json')[1].split('```')[0].strip()
elif '```' in content:
    content = content.split('```')[1].split('```')[0].strip()

try:
    key_dict = json.loads(content)
    print(f"Extracted {len(key_dict)} answers:")
    print(json.dumps(key_dict, indent=2))
    with open('scratch/chem19/answer_key.json', 'w', encoding='utf-8') as f:
        json.dump(key_dict, f, indent=2)
except Exception as e:
    print("Raw output:", content)
