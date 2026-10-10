import os
import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img_dir = "scratch/chem16"
ocr_out_dir = "scratch/chem16/ocr_text"
os.makedirs(ocr_out_dir, exist_ok=True)

files = sorted([f for f in os.listdir(img_dir) if f.startswith("page_") and (f.endswith("_L.png") or f.endswith("_R.png"))])

for f in files:
    img_path = os.path.join(img_dir, f)
    result, _ = ocr(img_path)
    txt_path = os.path.join(ocr_out_dir, f.replace(".png", ".txt"))
    with open(txt_path, "w", encoding="utf-8") as out:
        if result:
            for item in result:
                line_text = item[1]
                out.write(line_text + "\n")
    print(f"OCRed {f} -> {txt_path}")

print("Done OCRing all chem16 pages.")
