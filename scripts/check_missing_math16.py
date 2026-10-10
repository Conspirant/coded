with open("scratch/maths16/all_explanations_raw.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re

for q in [1, 12, 17, 30, 33, 35]:
    pos = text.find(f"{q}.")
    if pos != -1:
        snippet = text[max(0, pos-50):min(len(text), pos+250)].replace('\n', ' ')
        print(f"=== Q{q} ===")
        print(snippet)
        print()
    else:
        print(f"=== Q{q} NOT FOUND ===")
