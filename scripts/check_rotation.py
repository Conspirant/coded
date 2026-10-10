import fitz
import os

doc = fitz.open("KCET Chapterwise PYQ 2006-24.pdf")

for pno in range(45, 60):
    page = doc[pno - 1]
    print(f"Page {pno}: rotation = {page.rotation}, rect = {page.rect}")
