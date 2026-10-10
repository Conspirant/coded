import os

txt_files = [
    "p64_L_col1.txt", "p64_L_col2.txt", "p64_R_col1.txt", "p64_R_col2.txt",
    "p65_L_col1.txt", "p65_L_col2.txt", "p65_R_col1.txt", "p65_R_col2.txt",
    "p66_L_col1.txt", "p66_L_col2.txt", "p66_R_col1.txt", "p66_R_col2.txt",
    "p67_L_col1.txt", "p67_L_col2.txt"
]

all_text = ""
for f in txt_files:
    p = os.path.join("scratch/physics20/ocr_cols", f)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as file:
            all_text += f"\n==================== {f} ====================\n" + file.read()

with open("scratch/physics20/all_q_and_exp.txt", "w", encoding="utf-8") as out:
    out.write(all_text)

print("Saved all_q_and_exp.txt")
