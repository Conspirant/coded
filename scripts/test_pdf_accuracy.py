import pdfplumber
import sys

def test_page(pdf_path, page_num):
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_num - 1]
        words = page.extract_words(keep_blank_chars=False)
        
        # Group by Y coordinate (with some tolerance)
        rows = {}
        for w in words:
            # Round to near integral for grouping
            y = round(w['top'], 1)
            # Find an existing row within 2.0 pts
            matched_y = None
            for existing_y in rows:
                if abs(existing_y - y) <= 2.0:
                    matched_y = existing_y
                    break
            if matched_y is None:
                matched_y = y
                rows[matched_y] = []
            rows[matched_y].append(w)
            
        print(f"--- Page {page_num} Words grouped by Y ---")
        sorted_ys = sorted(rows.keys())
        for y in sorted_ys[:25]:  # show first 25 rows
            row_words = sorted(rows[y], key=lambda x: x['x0'])
            text = "  ".join([f"[{w['x0']:.0f}]{w['text']}" for w in row_words])
            print(f"Y={y:5.1f} | {text}")

if __name__ == "__main__":
    test_page(r"c:\Users\risha\OneDrive\Desktop\coded-main\public\cutoffs\kcet-2025-round2-cutoffs.pdf", 5)
