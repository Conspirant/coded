import cv2

p222 = cv2.imread("scratch/math17/pdf_p222.png")
h, w, _ = p222.shape

# The answer key is across the right page of p222 (x: w//2 to w)
cv2.imwrite("scratch/math17/p222_full_answer_key.png", p222[int(h*0.04):int(h*0.48), int(w*0.50):])
print("Saved p222_full_answer_key.png")
