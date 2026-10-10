with open("scratch/physics20/all_q_and_exp.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Find questions: lines starting with a number and dot
q_matches = re.findall(r'(?:^|\n)\s*(\d{1,2})\s*[\.]\s*([^\n]+)', text)
print("Detected question headings in text:")
for q, heading in q_matches:
    print(f"Q{q}: {heading[:80]}")
