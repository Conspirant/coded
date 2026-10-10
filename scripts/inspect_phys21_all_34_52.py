import cv2
import re
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

p68 = cv2.imread('scratch/phys21_fix/p68.png')
p69 = cv2.imread('scratch/phys21_fix/p69.png')
h, w, _ = p68.shape

# Let's inspect each column of page 68 and 69
for name, p_img, cols in [
    ("Page 68", p68, [("c2", 0.245, 0.505), ("c3", 0.495, 0.755), ("c4", 0.745, 1.00)]),
    ("Page 69", p69, [("c1", 0.00, 0.255), ("c2", 0.245, 0.505)])
]:
    print(f"\n==================== {name} ====================")
    for c_name, x1_r, x2_r in cols:
        crop = p_img[:, int(w*x1_r):int(w*x2_r)]
        res, _ = ocr(crop)
        if res:
            print(f"\n--- {c_name} ---")
            for l in res:
                safe_txt = l[1].encode('ascii', 'replace').decode('ascii')
                print(f"y={l[0][0][1]:4.0f}: {safe_txt}")
