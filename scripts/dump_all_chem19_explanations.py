import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

# Pages 166, 167, 168 contain explanations for Chem 19 (Biomolecules)
pages_cols = [
    (166, "c3", 0.495, 0.755, 0, 3500),
    (166, "c4", 0.745, 1.000, 0, 3500),
    (167, "c1", 0.000, 0.255, 0, 3500),
    (167, "c2", 0.245, 0.505, 0, 3500),
    (167, "c3", 0.495, 0.755, 0, 3500),
    (167, "c4", 0.745, 1.000, 0, 3500),
    (168, "c1", 0.000, 0.255, 0, 3500),
    (168, "c2", 0.245, 0.505, 0, 1500)
]

all_extracted_lines = []

for p, c, x1_r, x2_r, y1_abs, y2_abs in pages_cols:
    img_path = f"scratch/chem19/pdf_p{p}.png"
    img = cv2.imread(img_path)
    h, w, _ = img.shape
    x1 = int(w * x1_r)
    x2 = int(w * x2_r)
    col_crop = img[y1_abs:y2_abs, x1:x2]
    
    result, _ = ocr(col_crop)
    if result:
        for item in result:
            all_extracted_lines.append(item[1])

with open("scratch/chem19/raw_explanations_dump.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(all_extracted_lines))

print(f"Extracted {len(all_extracted_lines)} lines of explanations for Chem 19")
