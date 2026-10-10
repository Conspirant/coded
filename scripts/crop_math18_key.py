import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread('scratch/math18/pdf_p229.png')
if img is None:
    img = cv2.imread('scratch/math18/page_229.png')
h, w, _ = img.shape

# ANSWER KEY is at [1938.0, 1539.0]
# In 300 DPI or 150 DPI, let's crop the bottom half of page 229
crop = img[int(h*0.55):h, :]
cv2.imwrite('scratch/math18/answer_key.png', crop)

res, _ = ocr(crop)
print("Detected lines in Math 18 Answer Key crop:")
if res:
    for line in sorted(res, key=lambda x: (x[0][0][1], x[0][0][0])):
        print(f"y={line[0][0][1]:4.0f}, x={line[0][0][0]:4.0f}: {line[1]}")
