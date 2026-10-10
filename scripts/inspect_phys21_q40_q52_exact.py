import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

p68 = cv2.imread('scratch/phys21_fix/p68.png')
p69 = cv2.imread('scratch/phys21_fix/p69.png')
h, w, _ = p68.shape

print("=== Page 68 Col 4 ===")
c4_68 = p68[:, int(w*0.745):]
res, _ = ocr(c4_68)
for l in res:
    print(f"y={l[0][0][1]:4.0f}: {l[1]}")

print("\n=== Page 69 Col 1 ===")
c1_69 = p69[:, 0:int(w*0.255)]
res, _ = ocr(c1_69)
for l in res:
    print(f"y={l[0][0][1]:4.0f}: {l[1]}")

print("\n=== Page 69 Col 2 ===")
c2_69 = p69[:, int(w*0.245):int(w*0.505)]
res, _ = ocr(c2_69)
for l in res:
    print(f"y={l[0][0][1]:4.0f}: {l[1]}")
