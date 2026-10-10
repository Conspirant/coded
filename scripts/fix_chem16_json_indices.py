import json

with open("src/data/pyq_chemistry_ch16.json", "r", encoding="utf-8") as f:
    questions = json.load(f)

for q in questions:
    ans_val = q["correct_answer"]
    if isinstance(ans_val, str):
        if ans_val in q["options"]:
            q["correct_answer"] = q["options"].index(ans_val)
        else:
            print(f"Warning: {ans_val} not in options for {q['id']}")

with open("src/data/pyq_chemistry_ch16.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Updated pyq_chemistry_ch16.json with integer correct_answer.")
