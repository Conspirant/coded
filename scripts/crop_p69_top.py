import cv2

p69 = cv2.imread("scratch/phys21/pdf_p69.png")
h, w, _ = p69.shape

cv2.imwrite("scratch/phys21/p69_top_left.png", p69[:int(h*0.50), :int(w*0.55)])
cv2.imwrite("scratch/phys21/p69_top_right.png", p69[:int(h*0.50), int(w*0.50):])
print("Saved p69 top halves.")
