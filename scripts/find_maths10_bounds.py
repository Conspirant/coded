import pymupdf

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

# Maths 10 starts on page 185 right. Let's inspect pages 185 to 195
for pno in range(184, 195):
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    # check right side and left side top
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, int(h*0.25)), dpi=120)
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, int(h*0.25)), dpi=120)
    pix_l.save(f'scratch/maths10_p{pno+1}_l.png')
    pix_r.save(f'scratch/maths10_p{pno+1}_r.png')

print("Saved headers for Maths pages 185-195.")
