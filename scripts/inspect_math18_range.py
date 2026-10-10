import pymupdf
import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

for p in range(228, 235):
    pix = doc[p-1].get_pixmap(dpi=150)
    img_path = f'scratch/math18/page_{p}.png'
    pix.save(img_path)
    img = cv2.imread(img_path)
    h, w, _ = img.shape
    
    # OCR top 10% and bottom 10%
    top = img[0:int(h*0.15), :]
    res, _ = ocr(top)
    txts = [l[1] for l in res] if res else []
    print(f"Page {p}:", " | ".join(txts)[:120].encode('ascii', 'replace').decode('ascii'))
