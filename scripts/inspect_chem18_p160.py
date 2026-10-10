import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread('scratch/chem18/pdf_p160.png')
h, w, _ = img.shape

# Cols 3 and 4 combined: x from 0.49*w to w
c34 = img[:, int(w*0.48):w]
cv2.imwrite('scratch/chem18/p160_c34.png', c34)

# Let's crop vertical strips
for y_start in range(0, h, int(h*0.1)):
    strip = c34[y_start:y_start+int(h*0.12), :]
    res, _ = ocr(strip)
    print(f"\n--- Y = {y_start} to {y_start+int(h*0.12)} ---")
    if res:
        for l in res:
            print(f"  {l[1]}")
