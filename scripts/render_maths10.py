import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/maths10_pages', exist_ok=True)

# Maths 10 spans PDF pages 185 to 189 (0-indexed: 184, 185, 186, 187, 188)
for pno in range(184, 189):
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, h), dpi=200)
    pix_l.save(f'scratch/maths10_pages/p{pno+1}_left.png')
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200)
    pix_r.save(f'scratch/maths10_pages/p{pno+1}_right.png')
    print(f"Rendered Maths 10 page {pno+1} left and right.")
