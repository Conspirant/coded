import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

p72 = cv2.imread('scratch/phys22/pdf_p72.png')
p73 = cv2.imread('scratch/phys22/pdf_p73.png')

print(f"p72 shape: {p72.shape}, p73 shape: {p73.shape}")

# Let's inspect all text on page 72 and page 73 cols 1-2
res72, _ = ocr(p72)
print("\n=== Page 72 ===")
if res72:
    for l in sorted(res72, key=lambda x: (x[0][0][1], x[0][0][0])):
        txt = l[1].encode('ascii', 'replace').decode('ascii')
        print(f"y={l[0][0][1]:4.0f}, x={l[0][0][0]:4.0f}: {txt}")

res73, _ = ocr(p73[:, 0:int(p73.shape[1]*0.52)])
print("\n=== Page 73 Cols 1-2 ===")
if res73:
    for l in sorted(res73, key=lambda x: (x[0][0][1], x[0][0][0])):
        txt = l[1].encode('ascii', 'replace').decode('ascii')
        print(f"y={l[0][0][1]:4.0f}, x={l[0][0][0]:4.0f}: {txt}")
