import re
import sys
import cv2

sys.stdout.reconfigure(encoding='utf-8')

with open("scratch/phys21/extracted_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for "ANSWER" or "22" or "(a)" patterns
for m in re.finditer(r'(ANSWER|CHAPTER\s*22|EXPLANATION|1\.\s*\([a-d]\))', text, re.IGNORECASE):
    pos = m.start()
    snippet = text[max(0, pos-50):min(len(text), pos+250)]
    print("--- MATCH ---")
    print(snippet)
    print("-------------")
