from rapidocr_onnxruntime import RapidOCR
import pypdfium2 as pdfium
import sys, json

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

ocr = RapidOCR()
pdf = pdfium.PdfDocument('KCET Chapterwise PYQ 2006-24.pdf')

hints_text = ""
for pno in [77, 78, 79]:
    p = pdf[pno - 1].render(scale=3.0).to_pil()
    w, h = p.size
    # On p77, hints start below the answer key (y > 0.45*h)
    if pno == 77:
        crop = p.crop((0, int(h * 0.45), w, h))
    else:
        crop = p
    temp_p = f"scratch/phys23/hints_p{pno}.png"
    crop.save(temp_p)
    
    res, _ = ocr(temp_p)
    if res:
        sorted_res = sorted(res, key=lambda b: (b[0][0][1], b[0][0][0]))
        lines = [r[1] for r in sorted_res]
        hints_text += f"\n=== HINTS PAGE {pno} ===\n" + "\n".join(lines)

with open("scratch/phys23/all_hints_text.txt", "w", encoding="utf-8") as f:
    f.write(hints_text)

print(f"Extracted hints text: {len(hints_text)} characters.")
