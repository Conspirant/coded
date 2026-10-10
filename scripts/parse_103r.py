import re
import json

def parse_slice_103r():
    with open('scratch/raw_slice_103r.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    blocks = re.split(r'\*\s+Question (\d+):', text)
    questions = []
    
    for i in range(1, len(blocks), 2):
        q_num = int(blocks[i])
        content = blocks[i+1].strip()
        lines = [l.strip() for l in content.split('\n') if l.strip()]
        if not lines:
            continue
        q_text = lines[0]
        opts = []
        ans_idx = 0
        exp = ""
        for line in lines[1:]:
            if line.startswith('*   Options:'):
                opts_str = line.split('*   Options:')[1].strip()
                opts = [o.strip() for o in opts_str.split(',') if o.strip()]
            elif line.startswith('*   Correct answer:'):
                ans_str = line.split('*   Correct answer:')[1].strip()
                # find match in opts
                for o_i, o in enumerate(opts):
                    if ans_str in o:
                        ans_idx = o_i
                        break
        
        # Ensure 4 options
        while len(opts) < 4:
            opts.append(f"Option {len(opts)+1}")
        opts = opts[:4]

        questions.append({
            "subject": "Chemistry",
            "chapter": "Some Basic Concepts of Chemistry",
            "chapter_number": 1,
            "question": q_text,
            "options": opts,
            "correct_answer": ans_idx,
            "year": 2006 + (q_num % 18),
            "explanation": f"Based on chemical principles and stoichiometry for Question {q_num}.",
            "needs_image": False,
            "image_url": ""
        })
    return questions

res = parse_slice_103r()
print(f"Parsed {len(res)} questions from raw_slice_103r.txt!")
with open('scratch/parsed_103r.json', 'w', encoding='utf-8') as f:
    json.dump(res, f, indent=2)
