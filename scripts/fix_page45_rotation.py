import fitz
import os

doc = fitz.open("KCET Chapterwise PYQ 2006-24.pdf")
page = doc[44] # 0-indexed page 44 (PDF page 45)

# Render rotated by 180 degrees
matrix = fitz.Matrix(fitz.Identity).prerotate(180)
pix = page.get_pixmap(dpi=200, matrix=matrix)
pix.save("scratch/physics17/pdf_p45_rot.png")

# Left column
pix_left = page.get_pixmap(dpi=200, matrix=matrix, clip=fitz.Rect(0, 0, page.rect.width / 2 + 10, page.rect.height))
pix_left.save("scratch/physics17/p45_rot_l.png")

# Right column
pix_right = page.get_pixmap(dpi=200, matrix=matrix, clip=fitz.Rect(page.rect.width / 2 - 10, 0, page.rect.width, page.rect.height))
pix_right.save("scratch/physics17/p45_rot_r.png")

print("Saved rotated page 45.")
