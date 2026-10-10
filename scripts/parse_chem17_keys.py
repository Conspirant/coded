import re

# Let's inspect the exact answer key on Page 157 Column c1, c2
# We can also check the explanations for each question 1..65 to verify every single key!

with open("scratch/chem17/extracted_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's find all explanation answer indicators like "1. (c) :", "2. (b):", etc.
exp_matches = re.findall(r'(\d+)\.\s*\(([a-d]|None)\)', text)
exp_dict = {}
for qnum, ans in exp_matches:
    q = int(qnum)
    if 1 <= q <= 65:
        exp_dict[q] = ans

print(f"Found {len(exp_dict)} explanation answer keys out of 65:")
for i in range(1, 66):
    print(f"Q{i}: {exp_dict.get(i, 'MISSING')}", end=", " if i % 10 != 0 else "\n")
print()
