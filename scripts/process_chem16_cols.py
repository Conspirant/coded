import fitz
import os
import cv2
from rapidocr_onnxruntime import RapidOCR

pdf_path = "KCET Chapterwise PYQ 2006-24.pdf"
doc = fitz.open(pdf_path)
ocr = RapidOCR()

out_cols_dir = "scratch/chem16/cols"
out_txt_dir = "scratch/chem16/ocr_cols"
os.makedirs(out_cols_dir, exist_ok=True)
os.makedirs(out_txt_dir, exist_ok=True)

# Chem 16 is on pages 150 to 154 (0-indexed 149 to 153)
for pno in range(149, 154):
    page = doc[pno]
    zoom = 2.5 # ~180-200 DPI
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    
    # Save full page
    page_img_path = f"scratch/chem16/pdf_p{pno+1}.png"
    pix.save(page_img_path)
    
    img = cv2.imread(page_img_path)
    h, w, _ = img.shape
    
    # Define 4 column bounds:
    # Book Page Left: col1: 0 to w*0.25, col2: w*0.25 to w*0.50
    # Book Page Right: col1: w*0.50 to w*0.75, col2: w*0.75 to w*1.00
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

print("All columns processed for Chem 16.")
