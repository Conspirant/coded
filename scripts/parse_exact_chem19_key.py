import pypdfium2 as pdfium
import requests, base64, json, sys, os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Page 166: Let's inspect where ANSWER KEY is on page 166
p166 = pdf[165].render(scale=3.0).to_pil()
w, h = p166.size
# Page 166: Column 1 is left, Column 2 is right
# Let's crop top half of page 166
crop_top = p166.crop((0, 0, w, int(h * 0.45)))
crop_top.save('scratch/chem19/p166_top_key.png')

with open('scratch/chem19/p166_top_key.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Read the ANSWER KEY grid from this image. It has numbers 1 to 47 with options (a), (b), (c), (d). Output ONLY a strict JSON object mapping question number string to option letter: {"1": "a", "2": "c", ...}. Output no extra text.'},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
            ]
        }],
        'max_tokens': 1000
    }
)

raw = resp.json()['choices'][0]['message']['content'].strip()
if '```json' in raw:
    raw = raw.split('```json')[1].split('```')[0].strip()
elif '```' in raw:
    raw = raw.split('```')[1].split('```')[0].strip()

with open('scratch/chem19/answer_key_strict.json', 'w', encoding='utf-8') as f:
    f.write(raw)

print("Saved strict answer key:", raw)
