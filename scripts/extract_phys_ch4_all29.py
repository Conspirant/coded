import pypdfium2 as pdfium
import requests, base64, json, sys, os, time, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

with open('scratch/phys_ch4_key.json', encoding='utf-8') as f:
    ans_key = json.load(f)

# Page 8 right: Q1 to Q10
p8 = pdf[7].render(scale=1.5).to_pil()
w8, h8 = p8.size
col8r = p8.crop((w8 // 2, 0, w8, h8))
cw8, ch8 = col8r.size

# Page 9 left: Q11 to Q21
p9 = pdf[8].render(scale=1.5).to_pil()
w9, h9 = p9.size
col9l = p9.crop((0, 0, w9 // 2, h9))
cw9, ch9 = col9l.size

# Page 9 right: Q22 to Q29
col9r = p9.crop((w9 // 2, 0, w9, h9))
cw9r, ch9r = col9r.size

slices = [
    (col8r.crop((0, int(ch8 * 0.12), cw8, int(ch8 * 0.56))), 'ch4_p8_r_top', 'Questions 1 to 5'),
    (col8r.crop((0, int(ch8 * 0.54), cw8, ch8)), 'ch4_p8_r_btm', 'Questions 6 to 10'),
    (col9l.crop((0, int(ch9 * 0.08), cw9, int(ch9 * 0.54))), 'ch4_p9_l_top', 'Questions 11 to 16'),
    (col9l.crop((0, int(ch9 * 0.50), cw9, ch9)), 'ch4_p9_l_btm', 'Questions 17 to 21'),
    (col9r.crop((0, int(ch9r * 0.08), cw9r, int(ch9r * 0.42))), 'ch4_p9_r_top', 'Questions 22 to 25'),
    (col9r.crop((0, int(ch9r * 0.40), cw9r, int(ch9r * 0.72))), 'ch4_p9_r_mid', 'Questions 26 to 29')
]

def transcribe_slice(img, tag, desc):
    img.thumbnail((750, 1050))
    path = f'scratch/{tag}.jpg'
    img.save(path, quality=80)
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""Transcribe all multiple-choice physics questions from Laws of Motion visible in this image ({desc}).
For EACH question, use this EXACT markdown format:
### Q<number> (<year if given>)
<full question text with mathematical formulas in LaTeX $...$>
(a) <option a text or math>
(b) <option b text or math>
(c) <option c text or math>
(d) <option d text or math>

Do not skip any questions. Put each option on a separate line."""

    for attempt in range(3):
        try:
            resp = requests.post(
                'https://integrate.api.nvidia.com/v1/chat/completions',
                headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
                json={
                    'model': 'meta/llama-3.2-11b-vision-instruct',
                    'messages': [{
                        'role': 'user',
                        'content': [
                            {'type': 'text', 'text': prompt},
                            {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
                        ]
                    }],
                    'max_tokens': 1500,
                    'temperature': 0.0
                },
                timeout=60
            )
            if resp.status_code == 200:
                content = resp.json()['choices'][0]['message']['content']
                print(f"[{tag}] Received transcription ({len(content)} chars)")
                return content
            else:
                print(f"[{tag}] HTTP {resp.status_code}, retrying...")
                time.sleep(2)
        except Exception as e:
            print(f"[{tag}] Attempt {attempt+1} error: {e}")
            time.sleep(2)
    return ""

def parse_markdown_questions(md_text):
    qs = []
    blocks = re.split(r'###\s*Q(\d+)', md_text)
    for i in range(1, len(blocks), 2):
        q_num = int(blocks[i])
        block_text = blocks[i+1].strip()
        lines = block_text.split('\n')
        year = None
        m_year = re.search(r'\b(20\d\d)\b', lines[0])
        if m_year:
            year = int(m_year.group(1))
            
        opt_matches = list(re.finditer(r'^\s*\(([a-dA-D])\)\s*(.+?)(?=(?:^\s*\([a-dA-D]\)|\Z))', block_text, re.MULTILINE | re.DOTALL))
        if opt_matches:
            q_text = block_text[:opt_matches[0].start()].strip()
            q_text = re.sub(r'^\s*\(\s*20\d\d\s*\)\s*', '', q_text).strip()
            opts = [m.group(2).strip() for m in opt_matches]
        else:
            q_text = block_text
            opts = []
            
        qs.append({'q_num': q_num, 'question': q_text, 'options': opts, 'year': year})
    return qs

by_num = {}

for img, tag, desc in slices:
    text = transcribe_slice(img, tag, desc)
    qs = parse_markdown_questions(text)
    print(f"[{tag}] Parsed question numbers: {[q['q_num'] for q in qs]}")
    for q in qs:
        if 1 <= q['q_num'] <= 29:
            by_num[q['q_num']] = q
    time.sleep(1.0)

print(f"\nTotal unique questions parsed: {len(by_num)} / 29")
missing = [i for i in range(1, 30) if i not in by_num]
print("Missing numbers:", missing)

with open('scratch/phys_ch4_parsed_qs.json', 'w', encoding='utf-8') as f:
    json.dump(by_num, f, indent=2, ensure_ascii=False)
