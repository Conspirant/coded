import cv2
import os

out_dir = "public/pyq_images/chemistry/ch16"
os.makedirs(out_dir, exist_ok=True)

# p150 crops
p150 = cv2.imread("scratch/chem16/pdf_p150.png")
h, w, _ = p150.shape

# Q16 reaction scheme (Cumene process):
# Located on p150 around y: 420-520, x: w*0.50 to w*0.75
q16_img = p150[420:530, int(w*0.50):int(w*0.75)]
cv2.imwrite(os.path.join(out_dir, "q16_scheme.png"), q16_img)

# Q18 reaction scheme:
q18_img = p150[675:740, int(w*0.50):int(w*0.75)]
cv2.imwrite(os.path.join(out_dir, "q18_scheme.png"), q18_img)

# Q19 reaction & options:
q19_img = p150[830:1120, int(w*0.50):int(w*0.75)]
cv2.imwrite(os.path.join(out_dir, "q19_options.png"), q19_img)

# Q22 reaction sequence:
q22_img = p150[505:610, int(w*0.75):w]
cv2.imwrite(os.path.join(out_dir, "q22_scheme.png"), q22_img)

# Q23 options:
q23_img = p150[750:880, int(w*0.75):w]
cv2.imwrite(os.path.join(out_dir, "q23_options.png"), q23_img)

# p151 crops
p151 = cv2.imread("scratch/chem16/pdf_p151.png")
# Q32 scheme:
q32_img = p151[310:480, int(w*0.25):int(w*0.50)]
cv2.imwrite(os.path.join(out_dir, "q32_scheme.png"), q32_img)

# Q37 options:
q37_img = p151[380:560, int(w*0.50):int(w*0.75)]
cv2.imwrite(os.path.join(out_dir, "q37_options.png"), q37_img)

# Q38 scheme:
q38_img = p151[600:715, int(w*0.50):int(w*0.75)]
cv2.imwrite(os.path.join(out_dir, "q38_scheme.png"), q38_img)

# Q45 scheme:
q45_img = p151[410:535, int(w*0.75):w]
cv2.imwrite(os.path.join(out_dir, "q45_scheme.png"), q45_img)

print("All Chem 16 diagram crops saved to", out_dir)
