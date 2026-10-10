import json

with open('src/data/pyq_chemistry_ch1.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total questions: {len(data)}")
for i in [0, 8, 14, 21, 28, 32, 40, 45]:
    if i < len(data):
        q = data[i]
        print(f"\n--- Q{i+1} ({q['year']}) ---")
        print(f"Text: {q['question']}")
        print(f"Options: {q['options']}")
        print(f"Ans idx: {q['correct_answer']} -> {q['options'][q['correct_answer']]}")
