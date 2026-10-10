from rapidocr_onnxruntime import RapidOCR
import pypdfium2 as pdfium
import json, sys, os, re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

ocr = RapidOCR()
pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

os.makedirs('scratch/phys23/clean_ocr', exist_ok=True)

# For each page 73 to 77, let's extract 4 columns
for pno in range(73, 78):
    p = pdf[pno - 1].render(scale=2.5).to_pil()
    w, h = p.size
    
    col_w = w / 4.0
    for col_idx in range(4):
        x1 = int(col_idx * col_w)
        x2 = int((col_idx + 1) * col_w)
        
        # On p77, questions end before the Answer key (y < h*0.5)
        if pno == 77:
            crop = p.crop((x1, 0, x2, int(h * 0.48)))
        elif pno == 73:
            # Chapter 23 starts in col 2/3 of p73
            crop = p.crop((x1, 0, x2, h))
        else:
            crop = p.crop((x1, 0, x2, h))
            
        c_path = f'scratch/phys23/clean_ocr/p{pno}_c{col_idx+1}.png'
        crop.save(c_path)
        
        res, _ = ocr(c_path)
        lines = []
        if res:
            # Sort by top-to-bottom y
            sorted_res = sorted(res, key=lambda b: (b[0][0][1]))
            lines = [r[1] for r in sorted_res]
            
        with open(f'scratch/phys23/clean_ocr/p{pno}_c{col_idx+1}.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"Page {pno} Col {col_idx+1}: {len(lines)} lines")

print("All columns cleanly OCRed!")
