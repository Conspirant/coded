import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread("scratch/maths16/page_215_R.png")
h, w, _ = img.shape

# Table is located in the right column of page_215_R
# Let's crop the table area
table_crop = img[int(h*0.10):int(h*0.75), int(w*0.45):w]
cv2.imwrite("scratch/maths16/table_crop.png", table_crop)

res, _ = ocr(table_crop)
boxes = []
for box, text, score in res:
    xs = [p[0] for p in box]
    ys = [p[1] for p in box]
    boxes.append({
        'text': text.strip(),
        'x': (min(xs) + max(xs)) / 2,
        'y': (min(ys) + max(ys)) / 2
    })

print(f"Detected {len(boxes)} boxes in table.")
for b in sorted(boxes, key=lambda b: (b['y'], b['x'])):
    print(f"y={b['y']:.1f}, x={b['x']:.1f}: '{b['text']}'")
