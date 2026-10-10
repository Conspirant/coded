import pypdfium2 as pdfium
import requests, base64, json, sys, os, time, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]
        elif line.startswith('VITE_SUPABASE_URL='):
            SUPABASE_URL = line.strip().split('=', 1)[1]
        elif line.startswith('VITE_SUPABASE_ANON_KEY='):
            SUPABASE_KEY = line.strip().split('=', 1)[1]

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

with open('scratch/chem_ch3_key.json', encoding='utf-8') as f:
    ans_key = json.load(f)

# Page 108 right (Q1 to Q8)
p108 = pdf[107].render(scale=1.5).to_pil()
w108, h108 = p108.size
col108r = p108.crop((w108 // 2, 0, w108, h108))
cw108, ch108 = col108r.size

# Page 109 left (Q9 to Q16)
p109 = pdf[108].render(scale=1.5).to_pil()
w109, h109 = p109.size
col109l = p109.crop((0, 0, w109 // 2, h109))
cw109, ch109 = col109l.size

# Page 109 right (Q17 to Q23)
col109r = p109.crop((w109 // 2, 0, w109, h109))
cw109r, ch109r = col109r.size

slices = [
    (col108r.crop((0, int(ch108 * 0.12), cw108, int(ch108 * 0.56))), 'ch3_p108_r_top', 'Questions 1 to 4'),
    (col108r.crop((0, int(ch108 * 0.54), cw108, ch108)), 'ch3_p108_r_btm', 'Questions 5 to 8'),
    (col109l.crop((0, int(ch109 * 0.08), cw109, int(ch109 * 0.54))), 'ch3_p109_l_top', 'Questions 9 to 12'),
    (col109l.crop((0, int(ch109 * 0.50), cw109, ch109)), 'ch3_p109_l_btm', 'Questions 13 to 16'),
    (col109r.crop((0, int(ch109r * 0.08), cw109r, int(ch109r * 0.65))), 'ch3_p109_r_top', 'Questions 17 to 23')
]

def transcribe_slice(img, tag, desc):
    img.thumbnail((750, 1050))
    path = f'scratch/{tag}.jpg'
    img.save(path, quality=80)
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""Transcribe all multiple-choice chemistry questions from Classification of Elements and Periodicity visible in this image ({desc}).
For EACH question, use this EXACT markdown format:
### Q<number> (<year if given>)
<full question text with chemical formulas and mathematical notation in LaTeX $...$>
(a) <option a text or formula>
(b) <option b text or formula>
(c) <option c text or formula>
(d) <option d text or formula>

Do not skip any questions. Put each option on a separate line starting with (a), (b), (c), (d)."""

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
        if 1 <= q['q_num'] <= 23:
            by_num[q['q_num']] = q
    time.sleep(1.0)

print(f"\nTotal unique questions parsed: {len(by_num)} / 23")
missing = [i for i in range(1, 24) if i not in by_num]
print("Missing numbers:", missing)

with open('scratch/chem_ch3_parsed_qs.json', 'w', encoding='utf-8') as f:
    json.dump(by_num, f, indent=2, ensure_ascii=False)
