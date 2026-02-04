import pdfplumber

def inspect_pdf(pdf_path):
    output_file = "pdf_layout.txt"
    print(f"Inspecting {pdf_path} -> {output_file}...")
    
    with open(output_file, "w", encoding="utf-8") as f:
        with pdfplumber.open(pdf_path) as pdf:
            page = pdf.pages[0]
            
            f.write("--- TEXT EXTRACT ---\n")
            f.write(page.extract_text()[:2000] + "\n")
            f.write("\n--- TABLE EXTRACT ---\n")
            tables = page.extract_tables()
            if tables:
                for i, row in enumerate(tables[0][:10]):
                    f.write(f"Row {i}: {row}\n")
            else:
                f.write("No tables found automatically.\n")

if __name__ == "__main__":
    inspect_pdf('kcet-2025-round1-cutoffs.pdf')
