import pymupdf

doc = pymupdf.open('KCET Chapterwise PYQ 2006-24.pdf')

# Let's inspect pages around:
# Physics Ch 11 ended around page 55-60. Let's find Physics Ch 12
# Chemistry Ch 9 ended on page 126. Let's find Chemistry Ch 10
# Maths Ch 9 ended on page 185. Maths Ch 10 is on page 185 right.

print("Scanning for chapters...")
# We can check page 185 right for Maths 10
p185 = doc[184]
w, h = p185.rect.width, p185.rect.height
p185.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200).save('scratch/maths10_start.png')
print("Saved scratch/maths10_start.png")

# Chemistry Ch 10 on page 126 right:
p126 = doc[125]
p126.get_pixmap(clip=pymupdf.Rect(w/2, 0, w, h), dpi=200).save('scratch/chem10_start.png')
print("Saved scratch/chem10_start.png")

# Physics Ch 11 was around page 45-55. Let's search where 'Kinetic Theory' or Ch 12 appears
for pno in range(40, 65):
    t = doc[pno].get_text() # in case there is text, or let's inspect images
