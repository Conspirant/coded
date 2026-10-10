import cv2
import re
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

for p in [67, 68, 69]:
    img = cv2.imread(f'scratch/phys21_fix/p{p}.png')
    h, w, _ = img.shape
    
    # We have 4 columns
    cols = [
        ("c1", 0.00, 0.26),
        ("c2", 0.25, 0.51),
        ("c3", 0.50, 0.76),
        ("c4", 0.75, 1.00)
    ]
    
    print(f"\n==================== Page {p} ====================")
    for c_name, x1_r, x2_r in cols:
        x1 = int(w * x1_r)
        x2 = int(w * x2_r)
        crop = img[:, x1:x2]
        res, _ = ocr(crop)
        if res:
            for l in res:
                box, txt, score = l
                # Check for question numbers like "9.", "35.", "40.", "41.", "44.", "45.", "51.", "52."
                m = re.match(r'^(\d{1,2})\.', txt)
                if m or any(k in txt.upper() for k in ['CIRCUIT', 'GRAPH', 'FIGURE', 'SHOWN', 'READING', 'VARIATION', 'VOLTMETER']):
                    y_top = box[0][1]
                    safe_txt = txt.encode('ascii', 'replace').decode('ascii')
                    print(f"Page {p} {c_name} (y={y_top:4.0f}): {safe_txt}")
