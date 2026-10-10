import fitz
import os

pdf_path = "KCET Chapterwise PYQ 2006-24.pdf"
doc = fitz.open(pdf_path)

# Math 17: PDF pages 218 to 226
os.makedirs("scratch/math17", exist_ok=True)
for p in range(217, 226):
    page = doc[p]
    pix = page.get_pixmap(dpi=300)
    pix.save(f"scratch/math17/pdf_p{p+1}.png")
print("Rendered Math 17 pages 218-226.")

# Phys 21: PDF pages 67 to 71
os.makedirs("scratch/phys21", exist_ok=True)
for p in range(66, 71):
    page = doc[p]
    pix = page.get_pixmap(dpi=300)
    pix.save(f"scratch/phys21/pdf_p{p+1}.png")
print("Rendered Phys 21 pages 67-71.")
