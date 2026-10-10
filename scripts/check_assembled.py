import json

with open('src/data/pyq_chemistry_ch1_assembled.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print(f"Total questions in assembled: {len(d)}")
for i, q in enumerate(d):
    txt = q.get('question', '')[:60].replace('\n', ' ')
    print(f"Q{i+1}: {txt} [{q.get('year')}]")
