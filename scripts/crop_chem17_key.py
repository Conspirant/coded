import cv2

p157 = cv2.imread("scratch/chem17/pdf_p157.png")
h, w, _ = p157.shape

# The answer key table is around the top/middle of page 157
# Let's crop the left half and right half of page 157 where the answer key is
cv2.imwrite("scratch/chem17/crops/p157_answer_key_area.png", p157[int(h*0.25):int(h*0.55), :int(w*0.55)])
print("Cropped answer key area.")
