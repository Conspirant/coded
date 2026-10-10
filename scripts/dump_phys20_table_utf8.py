import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread("scratch/physics20/page_65_R.png")
h, w, _ = img.shape

# Table is located in right column of page_65_R around y: 0.20 to 0.75
table_crop = img[int(h*0.20):int(h*0.75), int(w*0.48):w]
cv2.imwrite("scratch/physics20/table_crop.png", table_crop)

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

with open("scratch/physics20/table_boxes_utf8.txt", "w", encoding="utf-8") as f:
    f.write(f"Detected {len(boxes)} boxes in table.\n")
    for b in sorted(boxes, key=lambda b: (b['y'], b['x'])):
        f.write(f"y={b['y']:5.1f}, x={b['x']:5.1f}: '{b['text']}'\n")

print("Saved scratch/physics20/table_boxes_utf8.txt")
