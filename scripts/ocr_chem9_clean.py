import pymupdf
import pytesseract
import os
from PIL import Image
import io

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/chem9_clean', exist_ok=True)

# Chem 9 pages in PDF are 123, 124, 125, 126 (0-indexed: 122, 123, 124, 125)
for pno in [122, 123, 124, 125]:
    page = doc[pno]
    zoom = 300 / 72 # 300 DPI
    mat = pymupdf.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    
    w, h = img.size
    mid_x = int(w * 0.50)
    
    left_img = img.crop((0, 0, mid_x, h))
    right_img = img.crop((mid_x, 0, w, h))
    
    left_text = pytesseract.image_to_string(left_img, config='--psm 6')
    right_text = pytesseract.image_to_string(right_img, config='--psm 6')
    
    with open(f'scratch/chem9_clean/p{pno+1}_col1.txt', 'w', encoding='utf-8') as f:
        f.write(left_text)
    with open(f'scratch/chem9_clean/p{pno+1}_col2.txt', 'w', encoding='utf-8') as f:
        f.write(right_text)
    
    print(f"Page {pno+1} done: col1={len(left_text)} chars, col2={len(right_text)} chars")

print("All clean column OCR complete.")
