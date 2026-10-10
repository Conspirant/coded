import fitz
import os

pdf_path = "KCET Chapterwise PYQ 2006-24.pdf"
doc = fitz.open(pdf_path)

out_dir = "scratch/maths13"
os.makedirs(out_dir, exist_ok=True)

for pno in range(193, 206): # 1-indexed page 193 to 205
    page = doc[pno - 1]
    pix = page.get_pixmap(dpi=200)
    full_path = os.path.join(out_dir, f"pdf_p{pno}.png")
    pix.save(full_path)
    
    # Split into left and right columns
    w, h = pix.width, pix.height
    # Left column
    pix_left = page.get_pixmap(dpi=200, clip=fitz.Rect(0, 0, page.rect.width / 2 + 10, page.rect.height))
    pix_left.save(os.path.join(out_dir, f"p{pno}_l.png"))
    
    # Right column
    pix_right = page.get_pixmap(dpi=200, clip=fitz.Rect(page.rect.width / 2 - 10, 0, page.rect.width, page.rect.height))
    pix_right.save(os.path.join(out_dir, f"p{pno}_r.png"))

print("Rendered and split pages 193 to 205 into scratch/maths13/")
