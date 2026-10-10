import pymupdf
import os

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')
os.makedirs('public/pyq_images/maths/ch10', exist_ok=True)

# p188 is doc[187]
p188 = doc[187]
w, h = p188.rect.width, p188.rect.height

# In right column of p188 (w/2 to w), explanation 28 diagram is in the upper half
pix = p188.get_pixmap(dpi=200)
# crop around exp 28
# Let's save the right column of p188 hires
p188_r = p188.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200)
# exp 28 diagram is located roughly y: 250 to 420 in 72dpi
crop_box = pymupdf.Rect(w/2 + 50, 240, w - 80, 420)
p188.get_pixmap(clip=crop_box, dpi=200).save('public/pyq_images/maths/ch10/exp_q28.png')
print("Cropped exp_q28.png")
