import re
import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

with open('scratch/math18/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract explanation answers
expl_answers = {}
matches = re.findall(r'(?:^|\n)\s*(\d+)\s*[\.:\)]\s*\(([a-d])\)', text, re.IGNORECASE)
for q, a in matches:
    q_int = int(q)
    if 1 <= q_int <= 39:
        expl_answers[q_int] = a.lower()

matches2 = re.findall(r'(?:^|\n)\s*(\d+)\.\s*\(([a-d])\)\s*:', text, re.IGNORECASE)
for q, a in matches2:
    q_int = int(q)
    if 1 <= q_int <= 39:
        expl_answers[q_int] = a.lower()

print(f"Found {len(expl_answers)} answers from Math 18 explanation text:")
for q in range(1, 40):
    print(f"Q{q:2d}: ({expl_answers.get(q, '?')})", end="  ")
    if q % 8 == 0: print()
print()
