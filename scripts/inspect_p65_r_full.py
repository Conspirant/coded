import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
img = cv2.imread("scratch/physics20/page_65_R.png")
h, w, _ = img.shape

# Let's crop the entire right half of page 65
p65_r_crop = img[:, int(w*0.5):]
res, _ = ocr(p65_r_crop)

for box, text, score in res:
    print(text)
