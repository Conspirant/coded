import cv2

p67 = cv2.imread('scratch/phys21_fix/p67.png')
p68 = cv2.imread('scratch/phys21_fix/p68.png')
p69 = cv2.imread('scratch/phys21_fix/p69.png')

h, w, _ = p67.shape

# 1. Q41 circuit on p68 col 4 (between y=920 and y=1160)
crop_q41 = p68[920:1160, int(w*0.75):int(w*0.99)]
cv2.imwrite('public/pyq_images/physics/ch21/q41_circuit.png', crop_q41)

# 2. Q44 (Parallel resonant circuit with L=0.5mH, C=20uF) on p69 col 1 (y=210 to 440)
crop_q44 = p69[210:440, 50:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q44_circuit.png', crop_q44)

# 3. Q45 (Series CLR with 30V, 110V, 60V) on p69 col 1 (y=500 to 720)
crop_q45 = p69[500:720, 50:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q45_circuit.png', crop_q45)

# 4. Q46 (Voltmeter & ammeter circuit with XC=4, XL=4, R=45) on p69 col 1 (y=800 to 1020)
crop_q46 = p69[800:1020, 50:int(w*0.25)]
cv2.imwrite('public/pyq_images/physics/ch21/q46_circuit.png', crop_q46)

# 5. Q51 (f0 vs C graphs - 4 subgraphs a, b, c, d) on p69 col 2 (y=840 to 1180)
crop_q51 = p69[840:1180, int(w*0.25):int(w*0.50)]
cv2.imwrite('public/pyq_images/physics/ch21/q51_graphs.png', crop_q51)

# 6. Q52 (R, XL, XC vs f resonance graph) on p69 col 2 (y=1320 to 1580)
crop_q52 = p69[1320:1580, int(w*0.25):int(w*0.50)]
cv2.imwrite('public/pyq_images/physics/ch21/q52_graph.png', crop_q52)

# 7. Q35 (XL vs nu 4 subgraphs) on p68 col 3 (y=480 to 760)
crop_q35 = p68[480:760, int(w*0.50):int(w*0.75)]
cv2.imwrite('public/pyq_images/physics/ch21/q35_graphs.png', crop_q35)

print("Saved clean, exact crops for Physics 21!")
