import pymupdf

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

for pno in range(45, 65):
    pix = doc[pno].get_pixmap(dpi=100)
    # save low res image to inspect
    pix.save(f'scratch/phys_p{pno+1}.png')

print("Rendered physics pages 46 to 65.")
