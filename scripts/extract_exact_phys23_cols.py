from rapidocr_onnxruntime import RapidOCR
import pypdfium2 as pdfium
import cv2, os, json, re, sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

ocr = RapidOCR()
pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

# Let's crop all columns with high resolution
os.makedirs('scratch/phys23/accurate_cols', exist_ok=True)

# Pages 73 to 77 have questions
# Page 73: Chapter 23 starts at col 3
# Page 74: Cols 1, 2, 3, 4
# Page 75: Cols 1, 2, 3, 4
# Page 76: Cols 1, 2, 3, 4
# Page 77: Cols 1, 2 (questions up to 76)

all_col_images = []
for pno in range(73, 78):
    p = pdf[pno - 1].render(scale=3.0).to_pil()
    w, h = p.size
    col_w = w / 4.0
    for c_idx in range(4):
        if pno == 73 and c_idx < 2:
            continue # Chapter 22
        if pno == 77 and c_idx >= 2:
            continue # Answers / solutions
        x1 = int(c_idx * col_w)
        x2 = int((c_idx + 1) * col_w)
        y1 = 0
        y2 = int(h * 0.5) if pno == 77 else h
        crop = p.crop((x1, y1, x2, y2))
        c_path = f'scratch/phys23/accurate_cols/p{pno}_c{c_idx+1}.png'
        crop.save(c_path)
        all_col_images.append((pno, c_idx+1, c_path))

print(f"Prepared {len(all_col_images)} accurate column images.")

# Run OCR on all columns and build a list of text blocks with bounding boxes
parsed_columns = []
for pno, c_idx, c_path in all_col_images:
    res, _ = ocr(c_path)
    if res:
        # Sort lines by y-coordinate
        sorted_lines = sorted(res, key=lambda r: r[0][0][1])
        text_lines = [r[1] for r in sorted_lines]
        parsed_columns.append({
            'page': pno,
            'col': c_idx,
            'lines': text_lines,
            'raw_res': sorted_lines
        })

with open('scratch/phys23/accurate_cols/parsed_columns.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_columns, f, indent=2, ensure_ascii=False)

print("Saved OCR data for all columns.")
