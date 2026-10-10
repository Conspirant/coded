import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('scratch/maths9', exist_ok=True)

# Pages 183, 184, 185 in PDF (0-indexed: 182, 183, 184)
for pno in [182, 183, 184]:
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    
    # Left column
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, h), dpi=200)
    pix_l.save(f'scratch/maths9/p{pno+1}_left.png')
    
    # Right column
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200)
    pix_r.save(f'scratch/maths9/p{pno+1}_right.png')
    
    print(f"Rendered page {pno+1} left and right.")
