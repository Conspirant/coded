import cv2
from rapidocr_onnxruntime import RapidOCR
import os

ocr = RapidOCR()

# Let's write a script that reads each page half with rapidocr and prints lines with utf-8 encoding safely
def dump_ocr(img_path, out_txt):
    res, _ = ocr(img_path)
    with open(out_txt, "w", encoding="utf-8") as f:
        if res:
            for r in res:
                box = r[0]
                text = r[1]
                ys = [p[1] for p in box]
                xs = [p[0] for p in box]
                f.write(f"[{min(ys):.1f}, {min(xs):.1f}] {text}\n")

os.makedirs("scratch/chem16/boxes", exist_ok=True)
for p in [150, 151, 152, 153, 154]:
    dump_ocr(f"scratch/chem16/pdf_p{p}.png", f"scratch/chem16/boxes/p{p}_boxes.txt")

print("Dumped all bounding boxes.")
