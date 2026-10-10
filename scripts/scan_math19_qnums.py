import sys, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/math19/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find all questions in the question sections (Pages 232, 233, 234)
# And explanations in Pages 234, 235, 236, 237
print("=== Math 19 Questions in extracted_text.txt ===")
q_matches = re.findall(r'(?:^|\n)\s*(\d{1,2})\.\s+([A-Z].*?)(?=\n\s*\d{1,2}\.|\n\s*\(a\)|\n\s*\[|\Z)', text, re.DOTALL)
found_qnums = []
for qn, qtxt in q_matches:
    num = int(qn)
    if 1 <= num <= 70 and num not in found_qnums:
        found_qnums.append(num)

found_qnums.sort()
print(f"Found {len(found_qnums)} unique question numbers: {found_qnums}")
