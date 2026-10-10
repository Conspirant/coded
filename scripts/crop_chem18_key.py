import cv2
import numpy as np
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread('scratch/chem18/pdf_p162.png')
h, w, _ = img.shape

# The answer key is in the lower-middle portion of columns 1-2 on page 162
# Let's crop from y=0.50 to y=0.75 across cols 1 & 2 (x=0 to x=0.52*w)
y1 = 1300
y2 = 1700
x1 = 40
x2 = 1250

crop = img[y1:y2, x1:x2]
cv2.imwrite('scratch/chem18/answer_key.png', crop)

res, _ = ocr(crop)
print("Detected text in Answer Key crop:")
if res:
    # Sort detected boxes top to bottom, left to right
    for line in res:
        box, text, score = line
        print(f"{text.ljust(15)} at box {box[0]}")
