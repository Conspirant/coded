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

with open('scratch/chem_ch2_key.json', encoding='utf-8') as f:
    ans_key = json.load(f)

# Page 106 right (Q1 to Q10)
p106 = pdf[105].render(scale=1.5).to_pil()
w106, h106 = p106.size
col106r = p106.crop((w106 // 2, 0, w106, h106))
cw106, ch106 = col106r.size

# Page 107 left (Q11 to Q20)
p107 = pdf[106].render(scale=1.5).to_pil()
w107, h107 = p107.size
col107l = p107.crop((0, 0, w107 // 2, h107))
cw107, ch107 = col107l.size

# Page 107 right (Q21 to Q27)
col107r = p107.crop((w107 // 2, 0, w107, h107))
cw107r, ch107r = col107r.size

slices = [
    (col106r.crop((0, int(ch106 * 0.12), cw106, int(ch106 * 0.56))), 'ch2_p106_r_top', 'Questions 1 to 5'),
    (col106r.crop((0, int(ch106 * 0.54), cw106, ch106)), 'ch2_p106_r_btm', 'Questions 6 to 10'),
    (col107l.crop((0, int(ch107 * 0.08), cw107, int(ch107 * 0.54))), 'ch2_p107_l_top', 'Questions 11 to 15'),
    (col107l.crop((0, int(ch107 * 0.50), cw107, ch107)), 'ch2_p107_l_btm', 'Questions 16 to 20'),
    (col107r.crop((0, int(ch107r * 0.08), cw107r, int(ch107r * 0.65))), 'ch2_p107_r_top', 'Questions 21 to 27')
]

def transcribe_slice(img, tag, desc):
    img.thumbnail((750, 1050))
    path = f'scratch/{tag}.jpg'
    img.save(path, quality=80)
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""Transcribe all multiple-choice chemistry questions from Structure of Atom visible in this image ({desc}).
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
        if 1 <= q['q_num'] <= 27:
            by_num[q['q_num']] = q
    time.sleep(1.0)

print(f"\nTotal unique questions parsed: {len(by_num)} / 27")
missing = [i for i in range(1, 28) if i not in by_num]
print("Missing numbers:", missing)

with open('scratch/chem_ch2_parsed_qs.json', 'w', encoding='utf-8') as f:
    json.dump(by_num, f, indent=2, ensure_ascii=False)
