import pymupdf

doc_p = pymupdf.open("public/puc-papers/KSEAB_2ndPUC_Physics_Question_Bank_2025-26.pdf")
for p in [49, 55, 62, 66, 74, 79]:
    print(f"=== PHY p{p+1} ===")
    print(doc_p[p].get_text("text")[-600:])

doc_m = pymupdf.open("public/puc-papers/KSEAB_2ndPUC_Mathematics_Question_Bank_2025-26.pdf")
for p in [105, 106, 107]:
    print(f"=== MATH p{p+1} ===")
    print(doc_m[p].get_text("text")[:500])
