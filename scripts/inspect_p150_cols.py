import cv2
import os

# Let's inspect text lines from the OCR column files
def print_file_snippet(fname, start=0, end=50):
    path = os.path.join("scratch/chem16/ocr_cols", fname)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            print(f"=== {fname} ({len(lines)} lines) ===")
            for i, l in enumerate(lines[start:end], start=start+1):
                print(f"{i:3d}: {l.strip()}")

print_file_snippet("p150_L_col2.txt", 0, 50)
print_file_snippet("p150_R_col1.txt", 0, 50)
print_file_snippet("p150_R_col2.txt", 0, 50)
