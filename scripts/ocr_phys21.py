import cv2
import os
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
output_dir = "scratch/phys21"
os.makedirs(f"{output_dir}/columns", exist_ok=True)

pages = range(67, 72)

all_text = []

for p in pages:
    img_path = f"{output_dir}/pdf_p{p}.png"
    if not os.path.exists(img_path):
        continue
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
        crop_path = f"{output_dir}/columns/p{p}_{c_name}.png"
        cv2.imwrite(crop_path, crop)
        
        result, _ = ocr(crop)
        col_text = []
        if result:
            for line in result:
                col_text.append(line[1])
        
        joined = "\n".join(col_text)
        header = f"\n\n==================== Page {p} Column {c_name} ====================\n"
        all_text.append(header + joined)
        print(f"Phys Page {p} {c_name} extracted: {len(col_text)} lines")

with open(f"{output_dir}/extracted_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(all_text))

print("Completed OCR of Physics Chapter 21.")
