import cv2
import os

os.makedirs('public/pyq_images/physics/ch21', exist_ok=True)

p67 = cv2.imread('scratch/phys21_fix/p67.png')
p68 = cv2.imread('scratch/phys21_fix/p68.png')
p69 = cv2.imread('scratch/phys21_fix/p69.png')

h, w, _ = p67.shape

# Let's inspect Page 69 c1 and c2 in detail:
# Col 1 of p69: x = 0 to int(w*0.255)
# Col 2 of p69: x = int(w*0.245) to int(w*0.505)

# 1. Q44 (Parallel/resonant LC circuit with 0.5 mH, 20 uF) on p69 c1:
# y roughly from 200 to 750
crop_q44 = p69[220:650, 40:int(w*0.255)]
cv2.imwrite('public/pyq_images/physics/ch21/q44_circuit.png', crop_q44)

# 2. Q45 (Series LCR with peak voltages 30V, 110V, 60V) - let's check if Q45 has a circuit diagram or not
# Let's check between y=650 and y=1150 in col 1 of p69
crop_q45_q46 = p69[650:1150, 40:int(w*0.255)]
cv2.imwrite('scratch/phys21_fix/p69_c1_middle.png', crop_q45_q46)

# 3. Q46 circuit (XC=4 ohm, XL=4 ohm, R=45 ohm) is inside this middle area:
# Let's crop just the circuit diagram of Q46
crop_q46 = p69[720:960, 40:int(w*0.255)]
cv2.imwrite('public/pyq_images/physics/ch21/q46_circuit.png', crop_q46)

# 4. Q51 (f0 vs C graphs) on p69 c2:
# y roughly from 650 to 1200 in col 2
crop_q51 = p69[700:1180, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/physics/ch21/q51_graphs.png', crop_q51)

# 5. Q52 (R, XL, XC vs f graph) on p69 c2:
# y roughly from 1200 to 1700 in col 2
crop_q52 = p69[1280:1680, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/physics/ch21/q52_graph.png', crop_q52)

# 6. Q9 on p67 (R-C series circuit)
crop_q9 = p67[1350:1650, int(w*0.245):int(w*0.505)]
cv2.imwrite('public/pyq_images/physics/ch21/q9_circuit.png', crop_q9)

# 7. Q35 on p68 (XL vs nu graphs)
crop_q35 = p68[1350:1650, int(w*0.495):int(w*0.755)]
cv2.imwrite('public/pyq_images/physics/ch21/q35_graphs.png', crop_q35)

# 8. Q41 on p68 (LCR with ammeter & voltmeter at resonance)
crop_q41 = p68[850:1280, int(w*0.745):w]
cv2.imwrite('public/pyq_images/physics/ch21/q41_circuit.png', crop_q41)

print("Saved preliminary crops for inspection!")
