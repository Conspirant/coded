import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/chem10', exist_ok=True)

# Chem 10 spans PDF pages 126 to 130 (0-indexed: 125, 126, 127, 128, 129)
for pno in range(125, 130):
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, h), dpi=200)
    pix_l.save(f'scratch/chem10/p{pno+1}_left.png')
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200)
    pix_r.save(f'scratch/chem10/p{pno+1}_right.png')
    print(f"Rendered Chem 10 page {pno+1} left and right.")
