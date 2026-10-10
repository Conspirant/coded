import cv2
import os

os.makedirs("public/pyq_images/physics/ch21", exist_ok=True)

p67 = cv2.imread("scratch/phys21/pdf_p67.png")
p68 = cv2.imread("scratch/phys21/pdf_p68.png")
p69 = cv2.imread("scratch/phys21/pdf_p69.png")

h67, w67, _ = p67.shape
h68, w68, _ = p68.shape
h69, w69, _ = p69.shape

# Q9 is on p67 right page: x: w//2 to w
# Let's crop Q9 circuit diagram
q9_crop = p67[int(h67*0.82):int(h67*0.93), int(w67*0.50):int(w67*0.75)]
cv2.imwrite("public/pyq_images/physics/ch21/q9_circuit.png", q9_crop)

# Q35 is on p68 right page: x: w//2 to w
q35_crop = p68[int(h68*0.42):int(h68*0.61), int(w68*0.50):int(w68*0.75)]
cv2.imwrite("public/pyq_images/physics/ch21/q35_graphs.png", q35_crop)

# Q41 is on p68 right page, col 4
q41_crop = p68[int(h68*0.42):int(h68*0.56), int(w68*0.75):]
cv2.imwrite("public/pyq_images/physics/ch21/q41_circuit.png", q41_crop)

# Q44 is on p69 left page, col 1
q44_crop = p69[int(h69*0.18):int(h69*0.35), int(w69*0.06):int(w69*0.26)]
cv2.imwrite("public/pyq_images/physics/ch21/q44_circuit.png", q44_crop)

# Q45 is on p69 left page, col 1
q45_crop = p69[int(h69*0.44):int(h69*0.56), int(w69*0.06):int(w69*0.26)]
cv2.imwrite("public/pyq_images/physics/ch21/q45_circuit.png", q45_crop)

# Q46 is on p69 left page, col 1
q46_crop = p69[int(h69*0.62):int(h69*0.76), int(w69*0.06):int(w69*0.26)]
cv2.imwrite("public/pyq_images/physics/ch21/q46_circuit.png", q46_crop)

# Q51 is on p69 left page, col 2
q51_crop = p69[int(h69*0.72):int(h69*0.93), int(w69*0.26):int(w69*0.49)]
cv2.imwrite("public/pyq_images/physics/ch21/q51_graphs.png", q51_crop)

# Q52 is on p69 left page, col 2
q52_crop = p69[int(h69*0.18):int(h69*0.42), int(w69*0.26):int(w69*0.49)]
cv2.imwrite("public/pyq_images/physics/ch21/q52_graph.png", q52_crop)

print("Cropped all Physics Chapter 21 diagrams successfully.")
