import cv2

p69 = cv2.imread("scratch/phys21/pdf_p69.png")
h, w, _ = p69.shape

# Crop the left half where the answer key is
cv2.imwrite("scratch/phys21/p69_answer_key.png", p69[int(h*0.35):int(h*0.75), :int(w*0.55)])
print("Saved p69_answer_key.png")
