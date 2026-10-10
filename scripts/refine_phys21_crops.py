import cv2

p69 = cv2.imread('scratch/phys21_fix/p69.png')
h, w, _ = p69.shape

# Q44 circuit only (y=210 to 350, x=50 to 0.25*w)
crop_q44 = p69[215:345, 70:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q44_circuit.png', crop_q44)

# Q45 circuit only (y=530 to 650, x=50 to 0.25*w)
crop_q45 = p69[540:650, 70:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q45_circuit.png', crop_q45)

# Q46 circuit only (y=840 to 980, x=50 to 0.25*w)
crop_q46 = p69[855:985, 70:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q46_circuit.png', crop_q46)

print("Saved refined clean circuit crops for Q44, Q45, Q46!")
