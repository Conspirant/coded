import os

files = [
    "p214_L_col1.txt", "p214_L_col2.txt", "p214_R_col1.txt", "p214_R_col2.txt",
    "p215_L_col1.txt", "p215_L_col2.txt", "p215_R_col1.txt", "p215_R_col2.txt"
]

all_q = ""
for f in files:
    path = os.path.join("scratch/maths16/ocr_cols", f)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as file:
            all_q += f"\n=== {f} ===\n" + file.read()

with open("scratch/maths16/all_questions_full.txt", "w", encoding="utf-8") as out:
    out.write(all_q)

print("Saved all_questions_full.txt")
