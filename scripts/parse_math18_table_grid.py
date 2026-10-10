import cv2
import re
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread('scratch/math18/answer_key_box.png')
h, w, _ = img.shape

# The answer key is in the lower portion of answer_key_box.png
# Let's crop from y=400 to h
table_crop = img[400:h, :]
cv2.imwrite('scratch/math18/table_only.png', table_crop)

res, _ = ocr(table_crop)
print("Table lines:")
if res:
    for line in sorted(res, key=lambda x: (x[0][0][1], x[0][0][0])):
        txt = line[1].encode('ascii', 'replace').decode('ascii')
        print(f"y={line[0][0][1]:4.0f}, x={line[0][0][0]:4.0f}: {txt}")
