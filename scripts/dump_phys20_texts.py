import os
import re

txt_dir = "scratch/physics20/ocr_cols"
files = sorted([f for f in os.listdir(txt_dir) if f.endswith(".txt")])

# 1. Combine all question texts
q_text = ""
for f in files:
    if f.startswith("p64_") or f.startswith("p65_"):
        with open(os.path.join(txt_dir, f), "r", encoding="utf-8") as file:
            q_text += f"\n=== {f} ===\n" + file.read()

with open("scratch/physics20/all_questions_raw.txt", "w", encoding="utf-8") as out:
    out.write(q_text)

# 2. Combine all explanation texts
exp_text = ""
for f in files:
    with open(os.path.join(txt_dir, f), "r", encoding="utf-8") as file:
        exp_text += f"\n=== {f} ===\n" + file.read()

with open("scratch/physics20/all_explanations_raw.txt", "w", encoding="utf-8") as out:
    out.write(exp_text)

print("Saved all_questions_raw.txt and all_explanations_raw.txt for Physics 20.")

# Extract explanation headers
matches = re.findall(r'(?:^|\n)\s*(\d{1,2})\s*[\.:\)]\s*\(([a-d\*])\)', exp_text)
print("Found matches from explanations:")
key_dict = {}
for q, opt in matches:
    q_num = int(q)
    if q_num not in key_dict and q_num <= 24:
        key_dict[q_num] = opt

for q in range(1, 25):
    print(f"Q{q}: {key_dict.get(q, 'MISSING')}")
