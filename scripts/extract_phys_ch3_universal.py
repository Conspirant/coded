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

with open('scratch/phys_ch3_key.json', encoding='utf-8') as f:
    ans_key = json.load(f)

# Page 6 right: Q1 to Q10
p6 = pdf[5].render(scale=1.5).to_pil()
w6, h6 = p6.size
col6r = p6.crop((w6 // 2, 0, w6, h6))
cw6, ch6 = col6r.size

# Page 7 left: Q11 to Q21
p7 = pdf[6].render(scale=1.5).to_pil()
w7, h7 = p7.size
col7l = p7.crop((0, 0, w7 // 2, h7))
cw7, ch7 = col7l.size

slices = [
    (col6r.crop((0, int(ch6 * 0.12), cw6, int(ch6 * 0.56))), 'ch3_p6_r_top', 'Questions 1 to 5'),
    (col6r.crop((0, int(ch6 * 0.54), cw6, ch6)), 'ch3_p6_r_btm', 'Questions 6 to 10'),
    (col7l.crop((0, int(ch7 * 0.08), cw7, int(ch7 * 0.52))), 'ch3_p7_l_top', 'Questions 11 to 16'),
    (col7l.crop((0, int(ch7 * 0.48), cw7, int(ch7 * 0.88))), 'ch3_p7_l_btm', 'Questions 17 to 21')
]

def transcribe_slice(img, tag, desc):
    img.thumbnail((750, 1050))
    path = f'scratch/{tag}.jpg'
    img.save(path, quality=80)
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = f"""Transcribe all multiple-choice physics questions visible in this image ({desc}).
For EACH question, use this EXACT markdown format:
### Q<number> (<year if given>)
<full question text with mathematical formulas in LaTeX $...$>
(a) <option a text or math>
(b) <option b text or math>
(c) <option c text or math>
(d) <option d text or math>

Do not skip any questions. Preserve all mathematical notation using LaTeX."""

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
                    'temperature': 0.1
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
        
        # Extract year from the first line if present, e.g. "(2015)"
        lines = block_text.split('\n')
        first_line = lines[0]
        year = None
        m_year = re.search(r'\b(20\d\d)\b', first_line)
        if m_year:
            year = int(m_year.group(1))
            
        opt_matches = list(re.finditer(r'^\s*\(([a-dA-D])\)\s*(.+?)(?=(?:^\s*\([a-dA-D]\)|\Z))', block_text, re.MULTILINE | re.DOTALL))
        if opt_matches:
            q_text = block_text[:opt_matches[0].start()].strip()
            # remove leading (2015) if present
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
        if 1 <= q['q_num'] <= 21:
            by_num[q['q_num']] = q
    time.sleep(1.0)

print(f"\nTotal unique questions parsed: {len(by_num)} / 21")
missing = [i for i in range(1, 22) if i not in by_num]
print("Missing numbers:", missing)

# Save intermediate
with open('scratch/phys_ch3_parsed_qs.json', 'w', encoding='utf-8') as f:
    json.dump(by_num, f, indent=2, ensure_ascii=False)
