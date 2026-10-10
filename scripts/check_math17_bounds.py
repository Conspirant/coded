import re
import sys
import cv2

sys.stdout.reconfigure(encoding='utf-8')

p222 = cv2.imread("scratch/math17/pdf_p222.png")
p223 = cv2.imread("scratch/math17/pdf_p223.png")
p225 = cv2.imread("scratch/math17/pdf_p225.png")
p226 = cv2.imread("scratch/math17/pdf_p226.png")

h, w, _ = p222.shape
# On p222: right half, col 4 is where the answer key is
cv2.imwrite("scratch/math17/p222_answer_key.png", p222[int(h*0.05):int(h*0.75), int(w*0.70):])
print("Saved p222_answer_key.png")

with open("scratch/math17/extracted_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's check where CHAPTER 18 is
for m in re.finditer(r'CHAPTER\s*18', text, re.IGNORECASE):
    pos = m.start()
    print("Found CHAPTER 18 at character:", pos)
    print(text[pos:pos+300])
