import fitz

doc = fitz.open("KCET Chapterwise PYQ 2006-24.pdf")

for i in range(190, 205):
    text = doc[i].get_text()
    first_line = text.split('\n')[0] if text else ''
    print(f"PDF page {i+1}: length={len(text)}, first_line={first_line[:40]}")
    if "106." in text or "102." in text or "Matrices" in text:
        print(f"   -> Contains keywords!")
