import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread('scratch/math18/pdf_p229.png')
if img is None:
    img = cv2.imread('scratch/math18/page_229.png')
h, w, _ = img.shape

# ANSWER KEY is at [1938.0, 1539.0]
# In pdf_p229.png (300 DPI), let's crop the answer key table
# Let's crop from y=int(h*0.50) to h, x=int(w*0.55) to w
crop = img[int(h*0.60):int(h*0.95), int(w*0.50):w]
cv2.imwrite('scratch/math18/answer_key_box.png', crop)

res, _ = ocr(crop)
print("Detected text in Math 18 Answer Key:")
if res:
    for line in sorted(res, key=lambda x: (x[0][0][1], x[0][0][0])):
        txt = line[1].encode('ascii', 'replace').decode('ascii')
        print(f"y={line[0][0][1]:4.0f}, x={line[0][0][0]:4.0f}: {txt}")
