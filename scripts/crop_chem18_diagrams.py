import cv2
import os

os.makedirs('public/pyq_images/chemistry/ch18', exist_ok=True)

# Load pages
p160 = cv2.imread('scratch/chem18/pdf_p160.png')
p161 = cv2.imread('scratch/chem18/pdf_p161.png')
p162 = cv2.imread('scratch/chem18/pdf_p162.png')
p163 = cv2.imread('scratch/chem18/pdf_p163.png')
p164 = cv2.imread('scratch/chem18/pdf_p164.png')

h, w, _ = p160.shape

# Q8 reaction scheme (p160 c4 y~640-800)
# Let's crop Q8 flowchart
crop_q8 = p160[640:820, int(w*0.74):int(w*1.0)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q8_scheme.png', crop_q8)

# Q18 reaction scheme (p161 c2 y~1400-1650)
crop_q18 = p161[1400:1650, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q18_scheme.png', crop_q18)

# Q19 reaction scheme (p161 c2 y~2000-2250)
crop_q19 = p161[1980:2220, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q19_scheme.png', crop_q19)

# Q30 options / structures (p161 c4 y~50-450)
crop_q30 = p161[50:480, int(w*0.745):int(w*1.0)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q30_options.png', crop_q30)

# Q32 reaction scheme (p161 c4 y~1900-2150)
crop_q32 = p161[1900:2150, int(w*0.745):int(w*1.0)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q32_scheme.png', crop_q32)

# Q34 reaction scheme (p162 c1 y~30-350)
crop_q34 = p162[30:350, 0:int(w*0.255)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q34_scheme.png', crop_q34)

# Q37 reaction scheme (p162 c1 y~1100-1300)
crop_q37 = p162[1080:1300, 0:int(w*0.255)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q37_scheme.png', crop_q37)

# Q39 reaction scheme (p162 c2 y~350-650)
crop_q39 = p162[350:650, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q39_scheme.png', crop_q39)

# Q40 reaction scheme (p162 c2 y~750-1050)
crop_q40 = p162[750:1050, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/chemistry/ch18/q40_scheme.png', crop_q40)

# Explanations crops
# Expl 10 (p162 c4 y~0-500)
crop_expl10 = p162[0:500, int(w*0.745):int(w*1.0)]
cv2.imwrite('public/pyq_images/chemistry/ch18/expl10_scheme.png', crop_expl10)

# Expl 11 (p162 c4 y~500-1050)
crop_expl11 = p162[500:1050, int(w*0.745):int(w*1.0)]
cv2.imwrite('public/pyq_images/chemistry/ch18/expl11_scheme.png', crop_expl11)

# Expl 15 (p163 c1 y~250-750)
crop_expl15 = p163[250:750, 0:int(w*0.255)]
cv2.imwrite('public/pyq_images/chemistry/ch18/expl15_scheme.png', crop_expl15)

# Expl 39 (p164 c1 y~0-500)
crop_expl39 = p164[0:500, 0:int(w*0.255)]
cv2.imwrite('public/pyq_images/chemistry/ch18/expl39_scheme.png', crop_expl39)

# Expl 40 (p164 c2 y~0-500)
crop_expl40 = p164[0:500, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/chemistry/ch18/expl40_scheme.png', crop_expl40)

print("All Chem 18 diagram crops saved successfully!")
