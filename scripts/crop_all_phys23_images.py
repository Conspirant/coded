import cv2
import json, sys, os, numpy as np

# Pages 73, 74, 75, 76 contain the questions for Ray Optics (Physics Ch 23)
# Let's inspect the questions with diagrams and crop them accurately
os.makedirs('public/pyq_images/physics/ch23', exist_ok=True)

# List of known diagram crops in Physics Ch 23:
# Page 73:
# - Q7: Prism Total Internal Reflection / Critical angle diagram
# - Q9: Prism with incident ray at 45 deg
# Page 74:
# - Q12: Rectangular glass slab with incident ray (a) & (b)
# - Q16: Lens combination (convex + concave)
# - Q18: Glass block lateral shift
# - Q21: Prism refraction ray diagram with 60 deg incidence
# - Q23: Medium with refractive indices n1, n2, n3
# Page 75:
# - Q29: Prism reflection path
# - Q32: Water surface critical angle
# - Q36: Convex lens with object / image distance graph
# - Q41: Light ray passing through three media
# Page 76:
# - Q49: Biconvex lens sliced in half
# - Q58: Compound microscope / telescope ray diagram
# - Q66: Liquid lens combination

# Let's save helper to crop bounding boxes cleanly with margin
def crop_box(page_num, y1_r, y2_r, x1_r, x2_r, filename):
    img = cv2.imread(f'scratch/phys23/pdf_p{page_num}.png')
    h, w, _ = img.shape
    y1 = int(h * y1_r)
    y2 = int(h * y2_r)
    x1 = int(w * x1_r)
    x2 = int(w * x2_r)
    crop = img[y1:y2, x1:x2]
    out_path = f'public/pyq_images/physics/ch23/{filename}'
    cv2.imwrite(out_path, crop)
    print(f"Saved {out_path} ({crop.shape[1]}x{crop.shape[0]})")

print("Crop helper ready.")
