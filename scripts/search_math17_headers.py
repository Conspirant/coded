import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

with open("scratch/math17/extracted_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

for m in re.finditer(r'(CHAPTER\s*\d+|ANSWER\s*KEY|EXPLANATIONS)', text, re.IGNORECASE):
    pos = m.start()
    snippet = text[max(0, pos-100):min(len(text), pos+300)]
    print("--- MATCH ---")
    print(snippet)
    print("-------------")

