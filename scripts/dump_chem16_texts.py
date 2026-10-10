import os

# 1. Combine question texts from p150 and p151
q_files = [
    "p150_L_col1.txt", "p150_L_col2.txt", "p150_R_col1.txt", "p150_R_col2.txt",
    "p151_L_col1.txt", "p151_L_col2.txt", "p151_R_col1.txt", "p151_R_col2.txt"
]

all_q_text = ""
for f in q_files:
    p = os.path.join("scratch/chem16/ocr_cols", f)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as file:
            all_q_text += f"\n=== {f} ===\n" + file.read()

with open("scratch/chem16/all_questions_raw.txt", "w", encoding="utf-8") as out:
    out.write(all_q_text)

# 2. Combine explanation texts from p152, p153, p154
exp_files = [
    "p152_L_col1.txt", "p152_L_col2.txt", "p152_R_col1.txt", "p152_R_col2.txt",
    "p153_L_col1.txt", "p153_L_col2.txt", "p153_R_col1.txt", "p153_R_col2.txt",
    "p154_L_col1.txt", "p154_L_col2.txt"
]

all_exp_text = ""
for f in exp_files:
    p = os.path.join("scratch/chem16/ocr_cols", f)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as file:
            all_exp_text += f"\n=== {f} ===\n" + file.read()

with open("scratch/chem16/all_explanations_raw.txt", "w", encoding="utf-8") as out:
    out.write(all_exp_text)

print("Saved all_questions_raw.txt and all_explanations_raw.txt")
