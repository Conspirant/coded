import fitz # PyMuPDF
import os
import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
pdf_path = "KCET Chapterwise PYQ 2006-24.pdf"
doc = fitz.open(pdf_path)

output_dir = "scratch/chem17"
os.makedirs(output_dir, exist_ok=True)
os.makedirs(f"{output_dir}/crops", exist_ok=True)

# Let's inspect pages 153 to 162
print(f"Total pages in doc: {len(doc)}")

for page_idx in range(153, 163):
    page = doc[page_idx]
    text = page.get_text()
    first_lines = "\n".join([line.strip() for line in text.split("\n")[:10] if line.strip()])
    print(f"--- PDF Page {page_idx + 1} (0-index: {page_idx}) ---")
    print(first_lines[:300])
    
    pix = page.get_pixmap(dpi=300)
    img_path = f"{output_dir}/pdf_p{page_idx + 1}.png"
    pix.save(img_path)

print("Rendered pages 154-163.")
