import cv2
import re
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

# Pages 164, 165, 166 contain questions for Chem 19 (Biomolecules)
pages_cols = [
    (164, "c3", 0.485, 0.745, 150, 3500),
    (164, "c4", 0.740, 1.000, 150, 3500),
    (165, "c1", 0.000, 0.255, 0, 3500),
    (165, "c2", 0.245, 0.505, 0, 3500),
    (165, "c3", 0.495, 0.755, 0, 3500),
    (165, "c4", 0.745, 1.000, 0, 3500),
    (166, "c1", 0.000, 0.255, 0, 1500),
    (166, "c2", 0.245, 0.505, 0, 700)
]

all_extracted_lines = []

for p, c, x1_r, x2_r, y1_abs, y2_abs in pages_cols:
    img_path = f"scratch/chem19/pdf_p{p}.png"
    img = cv2.imread(img_path)
    h, w, _ = img.shape
    x1 = int(w * x1_r)
    x2 = int(w * x2_r)
    col_crop = img[y1_abs:y2_abs, x1:x2]
    
    # Run RapidOCR on whole column and sliding window for precision
    result, _ = ocr(col_crop)
    if result:
        for item in result:
            all_extracted_lines.append(item[1])

with open("scratch/chem19/raw_questions_dump.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(all_extracted_lines))

print(f"Extracted {len(all_extracted_lines)} lines of questions for Chem 19")
