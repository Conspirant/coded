import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread("scratch/chem16/ans_key_crop.png")

# Let's crop the table specifically:
# From ANSWERKEY header (y ~ 115) to EXPLANATIONS (y ~ 300)
h, w, _ = img.shape
table_img = img[100:300, 30:w-30]
cv2.imwrite("scratch/chem16/table_only.png", table_img)

# Run OCR on table
res, _ = ocr(table_img)
boxes = []
for box, text, score in res:
    xs = [p[0] for p in box]
    ys = [p[1] for p in box]
    boxes.append({
        'text': text.strip(),
        'x': (min(xs) + max(xs)) / 2,
        'y': (min(ys) + max(ys)) / 2,
        'box': [min(xs), min(ys), max(xs), max(ys)]
    })

print(f"Detected {len(boxes)} boxes in table.")
for b in sorted(boxes, key=lambda b: (b['y'], b['x'])):
    print(f"y={b['y']:.1f}, x={b['x']:.1f}: '{b['text']}'")
