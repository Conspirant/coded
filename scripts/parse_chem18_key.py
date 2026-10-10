import cv2
import numpy as np
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread('scratch/chem18/answer_key.png')
h, w, _ = img.shape

# The table starts around y=60 and ends around y=260
# Rows:
# Row 1: 1-8
# Row 2: 9-16
# Row 3: 17-23 / 24?
# Row 4: 24-31
# Row 5: 32-39
# Row 6: 40?
# Let's crop row by row and cell by cell to get 100% precision.

# There are 8 columns:
# Col 1: x ~ 40 to 180
# Col 2: x ~ 180 to 330
# Col 3: x ~ 330 to 480
# Col 4: x ~ 480 to 630
# Col 5: x ~ 630 to 780
# Col 6: x ~ 780 to 930
# Col 7: x ~ 930 to 1080
# Col 8: x ~ 1080 to 1230

# Let's find vertical and horizontal grid lines using morphology
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

# Print all OCR lines with exact box
res, _ = ocr(img)
for r in sorted(res, key=lambda x: (x[0][0][1], x[0][0][0])):
    print(f"y={r[0][0][1]:4.0f}, x={r[0][0][0]:4.0f}: {r[1]}")
