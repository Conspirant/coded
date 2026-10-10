import cv2
import os

os.makedirs("public/pyq_images/chemistry/ch17", exist_ok=True)

# Let's inspect page halves to locate reaction schemes:
p154 = cv2.imread("scratch/chem17/pdf_p154.png")
p155 = cv2.imread("scratch/chem17/pdf_p155.png")
p156 = cv2.imread("scratch/chem17/pdf_p156.png")
p157 = cv2.imread("scratch/chem17/pdf_p157.png")

# Let's save halves for review
cv2.imwrite("scratch/chem17/crops/p154_right.png", p154[:, p154.shape[1]//2:])
cv2.imwrite("scratch/chem17/crops/p155_left.png", p155[:, :p155.shape[1]//2])
cv2.imwrite("scratch/chem17/crops/p155_right.png", p155[:, p155.shape[1]//2:])
cv2.imwrite("scratch/chem17/crops/p156_left.png", p156[:, :p156.shape[1]//2])
cv2.imwrite("scratch/chem17/crops/p156_right.png", p156[:, p156.shape[1]//2:])
cv2.imwrite("scratch/chem17/crops/p157_left.png", p157[:, :p157.shape[1]//2])

print("Saved page halves for Chem 17 inspection.")
