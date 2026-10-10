import fitz # PyMuPDF
import os

pdf_path = "KCET Chapterwise PYQ 2006-24.pdf"
out_dir = "scratch/chem13"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)

# Let's render pages 139 to 148 (0-indexed: 138 to 147)
for page_num in range(138, 148):
    page = doc[page_num]
    pix = page.get_pixmap(dpi=200)
    png_path = os.path.join(out_dir, f"pdf_p{page_num+1}.png")
    pix.save(png_path)
    
    # Split into left and right
    w, h = pix.width, pix.height
    rect_l = fitz.Rect(0, 0, page.rect.width / 2, page.rect.height)
    pix_l = page.get_pixmap(dpi=200, clip=rect_l)
    pix_l.save(os.path.join(out_dir, f"p{page_num+1}_l.png"))
    
    rect_r = fitz.Rect(page.rect.width / 2, 0, page.rect.width, page.rect.height)
    pix_r = page.get_pixmap(dpi=200, clip=rect_r)
    pix_r.save(os.path.join(out_dir, f"p{page_num+1}_r.png"))

print(f"Rendered and cropped pages 139-148 to {out_dir}")
