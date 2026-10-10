import fitz
import os
import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

out_cols_dir = "scratch/physics20/cols"
out_txt_dir = "scratch/physics20/ocr_cols"
os.makedirs(out_cols_dir, exist_ok=True)
os.makedirs(out_txt_dir, exist_ok=True)

# Physics Ch 20 is on pages 64 to 67 (0-indexed 63 to 66)
for pno in range(63, 67):
    page_img_path = f"scratch/physics20/page_{pno+1}.png"
    if not os.path.exists(page_img_path):
        continue
    img = cv2.imread(page_img_path)
    h, w, _ = img.shape
    
    col_bounds = [
        (f"p{pno+1}_L_col1", int(0), int(w * 0.25)),
        (f"p{pno+1}_L_col2", int(w * 0.25), int(w * 0.50)),
        (f"p{pno+1}_R_col1", int(w * 0.50), int(w * 0.75)),
        (f"p{pno+1}_R_col2", int(w * 0.75), int(w))
    ]
    
    for name, x1, x2 in col_bounds:
        col_img = img[:, x1:x2]
        col_path = os.path.join(out_cols_dir, f"{name}.png")
        cv2.imwrite(col_path, col_img)
        
        result, _ = ocr(col_path)
        txt_path = os.path.join(out_txt_dir, f"{name}.txt")
        with open(txt_path, "w", encoding="utf-8") as f:
            if result:
                for line in result:
                    f.write(line[1] + "\n")
        print(f"Processed {name}")

print("All columns processed for Physics 20.")
