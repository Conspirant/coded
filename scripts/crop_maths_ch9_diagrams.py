import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('public/pyq_images/maths/ch9', exist_ok=True)

# Page 184 (0-indexed 183)
p184 = doc[183]
zoom = 300 / 72
mat = pymupdf.Matrix(zoom, zoom)

# exp_q2 is on bottom right of left column of page 184
# Let's crop triangle A(x1,y1), B, C, G, D
# Bounding box in 72dpi:
# width is ~595, height ~842
# Left column is x: 0 to 297, bottom area around y: 700 to 830
rect_exp2 = pymupdf.Rect(450, 720, 570, 840) # wait, let's check coordinate in p184_left.png
# Wait, in p184_left.png: the image was the left half of the page!
# In p184_left.png (which was clip pymupdf.Rect(0, 0, w/2, h)), wait, look at p184_left.png:
# The triangle diagram was in the right half of the column!
# Let's verify page coordinates with a quick script.
