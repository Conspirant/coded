"""
Deep probe for the two fee PDFs:
- dental fee: extract all text lines (pdfplumber works, no tables)
- mbbs fee: confirm OCR needed, try extracting words/chars
"""
import pdfplumber

ROOT = r"c:\Users\risha\OneDrive\Desktop\coded-main"

# ===================== DENTAL FEE =====================
print("=" * 80)
print("DENTAL FEE - Full text extraction")
with pdfplumber.open(f"{ROOT}/dental fee_removed.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text:
            print(f"\n--- Page {i+1} ---")
            print(text)
        else:
            print(f"\n--- Page {i+1}: NO TEXT ---")
            # Try chars
            chars = page.chars
            print(f"  Chars found: {len(chars)}")
            if chars:
                print(f"  First char: {chars[0]}")

# ===================== MBBS FEE =====================
print("\n" + "=" * 80)
print("MBBS FEE - Checking if it's a scanned image")
with pdfplumber.open(f"{ROOT}/mbbs college wise fee_removed.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        chars = page.chars
        words = page.extract_words()
        images = page.images
        print(f"\n--- Page {i+1} ---")
        print(f"  Text: {'YES' if text else 'NO'}")
        print(f"  Chars: {len(chars)}")
        print(f"  Words: {len(words)}")
        print(f"  Images: {len(images)}")
        if text:
            lines = text.strip().split('\n')
            for line in lines[:10]:
                print(f"  | {line}")
        if images:
            img = images[0]
            print(f"  First image: width={img.get('width')}, height={img.get('height')}, x0={img.get('x0')}, y0={img.get('y0')}")
