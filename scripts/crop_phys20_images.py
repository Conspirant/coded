import cv2
import os

out_dir = "public/pyq_images/physics/ch20"
os.makedirs(out_dir, exist_ok=True)

# p64 crops
p64 = cv2.imread("scratch/physics20/page_64.png")
h, w, _ = p64.shape

# Q3 diagram (electron moving near loop):
# Located on p64 around y: 0.30 to 0.45, x: 0 to w*0.25
q3_img = p64[int(h*0.30):int(h*0.48), int(w*0.02):int(w*0.25)]
cv2.imwrite(os.path.join(out_dir, "q3_diagram.png"), q3_img)

# Q12 diagram (spoke wheel in magnetic field):
# Located on p65 around y: 0.15 to 0.30, x: w*0.25 to w*0.50
p65 = cv2.imread("scratch/physics20/page_65.png")
q12_img = p65[int(h*0.15):int(h*0.32), int(w*0.25):int(w*0.50)]
cv2.imwrite(os.path.join(out_dir, "q12_diagram.png"), q12_img)

# Q24 diagram (ring falling towards current carrying wire):
# Located on p65 around y: 0.10 to 0.25, x: w*0.75 to w
q24_img = p65[int(h*0.08):int(h*0.22), int(w*0.75):w]
cv2.imwrite(os.path.join(out_dir, "q24_diagram.png"), q24_img)

print("Saved all Physics 20 cropped diagrams to", out_dir)
