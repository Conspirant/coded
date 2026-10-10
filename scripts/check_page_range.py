import fitz

doc = fitz.open("KCET Chapterwise PYQ 2006-24.pdf")

# Let's check page numbers printed on pages 193 to 205
for pno in range(193, 206):
    page = doc[pno - 1]
    pix = page.get_pixmap(dpi=150)
    print(f"PDF page {pno}: size = {pix.width}x{pix.height}")
