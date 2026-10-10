import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread('scratch/chem18/pdf_p160.png')
h, w, _ = img.shape

# Let's crop from y=400 to 1200 across cols 3 & 4 (x from 0.49*w to w)
crop1 = img[400:1200, int(w*0.48):int(w*0.76)]
crop2 = img[400:1200, int(w*0.75):w]

cv2.imwrite('scratch/chem18/q1_q3_col3.png', crop1)
cv2.imwrite('scratch/chem18/q7_q8_col4.png', crop2)

print("=== Col 3 (Q1-Q3) ===")
res1, _ = ocr(crop1)
if res1:
    for l in res1:
        print(l[1])

print("\n=== Col 4 (Q7-Q8) ===")
res2, _ = ocr(crop2)
if res2:
    for l in res2:
        print(l[1])
