import fitz
import os

pdf_path = "KCET Chapterwise PYQ 2006-24.pdf"
doc = fitz.open(pdf_path)

# Maths Ch 16: PDF pages 214-219 (0-indexed 213-218)
math16_dir = "scratch/maths16"
os.makedirs(math16_dir, exist_ok=True)
for p in range(213, 219):
    page = doc[p]
    pix = page.get_pixmap(dpi=200)
    pix.save(os.path.join(math16_dir, f"page_{p+1}.png"))
    
    rect_l = fitz.Rect(0, 0, page.rect.width / 2, page.rect.height)
    pix_l = page.get_pixmap(dpi=200, clip=rect_l)
    pix_l.save(os.path.join(math16_dir, f"page_{p+1}_L.png"))
    
    rect_r = fitz.Rect(page.rect.width / 2, 0, page.rect.width, page.rect.height)
    pix_r = page.get_pixmap(dpi=200, clip=rect_r)
    pix_r.save(os.path.join(math16_dir, f"page_{p+1}_R.png"))

print("Rendered Maths Ch 16 pages 214-219")

# Physics Ch 20: PDF pages 64-68 (0-indexed 63-67)
phys20_dir = "scratch/physics20"
os.makedirs(phys20_dir, exist_ok=True)
for p in range(63, 68):
    page = doc[p]
    pix = page.get_pixmap(dpi=200)
    pix.save(os.path.join(phys20_dir, f"page_{p+1}.png"))
    
    rect_l = fitz.Rect(0, 0, page.rect.width / 2, page.rect.height)
    pix_l = page.get_pixmap(dpi=200, clip=rect_l)
    pix_l.save(os.path.join(phys20_dir, f"page_{p+1}_L.png"))
    
    rect_r = fitz.Rect(page.rect.width / 2, 0, page.rect.width, page.rect.height)
    pix_r = page.get_pixmap(dpi=200, clip=rect_r)
    pix_r.save(os.path.join(phys20_dir, f"page_{p+1}_R.png"))

print("Rendered Physics Ch 20 pages 64-68")
