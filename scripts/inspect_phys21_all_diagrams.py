import pymupdf
import cv2
import os
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

# Physics Chapter 21 is on PDF pages 67, 68, 69
# Let's render high-res pages 67, 68, 69
os.makedirs('scratch/phys21_fix', exist_ok=True)
for p in [67, 68, 69]:
    page = doc[p - 1]
    pix = page.get_pixmap(dpi=300)
    pix.save(f'scratch/phys21_fix/p{p}.png')

print("Rendered 300 DPI pages 67, 68, 69.")
