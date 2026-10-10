import cv2
from rapidocr_onnxruntime import RapidOCR
import numpy as np

ocr = RapidOCR()
img = cv2.imread("scratch/chem16/pdf_p152.png")
h, w, _ = img.shape

# Answer key is usually at the top of the page (book page 100, which is left half of pdf_p152)
# Let's crop the top half of left half of pdf_p152
key_crop = img[0:int(h*0.35), 0:int(w*0.5)]
cv2.imwrite("scratch/chem16/ans_key_crop.png", key_crop)

res, _ = ocr(key_crop)
print("--- ANSWER KEY RAW OCR ---")
for r in res:
    print(r[1])
