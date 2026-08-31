"""
Probe all 6 NEET PDFs to understand table structure before full extraction.
"""
import pdfplumber
import json
import os

ROOT = r"c:\Users\risha\OneDrive\Desktop\coded-main"

files = {
    "medical_final": "UGNEET -2026 MEDICAL 1st ROUND FINAL SEAT ALLOTMENT LIST.pdf",
    "medical_mock": "UGNEET -2026 MEDICAL 1st ROUND MOCK SEAT ALLOTMENT LIST [17-08-2026].pdf",
    "dental_final": "UGNEET -2026 DENTAL 1st ROUND FINAL SEAT ALLOTMENT LIST.pdf",
    "dental_mock": "UGNEET -2026 DENTAL 1st ROUND MOCK SEAT ALLOTMENT LIST [17-08-2026].pdf",
    "dental_fee": "dental fee_removed.pdf",
    "mbbs_fee": "mbbs college wise fee_removed.pdf",
}

for key, filename in files.items():
    path = os.path.join(ROOT, filename)
    if not os.path.exists(path):
        print(f"\n{'='*80}")
        print(f"FILE NOT FOUND: {filename}")
        continue
    
    print(f"\n{'='*80}")
    print(f"FILE: {filename}")
    print(f"KEY: {key}")
    print(f"Size: {os.path.getsize(path)} bytes")
    
    try:
        with pdfplumber.open(path) as pdf:
            print(f"Pages: {len(pdf.pages)}")
            
            # Check first page
            page = pdf.pages[0]
            print(f"Page 1 dimensions: {page.width} x {page.height}")
            
            # Try extracting tables
            tables = page.extract_tables()
            print(f"Tables found on page 1: {len(tables)}")
            
            if tables:
                for ti, table in enumerate(tables):
                    print(f"\n  Table {ti}: {len(table)} rows")
                    # Print first 5 rows
                    for ri, row in enumerate(table[:5]):
                        print(f"    Row {ri}: {row}")
            else:
                # Try text extraction
                text = page.extract_text()
                if text:
                    lines = text.strip().split('\n')
                    print(f"Text lines on page 1: {len(lines)}")
                    for line in lines[:15]:
                        print(f"  | {line}")
                else:
                    print("  NO TEXT EXTRACTED (may need OCR)")
            
            # Also check page 2 if exists
            if len(pdf.pages) > 1:
                page2 = pdf.pages[1]
                tables2 = page2.extract_tables()
                print(f"\nPage 2 tables: {len(tables2)}")
                if tables2:
                    print(f"  Table 0 row count: {len(tables2[0])}")
                    for ri, row in enumerate(tables2[0][:3]):
                        print(f"    Row {ri}: {row}")
                        
            # Check last page
            last = pdf.pages[-1]
            tables_last = last.extract_tables()
            print(f"\nLast page ({len(pdf.pages)}) tables: {len(tables_last)}")
            if tables_last:
                last_table = tables_last[-1]
                print(f"  Last table rows: {len(last_table)}")
                for row in last_table[-3:]:
                    print(f"    {row}")
                    
    except Exception as e:
        print(f"ERROR: {e}")

print("\n\nDONE.")
