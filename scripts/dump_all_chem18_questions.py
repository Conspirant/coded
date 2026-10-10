import cv2
import re
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

# Pages 160, 161, 162 contain the questions for Chem 18
# Questions are in:
# Page 160: cols 3 & 4
# Page 161: cols 1, 2, 3, 4
# Page 162: cols 1, 2 (before Answer Key at y=1300)

pages_cols = [
    (160, "c3", 0.485, 0.745, 200, 3500),
    (160, "c4", 0.740, 1.000, 200, 3500),
    (161, "c1", 0.000, 0.255, 0, 3500),
    (161, "c2", 0.245, 0.505, 0, 3500),
    (161, "c3", 0.495, 0.755, 0, 3500),
    (161, "c4", 0.745, 1.000, 0, 3500),
    (162, "c1", 0.000, 0.255, 0, 1300),
    (162, "c2", 0.245, 0.505, 0, 1300)
]

all_extracted_lines = []

for p, c, x1_r, x2_r, y1_abs, y2_abs in pages_cols:
    img_path = f"scratch/chem18/pdf_p{p}.png"
    img = cv2.imread(img_path)
    h, w, _ = img.shape
    x1 = int(w * x1_r)
    x2 = int(w * x2_r)
    col_crop = img[y1_abs:y2_abs, x1:x2]
    
    # Scan with sliding window
    step = 25
    win_h = 45
    col_lines = []
    prev_txt = ""
    for y in range(0, col_crop.shape[0] - win_h, step):
        strip = col_crop[y:y+win_h, :]
        res, _ = ocr(strip)
        if res:
            txt = " ".join([l[1] for l in res]).strip()
            if txt and txt != prev_txt:
                col_lines.append(f"[p{p}_{c}_y{y}] {txt}")
                prev_txt = txt
                
    header = f"\n==================== Page {p} Column {c} ====================\n"
    all_extracted_lines.append(header + "\n".join(col_lines))
    print(f"Page {p} {c}: extracted {len(col_lines)} text slices")

with open('scratch/chem18/full_scanned_questions.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(all_extracted_lines))

print("Saved full line-by-line scan of Chem 18 questions!")
