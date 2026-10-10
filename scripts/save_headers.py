import fitz

doc = fitz.open("KCET Chapterwise PYQ 2006-24.pdf")

for pno in range(193, 206):
    page = doc[pno - 1]
    # Let's render the top 15% of the page
    clip = fitz.Rect(0, 0, page.rect.width, page.rect.height * 0.15)
    pix = page.get_pixmap(dpi=150, clip=clip)
    pix.save(f"scratch/maths13/header_p{pno}.png")

print("Saved headers for pages 193 to 205.")
