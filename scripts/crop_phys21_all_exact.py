import cv2

p67 = cv2.imread('scratch/phys21_fix/p67.png')
p68 = cv2.imread('scratch/phys21_fix/p68.png')
p69 = cv2.imread('scratch/phys21_fix/p69.png')
h, w, _ = p67.shape

# 1. Q32 circuit (Bulb, coil, iron rod, key K) on p68 col 2 (y=1490 to 1720)
crop_q32 = p68[1500:1720, int(w*0.25):int(w*0.50)]
cv2.imwrite('public/pyq_images/physics/ch21/q32_circuit.png', crop_q32)

# 2. Q35 (XL vs nu graphs) on p68 col 3 (y=880 to 1220)
crop_q35 = p68[880:1220, int(w*0.50):int(w*0.75)]
cv2.imwrite('public/pyq_images/physics/ch21/q35_graphs.png', crop_q35)

# 3. Q41 (Circuit with VL=50V, VC=50V, R=100) on p68 col 4 (y=920 to 1160)
crop_q41 = p68[920:1160, int(w*0.75):int(w*0.99)]
cv2.imwrite('public/pyq_images/physics/ch21/q41_circuit.png', crop_q41)

# 4. Q44 (Parallel resonant circuit L=0.5mH, C=20uF) on p69 col 1 (y=210 to 345)
crop_q44 = p69[215:345, 70:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q44_circuit.png', crop_q44)

# 5. Q45 (Series CLR 30V, 110V, 60V) on p69 col 1 (y=540 to 650)
crop_q45 = p69[540:650, 70:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q45_circuit.png', crop_q45)

# 6. Q46 (Voltmeter & ammeter circuit XC=4, XL=4, R=45, 90V) on p69 col 1 (y=855 to 985)
crop_q46 = p69[855:985, 70:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q46_circuit.png', crop_q46)

# 7. Q51 (f0 vs C 4 graphs) on p69 col 2 (y=840 to 1160)
crop_q51 = p69[840:1160, int(w*0.25):int(w*0.50)]
cv2.imwrite('public/pyq_images/physics/ch21/q51_graphs.png', crop_q51)

# 8. Q52 (R, XL, XC vs f resonance graph) on p69 col 2 (y=1320 to 1560)
crop_q52 = p69[1320:1560, int(w*0.25):int(w*0.50)]
cv2.imwrite('public/pyq_images/physics/ch21/q52_graph.png', crop_q52)

print("All exact Physics 21 diagram crops saved successfully!")
