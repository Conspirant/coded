import cv2
from rapidocr_onnxruntime import RapidOCR
import re

ocr = RapidOCR()

for p in [64, 65, 66]:
    img = cv2.imread(f"scratch/physics20/page_{p}.png")
    res, _ = ocr(img)
    print(f"\n================ PAGE {p} ================")
    for box, text, score in res:
        # If line starts with a number like "1.", "2.", "15.", etc.
        m = re.match(r'^\s*(\d{1,2})\s*[\.]', text)
        if m:
            print(f"Detected Q{m.group(1)}: {text}")
