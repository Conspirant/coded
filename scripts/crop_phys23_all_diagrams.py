import cv2
import os

pdf_pages = {
    74: cv2.imread('scratch/phys23/pdf_p74.png'),
    75: cv2.imread('scratch/phys23/pdf_p75.png'),
    76: cv2.imread('scratch/phys23/pdf_p76.png'),
    77: cv2.imread('scratch/phys23/pdf_p77.png')
}

os.makedirs('public/pyq_images/physics/ch23', exist_ok=True)

# Helper to crop
def crop_and_save(pno, y1_r, y2_r, x1_r, x2_r, fname):
    img = pdf_pages.get(pno)
    if img is None:
        print(f"Page {pno} not loaded")
        return
    h, w, _ = img.shape
    crop = img[int(h*y1_r):int(h*y2_r), int(w*x1_r):int(w*x2_r)]
    out_p = f'public/pyq_images/physics/ch23/{fname}'
    cv2.imwrite(out_p, crop)
    print(f"Saved {out_p} ({crop.shape[1]}x{crop.shape[0]})")

# Page 74:
# Q14 (right angled prism with red, green, blue rays): Column 1, middle
crop_and_save(74, 0.40, 0.58, 0.02, 0.24, 'q14_prism.png')

# Q23 (A, B, C parallel media with ray): Column 3, bottom
crop_and_save(74, 0.65, 0.85, 0.52, 0.74, 'q23_media.png')

# Page 75:
# Q41 (ray through media): Column 2/3
crop_and_save(75, 0.60, 0.80, 0.52, 0.74, 'q41_media.png')

# Page 76:
# Q49 (lens cut): Column 1
crop_and_save(76, 0.35, 0.52, 0.02, 0.24, 'q49_lens.png')

# Q58 (telescope/microscope): Column 3
crop_and_save(76, 0.30, 0.50, 0.52, 0.74, 'q58_optical.png')

print("Cropped authentic Physics Ch 23 diagrams!")
