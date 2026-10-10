import pymupdf

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

# Let's search for "ANSWER KEY" on pages 127, 128, 129, 130
for pno in [126, 127, 128, 129]:
    page = doc[pno]
    w, h = page.rect.width, page.rect.height
    # check left and right
    pix_l = page.get_pixmap(clip=pymupdf.Rect(0, 0, w/2, h), dpi=150)
    pix_r = page.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=150)
    
    # save
    pix_l.save(f'scratch/chem10/check_p{pno+1}_l.png')
    pix_r.save(f'scratch/chem10/check_p{pno+1}_r.png')

print("Saved check images for Chem 10.")
