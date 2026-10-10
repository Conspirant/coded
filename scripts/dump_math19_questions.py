import cv2
import re, json, sys, os
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

# Pages 232, 233, 234 contain questions for Math Ch 19
# Page 232: cols 1, 2, 3, 4
# Page 233: cols 1, 2, 3, 4
# Page 234: cols 1, 2, 3 (col 4 has Answer Key)

pages_cols = [
    (232, "c1", 0.000, 0.255),
    (232, "c2", 0.245, 0.505),
    (232, "c3", 0.495, 0.755),
    (232, "c4", 0.745, 1.000),
    (233, "c1", 0.000, 0.255),
    (233, "c2", 0.245, 0.505),
    (233, "c3", 0.495, 0.755),
    (233, "c4", 0.745, 1.000),
    (234, "c1", 0.000, 0.255),
    (234, "c2", 0.245, 0.505),
    (234, "c3", 0.495, 0.755)
]

all_lines = []

for p, c, x1_r, x2_r in pages_cols:
    img = cv2.imread(f"scratch/math19/pdf_p{p}.png")
    h, w, _ = img.shape
    x1 = int(w * x1_r)
    x2 = int(w * x2_r)
    col_crop = img[:, x1:x2]
    
    result, _ = ocr(col_crop)
    if result:
        header = f"\n=== Page {p} {c} ===\n"
        all_lines.append(header)
        for item in result:
            all_lines.append(item[1])

with open("scratch/math19/all_questions_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(all_lines))

print("Dumped all math 19 questions text!")
