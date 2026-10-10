import cv2
import os

out_dir = "public/pyq_images/chemistry/ch16"
os.makedirs(out_dir, exist_ok=True)

# Load images
p150 = cv2.imread("scratch/chem16/pdf_p150.png")
p151 = cv2.imread("scratch/chem16/pdf_p151.png")
p152 = cv2.imread("scratch/chem16/pdf_p152.png")
p153 = cv2.imread("scratch/chem16/pdf_p153.png")

# Let's check dimensions
print("p150 shape:", p150.shape)
print("p151 shape:", p151.shape)
