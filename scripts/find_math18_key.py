import cv2
import os
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

for p in range(228, 234):
    img = cv2.imread(f'scratch/math18/pdf_p{p}.png') if os.path.exists(f'scratch/math18/pdf_p{p}.png') else cv2.imread(f'scratch/math18/page_{p}.png')
    if img is None: continue
    res, _ = ocr(img)
    if res:
        for l in res:
            txt = l[1]
            if any(k in txt.upper() for k in ['ANSWER', 'KEY', 'CHAPTER', 'VECTOR', 'ALGEBRA', 'THREE', 'DIMENSIONAL', '18.']):
                print(f"Page {p} ({l[0][0]}): {txt}")
