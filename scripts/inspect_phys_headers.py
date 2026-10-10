import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

# Let's inspect pages 40 to 65 to see where chapters 11, 12, 13 start
os.makedirs('scratch/physics_headers', exist_ok=True)
for pno in range(40, 60):
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    # check right side and left side top
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, int(h*0.25)), dpi=150)
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, int(h*0.25)), dpi=150)
    pix_l.save(f'scratch/physics_headers/p{pno+1}_left.png')
    pix_r.save(f'scratch/physics_headers/p{pno+1}_right.png')

print("Saved headers for physics pages 41-60.")
