import os
import re

txt_dir = "scratch/chem16/ocr_cols"
files = [
    "p152_L_col1.txt", "p152_L_col2.txt", "p152_R_col1.txt", "p152_R_col2.txt",
    "p153_L_col1.txt", "p153_L_col2.txt", "p153_R_col1.txt", "p153_R_col2.txt",
    "p154_L_col1.txt", "p154_L_col2.txt"
]

all_text = ""
for f in files:
    path = os.path.join(txt_dir, f)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as file:
            all_text += f"\n--- {f} ---\n" + file.read()

with open("scratch/chem16/all_explanations.txt", "w", encoding="utf-8") as out:
    out.write(all_text)

# Find all occurrences of e.g. "1. (c)" or "1.(c)" or "1 (c)"
matches = re.findall(r'(?:^|\n)\s*(\d{1,2})\s*[\.:\)]\s*\(([a-d])\)', all_text)
print("Found matches from explanations:")
key_dict = {}
for q, opt in matches:
    q_num = int(q)
    if q_num not in key_dict and q_num <= 48:
        key_dict[q_num] = opt

for q in range(1, 49):
    print(f"Q{q}: {key_dict.get(q, 'MISSING')}")
