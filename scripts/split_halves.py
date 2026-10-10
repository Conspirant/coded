import cv2
import os

os.makedirs("scratch/chem16/q_crops", exist_ok=True)
p150 = cv2.imread("scratch/chem16/pdf_p150.png")
p151 = cv2.imread("scratch/chem16/pdf_p151.png")
h, w, _ = p150.shape

# Let's save 4 quadrants for p150 and p151
cv2.imwrite("scratch/chem16/q_crops/p150_L.png", p150[:, :w//2])
cv2.imwrite("scratch/chem16/q_crops/p150_R.png", p150[:, w//2:])
cv2.imwrite("scratch/chem16/q_crops/p151_L.png", p151[:, :w//2])
cv2.imwrite("scratch/chem16/q_crops/p151_R.png", p151[:, w//2:])

print("Saved page halves.")
