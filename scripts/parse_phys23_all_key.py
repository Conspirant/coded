import json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/phys23/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find all explanation blocks like "1. (a) : ...", "2. (c) : ...", etc.
expl_pattern = r'(?:^|\n)\s*(\d{1,2})\.\s*(\([a-d]\)|\([a-d],[a-d]\)|\(None.*?\))\s*[:\.]\s*(.*?)(?=\n\s*\d{1,2}\.\s*(?:\([a-d]\)|\([a-d],[a-d]\)|\(None.*?\))\s*[:\.]|\n\s*====|\Z)'
matches = re.findall(expl_pattern, text, re.DOTALL)

print(f"Found {len(matches)} explanation blocks in Phys 23:")
expl_dict = {}
for qnum, ans, body in matches:
    num = int(qnum)
    if num not in expl_dict:
        expl_dict[num] = {"ans": ans.strip(), "body": body.strip()[:150]}

for n in sorted(expl_dict.keys()):
    print(f"Q{n}: {expl_dict[n]['ans']} -> {expl_dict[n]['body'][:60]}...")

print(f"Total unique explained questions in Phys 23: {len(expl_dict)}")
