import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/phys12', exist_ok=True)

# Book page 47 is PDF page 49 (0-indexed: 48)
# Let's render PDF pages 48, 49, 50, 51 (0-indexed: 47, 48, 49, 50)
for pno in range(47, 52):
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, h), dpi=200)
    pix_l.save(f'scratch/phys12/p{pno+1}_left.png')
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200)
    pix_r.save(f'scratch/phys12/p{pno+1}_right.png')
    print(f"Rendered PDF page {pno+1} left and right.")
