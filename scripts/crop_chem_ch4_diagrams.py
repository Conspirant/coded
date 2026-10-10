import pypdfium2 as pdfium
import os
from PIL import Image

os.makedirs('public/pyq_images/chemistry/ch4', exist_ok=True)
pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# 1. Book Page 19 (PDF 111 right side)
# Solution 8: sigma* 1s orbital subtraction and nodal plane diagram
p111 = pdf[110].render(scale=3.5).to_pil()
w111, h111 = p111.size
page19 = p111.crop((w111 // 2, 0, w111, h111))
pw19, ph19 = page19.size
# Diagram 8 is near the bottom of left column of page 19
exp_q8 = page19.crop((int(pw19 * 0.05), int(ph19 * 0.77), int(pw19 * 0.48), int(ph19 * 0.88)))
exp_q8.save('public/pyq_images/chemistry/ch4/exp_q8.png')

# 2. Book Page 20 (PDF 112 left side)
p112 = pdf[111].render(scale=3.5).to_pil()
w112, h112 = p112.size
page20 = p112.crop((0, 0, w112 // 2, h112))
pw20, ph20 = page20.size

# Solution 9: Benzene orbital diagram (top left)
exp_q9 = page20.crop((int(pw20 * 0.08), int(ph20 * 0.12), int(pw20 * 0.48), int(ph20 * 0.22)))
exp_q9.save('public/pyq_images/chemistry/ch4/exp_q9.png')

# Solution 11: NH4+ Cl- Lewis coordinate structure
exp_q11 = page20.crop((int(pw20 * 0.35), int(ph20 * 0.38), int(pw20 * 0.49), int(ph20 * 0.47)))
exp_q11.save('public/pyq_images/chemistry/ch4/exp_q11.png')

# Solution 12: AB3 pyramidal geometry
exp_q12 = page20.crop((int(pw20 * 0.40), int(ph20 * 0.52), int(pw20 * 0.50), int(ph20 * 0.60)))
exp_q12.save('public/pyq_images/chemistry/ch4/exp_q12.png')

# 3. Book Page 21 (PDF 112 right side)
page21 = p112.crop((w112 // 2, 0, w112, h112))
pw21, ph21 = page21.size

# Solution 23: Salicylaldehyde H-bonding (top right)
exp_q23 = page21.crop((int(pw21 * 0.78), int(ph21 * 0.14), int(pw21 * 0.96), int(ph21 * 0.26)))
exp_q23.save('public/pyq_images/chemistry/ch4/exp_q23.png')

# 4. Book Page 22 (PDF 113 left side)
p113 = pdf[112].render(scale=3.5).to_pil()
w113, h113 = p113.size
page22 = p113.crop((0, 0, w113 // 2, h113))
pw22, ph22 = page22.size

# Solution 33: NH3 pyramidal/tetrahedral shape (top left)
exp_q33 = page22.crop((int(pw22 * 0.18), int(ph22 * 0.06), int(pw22 * 0.38), int(ph22 * 0.19)))
exp_q33.save('public/pyq_images/chemistry/ch4/exp_q33.png')

# Solution 34: N2O resonance structures
exp_q34 = page22.crop((int(pw22 * 0.12), int(ph22 * 0.19), int(pw22 * 0.48), int(ph22 * 0.23)))
exp_q34.save('public/pyq_images/chemistry/ch4/exp_q34.png')

# Solution 36: CO2, CH4, CO3(2-) hybridizations
exp_q36 = page22.crop((int(pw22 * 0.08), int(ph22 * 0.27), int(pw22 * 0.49), int(ph22 * 0.37)))
exp_q36.save('public/pyq_images/chemistry/ch4/exp_q36.png')

# Solution 38: I3+ and H2O bent shapes
exp_q38 = page22.crop((int(pw22 * 0.10), int(ph22 * 0.41), int(pw22 * 0.48), int(ph22 * 0.51)))
exp_q38.save('public/pyq_images/chemistry/ch4/exp_q38.png')

# Solution 39: Ozone formal charge numbered atoms
exp_q39 = page22.crop((int(pw22 * 0.18), int(ph22 * 0.51), int(pw22 * 0.30), int(ph22 * 0.57)))
exp_q39.save('public/pyq_images/chemistry/ch4/exp_q39.png')

# Solution 41: PH4+ and PH3 shapes & bond angles
exp_q41 = page22.crop((int(pw22 * 0.55), int(ph22 * 0.37), int(pw22 * 0.88), int(ph22 * 0.49)))
exp_q41.save('public/pyq_images/chemistry/ch4/exp_q41.png')

print("All 11 explanation diagrams cropped successfully!")
