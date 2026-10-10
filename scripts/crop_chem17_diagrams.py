import cv2
import os

os.makedirs("public/pyq_images/chemistry/ch17", exist_ok=True)

p155 = cv2.imread("scratch/chem17/pdf_p155.png")
p156 = cv2.imread("scratch/chem17/pdf_p156.png")
p157 = cv2.imread("scratch/chem17/pdf_p157.png")

h155, w155, _ = p155.shape
h156, w156, _ = p156.shape
h157, w157, _ = p157.shape

# Q31 is on p155 right half, left column of right page
# Let's crop Q31
# On p155: right page is x: w//2 to w. Left col of right page is x: w//2 to int(w*0.75)
q31_crop = p155[int(h155*0.27):int(h155*0.53), int(w155*0.49):int(w155*0.75)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q31.png", q31_crop)

# Q45 is on p156 left half, left column: x: 0 to int(w*0.26)
q45_crop = p156[int(h156*0.35):int(h156*0.46), int(w156*0.06):int(w156*0.26)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q45_reaction.png", q45_crop)

# Q46 is on p156 left half, left col
q46_crop = p156[int(h156*0.54):int(h156*0.65), int(w156*0.07):int(w156*0.24)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q46_reaction.png", q46_crop)

# Q48 is on p156 left half, bottom left & right
q48_crop = p156[int(h156*0.88):int(h156*0.965), int(w156*0.03):int(w156*0.26)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q48_reaction.png", q48_crop)

# Q51 is on p156 left half, right column: x: int(w*0.25) to int(w*0.5)
q51_crop = p156[int(h156*0.40):int(h156*0.72), int(w156*0.26):int(w156*0.49)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q51_reaction.png", q51_crop)

# Q54 is on p156 right half, left col: x: int(w*0.5) to int(w*0.75)
q54_crop = p156[int(h156*0.06):int(h156*0.49), int(w156*0.49):int(w156*0.72)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q54_reaction.png", q54_crop)

# Q55 is on p156 right half, left col
q55_crop = p156[int(h156*0.49):int(h156*0.59), int(w156*0.49):int(w156*0.71)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q55_reaction.png", q55_crop)

# Q58 is on p156 right half, right col: x: int(w*0.74) to w
q58_crop = p156[int(h156*0.07):int(h156*0.19), int(w156*0.74):int(w156*0.96)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q58_reaction.png", q58_crop)

# Q64 is on p157 left half: x: 0 to int(w*0.26)
q64_crop = p157[int(h157*0.13):int(h157*0.25), int(w157*0.03):int(w157*0.27)]
cv2.imwrite("public/pyq_images/chemistry/ch17/q64_reaction.png", q64_crop)

print("Cropped all Chem 17 reaction diagrams successfully.")
