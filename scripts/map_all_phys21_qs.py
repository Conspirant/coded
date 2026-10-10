import cv2
import re
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

p67 = cv2.imread('scratch/phys21_fix/p67.png')
p68 = cv2.imread('scratch/phys21_fix/p68.png')
p69 = cv2.imread('scratch/phys21_fix/p69.png')
h, w, _ = p67.shape

pages = [
    (67, p67),
    (68, p68),
    (69, p69)
]

found_qs = {}

for p_num, img in pages:
    cols = [
        ("c1", 0.00, 0.255),
        ("c2", 0.245, 0.505),
        ("c3", 0.495, 0.755),
        ("c4", 0.745, 1.00)
    ]
    for c_name, x1_r, x2_r in cols:
        x1 = int(w * x1_r)
        x2 = int(w * x2_r)
        crop = img[:, x1:x2]
        res, _ = ocr(crop)
        if res:
            for l in res:
                txt = l[1]
                m = re.match(r'^(\d{1,2})\.\s*(.*)', txt)
                if m:
                    q_no = int(m.group(1))
                    rest = m.group(2)
                    if 1 <= q_no <= 52:
                        found_qs[q_no] = (p_num, c_name, rest)

print(f"Total questions found by regex: {len(found_qs)}/52")
for q in range(1, 53):
    if q in found_qs:
        p, c, t = found_qs[q]
        safe_t = t[:60].encode('ascii', 'replace').decode('ascii')
        print(f"Q{q:2d} (p{p}_{c}): {safe_t}")
    else:
        print(f"Q{q:2d}: MISSING FROM DIRECT REGEX")
