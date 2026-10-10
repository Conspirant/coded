import pymupdf
import cv2
import os
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

tasks = [
    ("chem19", "Chemistry Ch 19 (Biomolecules)", range(164, 170)),
    ("math19", "Mathematics Ch 19 (Vector Algebra)", range(232, 238)),
    ("phys23", "Physics Ch 23 (Ray Optics)", range(73, 80))
]

for folder, name, pages in tasks:
    out_dir = f"scratch/{folder}"
    os.makedirs(f"{out_dir}/columns", exist_ok=True)
    print(f"=== Rendering & OCR for {name} ({pages}) ===")
    
    all_text = []
    
    for p in pages:
        page = doc[p - 1]
        pix = page.get_pixmap(dpi=300)
        img_path = f"{out_dir}/pdf_p{p}.png"
        pix.save(img_path)
        
        img = cv2.imread(img_path)
        h, w, _ = img.shape
        
        cols = [
            ("c1", 0.00, 0.255),
            ("c2", 0.245, 0.505),
            ("c3", 0.495, 0.755),
            ("c4", 0.745, 1.00)
        ]
        
        for c_name, x1_ratio, x2_ratio in cols:
            x1 = int(w * x1_ratio)
            x2 = int(w * x2_ratio)
            crop = img[:, x1:x2]
            crop_path = f"{out_dir}/columns/p{p}_{c_name}.png"
            cv2.imwrite(crop_path, crop)
            
            result, _ = ocr(crop)
            col_text = []
            if result:
                for line in result:
                    col_text.append(line[1])
            
            joined = "\n".join(col_text)
            header = f"\n\n==================== Page {p} Column {c_name} ====================\n"
            all_text.append(header + joined)
            print(f"Page {p} {c_name}: {len(col_text)} lines extracted")
            
    with open(f"{out_dir}/extracted_text.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(all_text))
        
    print(f"Completed {name} -> {out_dir}/extracted_text.txt")
