import cv2
import re, json, sys, os
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

# Pages 232, 233, 234 contain questions for Math 19 (Vector Algebra)
# Pages 234, 235, 236, 237 contain solutions
# Let's inspect where Answer Key is on page 234/235
p234 = cv2.imread('scratch/math19/pdf_p234.png')
h, w, _ = p234.shape

# Answer key grid is on page 234 column 4 or page 235
# Let's scan all columns of page 234 & 235 to find Answer Key lines
for p in [234, 235]:
    img = cv2.imread(f'scratch/math19/pdf_p{p}.png')
    h, w, _ = img.shape
    cols = [("c1", 0.0, 0.255), ("c2", 0.245, 0.505), ("c3", 0.495, 0.755), ("c4", 0.745, 1.0)]
    for cname, x1_r, x2_r in cols:
        crop = img[:, int(w*x1_r):int(w*x2_r)]
        res, _ = ocr(crop)
        if res:
            col_txt = "\n".join([l[1] for l in res])
            if "ANSWER" in col_txt or "KEY" in col_txt:
                print(f"P{p} {cname} has ANSWER KEY:")
                for l in res:
                    print("  ", l[1])
