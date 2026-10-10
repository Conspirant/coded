import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/phys12_real', exist_ok=True)

# PDF Page 26 is index 25, Page 27 is index 26, Page 28 is index 27
for pno in [25, 26, 27]:
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, h), dpi=200)
    pix_l.save(f'scratch/phys12_real/p{pno+1}_left.png')
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200)
    pix_r.save(f'scratch/phys12_real/p{pno+1}_right.png')
    print(f"Rendered PDF page {pno+1} left and right.")
