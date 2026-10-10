import pymupdf
import re

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

# Let's inspect the top header of all pages to find book page number or chapter titles
# In our crops, the header has something like "47", "CHAPTER 12", "Kinetic Theory"
# Let's search by rendering top 15% of pages 1 to 102 (Physics section)
print(f"Total pages in PDF: {len(doc)}")

# Let's check where 'Kinetic Theory' or 'Thermodynamics' is
# Since Thermodynamics (Ch 11) had 23 questions, let's find where those 23 questions were located in the PDF!
# Let's search our repo for where Ch 11 questions were found!
