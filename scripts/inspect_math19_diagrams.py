import pypdfium2 as pdfium
import sys, os

pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Render pages 232, 233, 234
for pno in [232, 233, 234]:
    page = pdf[pno - 1].render(scale=2.0).to_pil()
    page.save(f'scratch/math19/pdf_p{pno}.png')

print("Rendered pages 232, 233, 234 for Math Ch 19")
