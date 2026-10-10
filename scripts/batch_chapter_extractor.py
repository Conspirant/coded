import pypdfium2 as pdfium
import requests
import base64
import json
import os
import sys
import time
import re
import argparse
from PIL import Image

# Load environment variables from .env
env_vars = {}
if os.path.exists('.env'):
    with open('.env', encoding='utf-8') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                env_vars[k.strip()] = v.strip().strip('"').strip("'")

NVIDIA_KEY = env_vars.get('NVIDIA_API_KEY')
SUPABASE_URL = env_vars.get('VITE_SUPABASE_URL')
SUPABASE_KEY = env_vars.get('VITE_SUPABASE_ANON_KEY')

if not NVIDIA_KEY:
    print("Error: NVIDIA_API_KEY not found in .env", flush=True)
    sys.exit(1)

def robust_json_parse(raw_text):
    """Parses JSON array from LLM response, handling unescaped LaTeX backslashes."""
    s = raw_text.find('[')
    e = raw_text.rfind(']')
    if s == -1 or e == -1 or e <= s:
        return []
    snippet = raw_text[s:e+1]
    
    # Try direct parse
    try:
        return json.loads(snippet)
    except Exception:
        pass

    # Replace backslashes not followed by valid json escape
    fixed = re.sub(r'\\(?!["\\/bfnrtu])', r'\\\\', snippet)
    try:
        return json.loads(fixed)
    except Exception:
        pass

    # Replace all \ with \\ except \" and \\
    fixed2 = re.sub(r'\\(?!["\\])', r'\\\\', snippet)
    try:
        return json.loads(fixed2)
    except Exception:
        pass

    # Regex block parser fallback
    items = []
    blocks = re.findall(r'\{[^{}]+(?:\{[^{}]+(?:\{[^{}]+\}[^{}]+)*\}[^{}]*)*\}', snippet)
    for b in blocks:
        try:
            b_fixed = re.sub(r'\\(?!["\\])', r'\\\\', b)
            obj = json.loads(b_fixed)
            if 'question' in obj or 'q' in obj:
                items.append(obj)
        except Exception:
            pass
    return items

def extract_answer_key(pdf, page_num, side, tag="key"):
    """Extracts answer key table like 1.(a) 2.(b)... from the specified page & side."""
    page = pdf[page_num - 1]
    img = page.render(scale=1.5).to_pil()
    w, h = img.size
    crop = img.crop((0, 0, w // 2, int(h * 0.45))) if side == 'left' else img.crop((w // 2, 0, w, int(h * 0.45)))
    os.makedirs('scratch/keys', exist_ok=True)
    path = f'scratch/keys/{tag}_p{page_num}_{side}.jpg'
    crop.save(path, quality=80)
    
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = "Extract all question numbers and their corresponding answer options from this ANSWER KEY table. Return ONLY a JSON object: {\"1\": \"a\", \"2\": \"b\", ...}"
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
                'max_tokens': 800,
                'temperature': 0.1
            },
            timeout=50
        )
        content = resp.json()['choices'][0]['message']['content']
        s = content.find('{')
        e = content.rfind('}')
        if s != -1 and e != -1 and e > s:
            fixed = re.sub(r'\\(?!["\\])', r'\\\\', content[s:e+1])
            return json.loads(fixed)
    except Exception as err:
        print(f"Failed to extract answer key on p{page_num}_{side}: {err}", flush=True)
    return {}

def extract_slice_questions(path, tag, retry=1):
    """Sends an image slice to NVIDIA vision API and parses questions with timeout=75 and retries."""
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
        
    prompt = """Extract all multiple-choice questions from this image.
Format output strictly as a JSON array of objects:
[
  {
    "q_num": 1,
    "question": "question text with LaTeX $...$",
    "options": ["(a) ...", "(b) ...", "(c) ...", "(d) ..."],
    "year": 2021,
    "needs_image": false
  }
]
Set needs_image=true only if the question references a graph, diagram, or circuit figure.
Double-escape backslashes in LaTeX formulas (\\\\frac, \\\\times, \\\\to, \\\\alpha).
Return ONLY the JSON array starting with [ and ending with ]."""

    t0 = time.time()
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
                'max_tokens': 1200,
                'temperature': 0.1
            },
            timeout=75
        )
        if resp.status_code != 200:
            print(f"[{tag}] HTTP {resp.status_code}: {resp.text[:80]}", flush=True)
            if retry > 0:
                time.sleep(3)
                return extract_slice_questions(path, tag, retry=retry-1)
            return []
            
        content = resp.json()['choices'][0]['message']['content']
        data = robust_json_parse(content)
        print(f"[{tag}] Extracted {len(data)} Qs in {time.time() - t0:.1f}s", flush=True)
        return data
    except Exception as err:
        print(f"[{tag}] Error: {err}", flush=True)
        if retry > 0:
            time.sleep(3)
            return extract_slice_questions(path, tag, retry=retry-1)
        return []

def sanitize_math_formula(text):
    """Converts unicode subscripts/superscripts to clean LaTeX KaTeX syntax."""
    if not text:
        return ""
    sub_map = {'₀':'_0', '₁':'_1', '₂':'_2', '₃':'_3', '₄':'_4', '₅':'_5', '₆':'_6', '₇':'_7', '₈':'_8', '₉':'_9', '₊':'+', '₋':'-'}
    sup_map = {'⁰':'^0', '¹':'^1', '²':'^2', '³':'^3', '⁴':'^4', '⁵':'^5', '⁶':'^6', '⁷':'^7', '⁸':'^8', '⁹':'^9', '⁺':'+', '⁻':'-'}
    for u, l in sub_map.items():
        text = text.replace(u, l)
    for u, l in sup_map.items():
        text = text.replace(u, l)
    return text.strip()

def process_chapter(subject, chapter_num, chapter_title, start_page, end_page, key_page=None, key_side='left', key_file=None):
    print(f"\n==================================================", flush=True)
    print(f"Processing: {subject} Ch {chapter_num}: '{chapter_title}'", flush=True)
    print(f"Pages: PDF {start_page} to {end_page}", flush=True)
    print(f"==================================================", flush=True)
    
    pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')
    os.makedirs('scratch/chapter_slices', exist_ok=True)
    
    # 1. Answer Key Extraction
    ans_key = {}
    if key_file and os.path.exists(key_file):
        with open(key_file, encoding='utf-8') as f:
            ans_key = json.load(f)
        print(f"Loaded Answer Key from {key_file}: {len(ans_key)} entries", flush=True)
    else:
        if key_page is None:
            key_page = end_page + 1
        
        print(f"Extracting Answer Key from PDF page {key_page} ({key_side})...", flush=True)
        ans_key = extract_answer_key(pdf, key_page, key_side, tag=f"{subject}_ch{chapter_num}")
        if not ans_key and key_page > start_page:
            ans_key = extract_answer_key(pdf, end_page, 'right', tag=f"{subject}_ch{chapter_num}_fallback")
        print(f"Answer Key extracted: {len(ans_key)} entries", flush=True)
    
    # 2. Slice Generation
    slices = []
    for p in range(start_page, end_page + 1):
        page = pdf[p - 1]
        img = page.render(scale=1.2).to_pil()
        w, h = img.size
        for side in ['left', 'right']:
            col = img.crop((0, 0, w // 2, h)) if side == 'left' else img.crop((w // 2, 0, w, h))
            cw, ch = col.size
            top = col.crop((0, 0, cw, int(ch * 0.52)))
            btm = col.crop((0, int(ch * 0.48), cw, ch))
            
            for part, cimg in [('top', top), ('btm', btm)]:
                cimg.thumbnail((750, 1050))
                tag = f"p{p}_{side}_{part}"
                path = f"scratch/chapter_slices/{subject}_ch{chapter_num}_{tag}.jpg"
                cimg.save(path, quality=70)
                slices.append((path, tag))
                
    print(f"Generated {len(slices)} image slices across pages {start_page}-{end_page}", flush=True)
    
    # 3. Vision Extraction across Slices
    all_raw_qs = []
    for path, tag in slices:
        qs = extract_slice_questions(path, tag)
        all_raw_qs.extend(qs)
        time.sleep(1.0)
        
    print(f"Total raw question items received: {len(all_raw_qs)}", flush=True)
    
    # 4. Deduplicate & Clean
    max_key_num = max([int(k) for k in ans_key.keys() if k.isdigit()] or [100])
    by_num = {}
    for item in all_raw_qs:
        q_num = item.get('q_num') or item.get('question_num')
        if not q_num:
            match = re.match(r'^(?:Q\s*)?(\d+)', item.get('question', ''))
            if match:
                q_num = int(match.group(1))
        if q_num:
            try:
                q_num = int(q_num)
                if 1 <= q_num <= max_key_num:
                    if q_num not in by_num or len(item.get('question', '')) > len(by_num[q_num].get('question', '')):
                        by_num[q_num] = item
            except Exception:
                pass
                
    print(f"Unique questions identified: {len(by_num)} (out of {max_key_num} expected)", flush=True)
    
    letter_to_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
    final_questions = []
    
    for num in sorted(by_num.keys()):
        raw_q = by_num[num]
        q_text = raw_q.get('question', '') or raw_q.get('q', '')
        q_text = re.sub(r'^(?:Q\s*)?\d+\s*[\.\)]\s*', '', q_text).strip()
        q_text = sanitize_math_formula(q_text)
        
        raw_opts = raw_q.get('options', [])
        cleaned_opts = []
        for opt in raw_opts:
            c_opt = re.sub(r'^\s*\(?[a-dA-D]\)?[\.\s]*', '', opt).strip()
            cleaned_opts.append(sanitize_math_formula(c_opt))
            
        while len(cleaned_opts) < 4:
            cleaned_opts.append(f"Option {chr(65 + len(cleaned_opts))}")
        cleaned_opts = cleaned_opts[:4]
        
        # Match with official answer key
        key_letter = str(ans_key.get(str(num), 'a')).lower()
        correct_idx = letter_to_idx.get(key_letter, 0)
        
        year_val = raw_q.get('year', 2020)
        if isinstance(year_val, str):
            m = re.search(r'\b(20\d\d)\b', year_val)
            year_val = int(m.group(1)) if m else 2020
        elif not isinstance(year_val, int):
            year_val = 2020
            
        final_questions.append({
            "subject": subject,
            "chapter": chapter_title,
            "chapter_number": chapter_num,
            "question": q_text,
            "options": cleaned_opts,
            "correct_answer": correct_idx,
            "year": year_val,
            "explanation": f"According to the official KCET Answer Key, the correct option is ({key_letter.upper()}).",
            "needs_image": bool(raw_q.get('needs_image', False))
        })
        
    # Save to local JSON
    subj_slug = subject.lower()
    if subj_slug == 'mathematics':
        subj_slug = 'maths'
    out_file = f"src/data/pyq_{subj_slug}_ch{chapter_num}.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2)
    print(f"Saved {len(final_questions)} questions to {out_file}", flush=True)
    
    # 5. Seed into Supabase if configured
    if SUPABASE_URL and SUPABASE_KEY:
        print("Upserting into Supabase pyq_questions table...", flush=True)
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        batch_size = 25
        seeded_count = 0
        for i in range(0, len(final_questions), batch_size):
            chunk = final_questions[i:i+batch_size]
            r = requests.post(f"{SUPABASE_URL}/rest/v1/pyq_questions", headers=headers, json=chunk)
            if r.status_code in [200, 201]:
                seeded_count += len(chunk)
            else:
                print(f"Supabase upsert batch {i//batch_size} error: {r.status_code} {r.text[:100]}", flush=True)
        print(f"Seeded {seeded_count}/{len(final_questions)} questions into Supabase successfully!", flush=True)
        
    return final_questions

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Batch chapter extractor for KCET PYQs")
    parser.add_argument('--subject', required=True, choices=['Physics', 'Chemistry', 'Mathematics'])
    parser.add_argument('--chapter-num', type=int, required=True)
    parser.add_argument('--chapter-title', type=str, required=True)
    parser.add_argument('--start', type=int, required=True, help="PDF start page")
    parser.add_argument('--end', type=int, required=True, help="PDF end page")
    parser.add_argument('--key-page', type=int, default=None, help="PDF page containing Answer Key table")
    parser.add_argument('--key-side', type=str, default='left', choices=['left', 'right'])
    parser.add_argument('--key-file', type=str, default=None, help="Path to pre-extracted JSON answer key")
    
    args = parser.parse_args()
    process_chapter(
        subject=args.subject,
        chapter_num=args.chapter_num,
        chapter_title=args.chapter_title,
        start_page=args.start,
        end_page=args.end,
        key_page=args.key_page,
        key_side=args.key_side,
        key_file=args.key_file
    )
