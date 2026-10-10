import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread("scratch/chem16/ans_key_crop.png")

# Run OCR with bounding boxes
res, _ = ocr(img)

# Sort bounding boxes into rows and columns
items = []
for box, text, score in res:
    # box is [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
    xs = [p[0] for p in box]
    ys = [p[1] for p in box]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    items.append({
        'text': text.strip(),
        'min_x': min_x,
        'max_x': max_x,
        'min_y': min_y,
        'max_y': max_y,
        'center_x': (min_x + max_x) / 2,
        'center_y': (min_y + max_y) / 2,
    })

# Print all items with coordinates
items.sort(key=lambda it: (it['center_y'], it['center_x']))
print("--- ALL BOXES SORTED BY Y, X ---")
for it in items:
    if it['min_y'] < 200: # only the table region
        print(f"y={it['center_y']:.1f}, x={it['center_x']:.1f}: {it['text']}")
